
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AdminScalarFieldEnum = {
  id: 'id',
  telegramId: 'telegramId',
  username: 'username',
  firstName: 'firstName',
  lastName: 'lastName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  userId: 'userId',
  timestamp: 'timestamp',
  oldValue: 'oldValue',
  newValue: 'newValue',
  cardBalanceId: 'cardBalanceId',
  cardId: 'cardId',
  cardPouringId: 'cardPouringId'
};

exports.Prisma.BalanceEntryScalarFieldEnum = {
  id: 'id',
  date: 'date',
  time: 'time',
  amount: 'amount',
  currency: 'currency',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  section: 'section'
};

exports.Prisma.BybitMatchScalarFieldEnum = {
  id: 'id',
  idexTransactionId: 'idexTransactionId',
  bybitTransactionId: 'bybitTransactionId',
  timeDifference: 'timeDifference',
  grossExpense: 'grossExpense',
  grossIncome: 'grossIncome',
  grossProfit: 'grossProfit',
  profitPercentage: 'profitPercentage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BybitOrderInfoScalarFieldEnum = {
  id: 'id',
  phoneNumbers: 'phoneNumbers',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  orderNo: 'orderNo',
  userId: 'userId'
};

exports.Prisma.BybitTransactionScalarFieldEnum = {
  id: 'id',
  orderNo: 'orderNo',
  userId: 'userId',
  counterparty: 'counterparty',
  status: 'status',
  extractedPhones: 'extractedPhones',
  lastAttemptError: 'lastAttemptError',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  amount: 'amount',
  asset: 'asset',
  dateTime: 'dateTime',
  originalData: 'originalData',
  processed: 'processed',
  totalPrice: 'totalPrice',
  type: 'type',
  unitPrice: 'unitPrice'
};

exports.Prisma.CardScalarFieldEnum = {
  id: 'id',
  externalId: 'externalId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  provider: 'provider',
  cardNumber: 'cardNumber',
  bank: 'bank',
  phoneNumber: 'phoneNumber',
  appPin: 'appPin',
  terminalPin: 'terminalPin',
  comment: 'comment',
  picachu: 'picachu',
  status: 'status',
  cardPrice: 'cardPrice',
  isPaid: 'isPaid',
  letterCode: 'letterCode',
  actor: 'actor',
  inWork: 'inWork',
  activePaymentMethod: 'activePaymentMethod'
};

exports.Prisma.CardBalanceScalarFieldEnum = {
  id: 'id',
  cardId: 'cardId',
  date: 'date',
  startBalance: 'startBalance',
  endBalance: 'endBalance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  comment: 'comment'
};

