// src/bybitCabinetWorker.ts  (полная версия)
import { PrismaClient, type BybitCabinet } from './generated/prisma';
import axios, { AxiosError } from 'axios';
import crypto from 'crypto';

const prisma = new PrismaClient();

/* ───────── конфигурация ───────── */
const BYBIT = 'https://api.bybit.com';
const RECV  = 5_000;
const POLL  = 60_000;
const PAGE  = 50;
const CHAT_WAIT = 1_000;
const DB_WAIT   = 2_000;
const DB_RETRIES = 3;
const PHONE_RE = /(?:(?:\+?7|8)[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g;

/* ───────── синхронизация времени ───────── */
let Δ = 0;
async function syncTime() {
  const { data } = await axios.get(`${BYBIT}/v5/market/time`);
  Δ = Math.floor(Number(data?.result?.timeNano ?? 0) / 1e6) - Date.now();
  console.log(`⏱️  Time sync Δ=${Δ} ms`);
}
const ts = () => Date.now() + Δ;

/* ───────── утилиты ───────── */
const hmac = (sec: string, str: string) => crypto.createHmac('sha256', sec).update(str).digest('hex');
function headers(key: string, sec: string, body: object) {
  const t = ts().toString(), b = JSON.stringify(body);
  return {
    'X-BAPI-API-KEY': key,
    'X-BAPI-TIMESTAMP': t,
    'X-BAPI-RECV-WINDOW': RECV.toString(),
    'X-BAPI-SIGN': hmac(sec, `${t}${key}${RECV}${b}`),
    'Content-Type': 'application/json'
  };
}
const phones = (txt: string) => [...new Set(
  (txt.match(PHONE_RE) ?? []).map(p => {
    let d = p.replace(/\D/g, '');
    if (d.length === 10) d = '+7' + d;
    if (d.length === 11 && d.startsWith('8')) d = '+7' + d.slice(1);
    return d.startsWith('+7') && d.length === 12 ? d : null;
  }).filter(Boolean) as string[]
)];

const rc = (e: AxiosError | Error) => (e as AxiosError).response?.data?.ret_code ?? (e as AxiosError).response?.data?.retCode;
const denied  = (e: AxiosError | Error) => /permission denied/i.test((e as Error).message) || [912000014,10005].includes(rc(e));
const missOrd = (e: AxiosError | Error) => /Failed to retrieve order number/i.test((e as Error).message) || rc(e) === 912200165;

/* ───────── API ───────── */
async function listOrders(c: BybitCabinet) {
  const body = { page:1, size:20, side:[0], status:[50] };          // Buy+Completed
  const { data } = await axios.post(`${BYBIT}/v5/p2p/order/simplifyList`, body,
                                    { headers: headers(c.bybitApiToken!, c.bybitApiSecret!, body) });
  if (data?.ret_code ?? data?.retCode) throw new Error(`${data.ret_msg || data.retMsg}`);
  console.log(data.result?.items)
  return data.result?.items ?? [];
}
async function chat(orderNo: string, c: BybitCabinet) {
  let page = 1, buf = '', more = true;
  while (more) {
    const body = { orderId: orderNo, size: PAGE, currentPage: page };
    const { data } = await axios.post(`${BYBIT}/v5/p2p/order/message/listpage`, body,
                                      { headers: headers(c.bybitApiToken!, c.bybitApiSecret!, body) });
    if (data?.ret_code ?? data?.retCode) throw new Error(`${data.ret_msg || data.retMsg}`);
    (data.result?.result ?? []).forEach((m: any) =>
      m.contentType === 'str' && (m.msgType === 1 || m.msgType === 5) && (buf += `${m.message}\n`));
    more = page++ < Number(data.result?.totalPages ?? 1);
    if (more) await new Promise(r => setTimeout(r, CHAT_WAIT));
  }
  return buf;
}

/* ───────── сводка ───────── */
interface Sum { ok:number; skip:number; add:number; upd:number; phone:number; chatErr:number; deny:number; other:number; }
const newsum = ():Sum => ({ok:0,skip:0,add:0,upd:0,phone:0,chatErr:0,deny:0,other:0});
const slog = (s:Sum) => console.log(`📊  OK ${s.ok} skip ${s.skip} | +${s.add}/upd ${s.upd} | phones ${s.phone} | chatErr ${s.chatErr} perm ${s.deny} other ${s.other}`);

/* ───────── запись ───────── */
async function persist(c: BybitCabinet, it: any, ph: string[], s: Sum) {
  const orderNo = it.orderNo ?? it.orderId ?? it.id;
  const exists  = await prisma.bybitOrderInfo.findFirst({ where:{ orderNo } });

  /* --- BybitOrderInfo --- */
  await prisma.bybitOrderInfo.upsert({
    where:{ orderNo_bybitCabinetId:{ orderNo, bybitCabinetId:c.id } },
    create:{
      orderNo, bybitCabinetId:c.id,
      phoneNumbers:ph,
      dateTime:new Date(+it.createDate),
      status:String(it.status), type:'BUY',
      amount:Math.round(+it.amount),
      unitPrice:+it.price,
      totalPrice:+it.price*+it.amount,
      originalData:it,
      processed:false,
      createdAt:new Date(),
      updatedAt:new Date()       // <<<<< FIX
    },
    update:{ phoneNumbers:ph, updatedAt:new Date() }
  });

  ph.length && (s.phone += ph.length);
  exists ? s.upd++ : s.add++;
}

/* ───────── кабинет ───────── */
async function handle(c: BybitCabinet, s: Sum) {
  try {
    const list = await listOrders(c); s.ok++;
    for (const it of list) {
      const id = it.orderNo ?? it.orderId ?? it.id;
      if (!id) { s.other++; continue; }

      try {
        const txt = await chat(id, c);
        await persist(c, it, phones(txt), s);
        await new Promise(r => setTimeout(r, CHAT_WAIT));
      } catch (e) {
        missOrd(e as AxiosError) ? s.chatErr++ : s.other++;
        console.warn(`⚠️  Order ${id}: ${(e as Error).message}`);
      }
    }
  } catch (e) {
    denied(e as AxiosError) ? (s.deny++, s.skip++, console.warn(`⛔  Cabinet #${c.id} skipped — permission denied`))
                            : (s.other++, console.error(`❌  Cabinet #${c.id}: ${(e as Error).message}`));
  }
}

/* ───────── цикл ───────── */
async function main() {
  await syncTime();
  while (true) {
    const sum = newsum();
    for (let i=1;;i++) {
      try {
        const cabs = await prisma.bybitCabinet.findMany({
          where:{ bybitApiToken:{not:null}, bybitApiSecret:{not:null} }
        });
        for (const c of cabs) await handle(c, sum);
        break;
      } catch (e) {
        if (i>=DB_RETRIES) throw e;
        console.error(`DB retry ${i}/${DB_RETRIES}`); await new Promise(r=>setTimeout(r,DB_WAIT));
      }
    }
    slog(sum);
    await new Promise(r=>setTimeout(r,POLL));
  }
}

/* ───────── завершение ───────── */
['SIGINT','SIGTERM'].forEach(sig=>process.on(sig as NodeJS.Signals, async ()=>{ await prisma.$disconnect(); process.exit(0); }));
main().catch(async e=>{ console.error(e); await prisma.$disconnect(); process.exit(1); });