exports.Prisma.CardPouringScalarFieldEnum = {
  id: 'id',
  cardId: 'cardId',
  pouringDate: 'pouringDate',
  initialAmount: 'initialAmount',
  initialDate: 'initialDate',
  finalAmount: 'finalAmount',
  finalDate: 'finalDate',
  pouringAmount: 'pouringAmount',
  withdrawalAmount: 'withdrawalAmount',
  withdrawalDate: 'withdrawalDate',
  collectorName: 'collectorName',
  status: 'status',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CellScalarFieldEnum = {
  id: 'id',
  rowId: 'rowId',
  columnId: 'columnId',
  value: 'value',
  displayValue: 'displayValue',
  calculatedValue: 'calculatedValue',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ColumnScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  tableId: 'tableId',
  width: 'width',
  isRequired: 'isRequired',
  isFilterable: 'isFilterable',
  isSummable: 'isSummable',
  defaultValue: 'defaultValue',
  format: 'format',
  order: 'order',
  options: 'options',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  cellId: 'cellId',
  text: 'text',
  author: 'author',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FilterScalarFieldEnum = {
  id: 'id',
  name: 'name',
  tableId: 'tableId',
  columnId: 'columnId',
  operator: 'operator',
  value: 'value',
  secondValue: 'secondValue',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FinRowScalarFieldEnum = {
  id: 'id',
  date: 'date',
  time: 'time',
  shift: 'shift',
  startBalance: 'startBalance',
  endBalance: 'endBalance',
  employeeId: 'employeeId',
  usdtAmount: 'usdtAmount',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  currency: 'currency',
  section: 'section',
  exchangeRate: 'exchangeRate'
};

exports.Prisma.FinRowExpenseScalarFieldEnum = {
  id: 'id',
  finRowId: 'finRowId',
  expenseType: 'expenseType',
  amount: 'amount',
  date: 'date',
  time: 'time',
  period: 'period',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  currency: 'currency',
  section: 'section'
};

exports.Prisma.IdexCabinetScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  idexId: 'idexId',
  login: 'login',
  password: 'password'
};

exports.Prisma.IdexSyncOrderScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  cabinetId: 'cabinetId',
  processed: 'processed',
  status: 'status',
  startSyncAt: 'startSyncAt',
  endSyncAt: 'endSyncAt',
  pages: 'pages'
};

exports.Prisma.IdexTransactionScalarFieldEnum = {
  id: 'id',
  externalId: 'externalId',
  paymentMethodId: 'paymentMethodId',
  wallet: 'wallet',
  amount: 'amount',
  total: 'total',
  status: 'status',
  approvedAt: 'approvedAt',
  expiredAt: 'expiredAt',
  createdAtExternal: 'createdAtExternal',
  updatedAtExternal: 'updatedAtExternal',
  extraData: 'extraData',
  cabinetId: 'cabinetId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ImportExportScalarFieldEnum = {
  id: 'id',
  tableId: 'tableId',
  name: 'name',
  type: 'type',
  mappings: 'mappings',
  options: 'options',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MatchScalarFieldEnum = {
  id: 'id',
  idexTransactionId: 'idexTransactionId',
  transactionId: 'transactionId',
  timeDifference: 'timeDifference',
  grossExpense: 'grossExpense',
  grossIncome: 'grossIncome',
  grossProfit: 'grossProfit',
  profitPercentage: 'profitPercentage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationSettingsScalarFieldEnum = {
  id: 'id',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PasswordScalarFieldEnum = {
  id: 'id',
  name: 'name',
  login: 'login',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  comment: 'comment'
};

exports.Prisma.ReportNotificationScalarFieldEnum = {
  id: 'id',
  notificationTime: 'notificationTime',
  reportReceived: 'reportReceived',
  reportTime: 'reportTime',
  adminNotified: 'adminNotified',
  adminNotifyTime: 'adminNotifyTime',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RowScalarFieldEnum = {
  id: 'id',
  tableId: 'tableId',
  order: 'order',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SalaryScalarFieldEnum = {
  id: 'id',
  fullName: 'fullName',
  position: 'position',
  startDate: 'startDate',
  payday: 'payday',
  paydayMonth: 'paydayMonth',
  fixedSalary: 'fixedSalary',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  comment: 'comment',
  periodic: 'periodic',
  payday2: 'payday2',
  payday3: 'payday3',
  section: 'section'
};

exports.Prisma.SalaryDebtScalarFieldEnum = {
  id: 'id',
  salaryId: 'salaryId',
  amount: 'amount',
  debtDate: 'debtDate',
  description: 'description',
  isPaid: 'isPaid',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SalaryEarningScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  earningDate: 'earningDate',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  salaryId: 'salaryId'
};

exports.Prisma.SalaryPaymentScalarFieldEnum = {
  id: 'id',
  salaryId: 'salaryId',
  amount: 'amount',
  paymentDate: 'paymentDate',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  currency: 'currency'
};

exports.Prisma.SectionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  slug: 'slug',
  isActive: 'isActive',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShiftReportScalarFieldEnum = {
  id: 'id',
  date: 'date',
  time: 'time',
  shift: 'shift',
  startBalance: 'startBalance',
  endBalance: 'endBalance',
  employeeId: 'employeeId',
  usdtAmount: 'usdtAmount',
  currency: 'currency',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShiftReportExpenseScalarFieldEnum = {
  id: 'id',
  shiftReportId: 'shiftReportId',
  expenseType: 'expenseType',
  amount: 'amount',
  currency: 'currency',
  date: 'date',
  time: 'time',
  period: 'period',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SystemSettingsScalarFieldEnum = {
  id: 'id',
  reportReminderInterval: 'reportReminderInterval',
  reportWaitTime: 'reportWaitTime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TableScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  sectionId: 'sectionId',
  isSearchable: 'isSearchable',
  hasPagination: 'hasPagination',
  pageSize: 'pageSize',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TelegramAccountScalarFieldEnum = {
  id: 'id',
  telegramId: 'telegramId',
  username: 'username',
  firstName: 'firstName',
  lastName: 'lastName',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  externalId: 'externalId',
  orderNo: 'orderNo',
  dateTime: 'dateTime',
  type: 'type',
  asset: 'asset',
  amount: 'amount',
  totalPrice: 'totalPrice',
  unitPrice: 'unitPrice',
  counterparty: 'counterparty',
  status: 'status',
  originalData: 'originalData',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  passCode: 'passCode',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastNotification: 'lastNotification',
  role: 'role',
  bybitApiSecret: 'bybitApiSecret',
  bybitApiToken: 'bybitApiToken',
  lastBybitSyncAt: 'lastBybitSyncAt',
  lastBybitSyncStatus: 'lastBybitSyncStatus'
};

exports.Prisma.WorkSessionScalarFieldEnum = {
  id: 'id',
  startTime: 'startTime',
  endTime: 'endTime',
  duration: 'duration',
  autoCompleted: 'autoCompleted',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  comment: 'comment'
};

exports.Prisma.WorkSessionIdexCabinetScalarFieldEnum = {
  workSessionId: 'workSessionId',
  idexCabinetId: 'idexCabinetId',
  assignedAt: 'assignedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.AuditAction = exports.$Enums.AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

exports.SalarySection = exports.$Enums.SalarySection = {
  PAYMENTS: 'PAYMENTS',
  TRACTOR: 'TRACTOR'
};

exports.CardStatus = exports.$Enums.CardStatus = {
  ACTIVE: 'ACTIVE',
  WARNING: 'WARNING',
  BLOCKED: 'BLOCKED'
};

exports.ColumnType = exports.$Enums.ColumnType = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
  DATETIME: 'DATETIME',
  BOOLEAN: 'BOOLEAN',
  SELECT: 'SELECT',
  BUTTON: 'BUTTON',
  CALCULATED: 'CALCULATED',
  CURRENCY: 'CURRENCY',
  LINK: 'LINK',
  COMMENT: 'COMMENT'
};

exports.FilterOperator = exports.$Enums.FilterOperator = {
  EQUALS: 'EQUALS',
  NOT_EQUALS: 'NOT_EQUALS',
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  GREATER_OR_EQUAL: 'GREATER_OR_EQUAL',
  LESS_OR_EQUAL: 'LESS_OR_EQUAL',
  CONTAINS: 'CONTAINS',
  NOT_CONTAINS: 'NOT_CONTAINS',
  STARTS_WITH: 'STARTS_WITH',
  ENDS_WITH: 'ENDS_WITH',
  BETWEEN: 'BETWEEN',
  IN_LIST: 'IN_LIST'
};

exports.IdexSyncOrderStatus = exports.$Enums.IdexSyncOrderStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.PeriodType = exports.$Enums.PeriodType = {
  TWICE_MONTH: 'TWICE_MONTH',
  THRICE_MONTH: 'THRICE_MONTH',
  ONCE_MONTH: 'ONCE_MONTH'
};

exports.UserRole = exports.$Enums.UserRole = {
  USER: 'USER',
  USERCARDS: 'USERCARDS'
};

exports.Prisma.ModelName = {
  Admin: 'Admin',
  AuditLog: 'AuditLog',
  BalanceEntry: 'BalanceEntry',
  BybitMatch: 'BybitMatch',
  BybitOrderInfo: 'BybitOrderInfo',
  BybitTransaction: 'BybitTransaction',
  Card: 'Card',
  CardBalance: 'CardBalance',
  CardPouring: 'CardPouring',
  Cell: 'Cell',
  Column: 'Column',
  Comment: 'Comment',
  Filter: 'Filter',
  FinRow: 'FinRow',
  FinRowExpense: 'FinRowExpense',
  IdexCabinet: 'IdexCabinet',
  IdexSyncOrder: 'IdexSyncOrder',
  IdexTransaction: 'IdexTransaction',
  ImportExport: 'ImportExport',
  Match: 'Match',
  NotificationSettings: 'NotificationSettings',
  Password: 'Password',
  ReportNotification: 'ReportNotification',
  Row: 'Row',
  Salary: 'Salary',
  SalaryDebt: 'SalaryDebt',
  SalaryEarning: 'SalaryEarning',
  SalaryPayment: 'SalaryPayment',
  Section: 'Section',
  ShiftReport: 'ShiftReport',
  ShiftReportExpense: 'ShiftReportExpense',
  SystemSettings: 'SystemSettings',
  Table: 'Table',
  TelegramAccount: 'TelegramAccount',
  Transaction: 'Transaction',
  User: 'User',
  WorkSession: 'WorkSession',
  WorkSessionIdexCabinet: 'WorkSessionIdexCabinet'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
