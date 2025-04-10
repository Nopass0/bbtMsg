import { PrismaClient, type User } from './generated/prisma';
import axios from 'axios';
import crypto from 'crypto';
// import * as dotenv from 'dotenv';
// dotenv.config(); // Example if using dotenv

const prisma = new PrismaClient();

// --- Configuration ---
const POLL_INTERVAL_MS = 60 * 1000; // How often to check for new transactions
const BATCH_SIZE = 10; // How many transactions to process in one go
const DELAY_BETWEEN_REQUESTS_MS = 1000; // Delay between Bybit API requests
const BYBIT_API_BASE_URL = 'https://api.bybit.com'; // Mainnet URL
const RECV_WINDOW = 5000; // Standard receive window
const DB_QUERY_RETRIES = 3; // Number of retries for the main DB query
const DB_RETRY_DELAY_MS = 2000; // Delay between DB query retries

// --- Phone Number Extraction ---
const PHONE_REGEX = /(?:(?:\+?7|8)[- ]?)?(?:\(?\d{3}\)?[- ]?)?\d{3}[- ]?\d{2}[- ]?\d{2}/g;

// Функция удалена, так как теперь мы используем прямое создание подписи


// --- Real Bybit Chat History Fetching (Uses Per-User Keys) ---
/**
 * Fetches the chat message history for a given Bybit P2P order using user-specific API keys.
 *
 * @param orderNo The Bybit order number (passed as orderId to the API)
 * @param apiKey The user's Bybit API Key (bybitApiToken)
 * @param apiSecret The user's Bybit API Secret (bybitApiSecret)
 * @returns Promise resolving to the concatenated text chat history
 */
async function fetchOrderChatHistory(orderNo: string, apiKey: string, apiSecret: string): Promise<string> {
    console.log(`-> Fetching real chat history for order: ${orderNo}`);
    let allTextMessages = "";
    let currentPage = 1;
    const pageSize = 50;
    let hasMorePages = true;
    const endpoint = '/v5/p2p/order/message/listpage';
    const url = `${BYBIT_API_BASE_URL}${endpoint}`;

    if (!apiKey || !apiSecret) {
        throw new Error(`API Key or Secret is missing for order ${orderNo} fetch.`);
    }
    
    // Ensure time is synchronized
    if (!timeSyncComplete) {
        await syncTimeWithBybit();
    }

    while (hasMorePages) {
        try {
            console.log(`--> Fetching page ${currentPage} for order ${orderNo}...`);

            // Get adjusted timestamp
            const timestamp = getBybitTimestamp();
            const params = {
                orderId: orderNo,
                size: pageSize.toString(),
                currentPage: currentPage.toString(),
            };
            
            // Create parameters string
            const paramsString = JSON.stringify(params);
            
            // Create signature string
            const signString = `${timestamp}${apiKey}${RECV_WINDOW}${paramsString}`;
            
            // Generate signature
            const signature = crypto
                .createHmac('sha256', apiSecret)
                .update(signString)
                .digest('hex');

            // Set headers
            const headers = {
                'Content-Type': 'application/json',
                'X-BAPI-API-KEY': apiKey,
                'X-BAPI-TIMESTAMP': timestamp.toString(),
                'X-BAPI-RECV-WINDOW': RECV_WINDOW.toString(),
                'X-BAPI-SIGN': signature,
            };

            // Make API request
            const response = await axios.post(url, params, { headers });

            // Check if response is successful
            if (response.data?.ret_code !== 0) {
                 console.error(`Bybit API Error Response for order ${orderNo}, page ${currentPage}:`, JSON.stringify(response.data, null, 2));
                 throw new Error(`Bybit API error: ${response.data?.ret_code} - ${response.data?.ret_msg || 'Unknown error'}`);
            }

            // Access the nested result
            const messages = response.data?.result?.result as Array<any> || [];
            const totalPages = parseInt(response.data?.result?.totalPages || '1');
            
            console.log(`    Got ${messages.length} messages from page ${currentPage}/${totalPages}`);
            
            // Extract text messages
            if (messages.length > 0) {
                 messages.forEach(msg => {
                    if (msg.contentType === 'str' && (msg.msgType === 1 || msg.msgType === 5)) {
                        // Add message text to our accumulated string
                        allTextMessages += `${msg.message}\n`;
                    }
                });
            }
            
            // Check if there are more pages to fetch
            if (currentPage < totalPages) {
                currentPage++;
            } else {
                hasMorePages = false;
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                 console.error(`Axios error fetching chat history page ${currentPage} for order ${orderNo}:`, error.response?.data || error.message);
            } else {
                console.error(`Error fetching chat history page ${currentPage} for order ${orderNo}:`, error.message || error);
            }
            hasMorePages = false;
            throw error;
        }
    }

    return allTextMessages;
}

// --- Extract phone numbers from a string using regex, normalize to +7 format, and deduplicate
function extractPhoneNumbers(text: string): string[] {
    const matches = text.match(PHONE_REGEX) || [];
    
    // Remove duplicates and normalize phone numbers to +7 format
    return [...new Set(matches)].map(phone => {
        // Format to +7XXXXXXXXXX standard format
        let normalized = phone.replace(/[^0-9+]/g, '');
        if (normalized.startsWith('8') && normalized.length === 11) {
            normalized = '+7' + normalized.substring(1);
        } else if (!normalized.startsWith('+') && normalized.length === 10) {
            normalized = '+7' + normalized;
        }
        return normalized;
    }).filter(phone => {
        // Only keep valid phone numbers
        return phone.match(/^\+7\d{10}$/) !== null;
    });
}

// Global variable to track time synchronization
let globalTimeOffset = 0;
let timeSyncComplete = false;

/**
 * Synchronize time with Bybit server
 * This should be called before making authenticated requests
 */
async function syncTimeWithBybit(): Promise<void> {
    try {
        // Call Bybit's time endpoint (this endpoint doesn't require authentication)
        const response = await axios.get(`${BYBIT_API_BASE_URL}/v5/market/time`);
        
        if (response.data && response.data.result && response.data.result.timeNano) {
            const serverTime = Math.floor(Number(response.data.result.timeNano) / 1000000);
            const localTime = Date.now();
            globalTimeOffset = serverTime - localTime;
            
            console.log(`Синхронизация времени с сервером Bybit. Смещение: ${globalTimeOffset}ms`);
            timeSyncComplete = true;
            return;
        }
        throw new Error('Неполный ответ от сервера Bybit при синхронизации времени');
    } catch (error: any) {
        console.error('Ошибка при синхронизации времени с сервером Bybit:', error.message);
        globalTimeOffset = 0; // Reset offset on error
        throw error;
    }
}

/**
 * Get current timestamp adjusted for server time
 */
function getBybitTimestamp(): number {
    return Date.now() + globalTimeOffset;
}

/**
 * Fetches user's recent Buy transactions directly from Bybit API
 */
async function fetchUserBuyTransactions(user: User): Promise<BybitTransaction[]> {
    if (!user.bybitApiToken || !user.bybitApiSecret) {
        throw new Error(`User ${user.id} missing API keys`);
    }
    
    console.log(`Получение транзакций покупок для пользователя ${user.id}...`);
    
    try {
        // Ensure time is synchronized first
        if (!timeSyncComplete) {
            await syncTimeWithBybit();
        }
        
        // Create timestamp for API request
        const timestamp = getBybitTimestamp();
        const endpoint = '/v5/p2p/order/simplifyList';
        
        // Parameters for Bybit API request
        // Important: API expects nullable values for optional parameters
        const params = {
            page: 1,
            size: 20,
            status: null,       // Make these null instead of arrays for optional params
            beginTime: null,
            endTime: null,
            tokenId: null,
            side: [0]           // 0 = Buy transactions
        };
        
        // Convert params to JSON string
        const paramsString = JSON.stringify(params);
        
        // Generate signature string (timestamp + apiKey + recvWindow + body)
        const signString = `${timestamp}${user.bybitApiToken}${RECV_WINDOW}${paramsString}`;
        
        // Generate signature using HMAC-SHA256
        const signature = crypto
            .createHmac('sha256', user.bybitApiSecret)
            .update(signString)
            .digest('hex');
        
        // Set up request headers
        const headers = {
            'X-BAPI-API-KEY': user.bybitApiToken,
            'X-BAPI-SIGN': signature,
            'X-BAPI-TIMESTAMP': timestamp.toString(),
            'X-BAPI-RECV-WINDOW': RECV_WINDOW.toString(),
            'Content-Type': 'application/json'
        };
        
        console.log('Request params:', paramsString);
        console.log('Request URL:', `${BYBIT_API_BASE_URL}${endpoint}`);
        
        // Make API request
        const response = await axios.post(
            `${BYBIT_API_BASE_URL}${endpoint}`,
            params, // Send params as object, not string
            { headers }
        );
        
        // Check if API request was successful
        if (response.data?.ret_code !== 0) {
            console.error(`Bybit API Error for user ${user.id}:`, JSON.stringify(response.data, null, 2));
            throw new Error(`Bybit API error: ${response.data?.ret_code} - ${response.data?.ret_msg || 'Unknown error'}`);
        }
        
        // Process and return transactions
        const transactions = response.data?.result?.items || [];
        
        // Ensure these are Buy transactions (side=0) and Completed (status=50)
        const buyTransactions = transactions.filter((tx: any) => 
            tx.side === 0 && tx.status === 50
        );
        
        console.log(`Найдено ${buyTransactions.length} транзакций покупок из ${transactions.length} всего для пользователя ${user.id}`);
        
        return buyTransactions;
        
    } catch (error: any) {
        console.error(`Ошибка при получении транзакций для пользователя ${user.id}:`, error.message);
        throw error;
    }
}

// --- Transaction Processing (Accepts User Keys) ---
/**
 * Processes a single Buy transaction: fetches chat history using user's keys,
 * extracts phone numbers, and stores them in BybitOrderInfo.
 * 
 * @param transaction The BybitTransaction (Buy type) object from Prisma (must include user)
 * @param apiKey The user's Bybit API Key
 * @param apiSecret The user's Bybit API Secret
 */
async function processTransaction(transaction: BybitTransaction & { user: User }, apiKey: string, apiSecret: string): Promise<void> {
    console.log(`Обработка транзакции ПОКУПКИ ID: ${transaction.id}, orderNo: ${transaction.orderNo}, пользователь: ${transaction.user.id}`);
    
    try {
        // Step 1: Extract chat history from Bybit
        const chatHistory = await fetchOrderChatHistory(transaction.orderNo, apiKey, apiSecret);
        console.log(`Получена история чата для orderNo: ${transaction.orderNo}, длина: ${chatHistory.length} символов`);
        
        // Step 2: Extract phone numbers
        const phoneNumbers = extractPhoneNumbers(chatHistory);
        
        console.log(`Извлечено номеров телефонов: ${phoneNumbers.length} для orderNo: ${transaction.orderNo}`);
        
        if (phoneNumbers.length > 0) {
            console.log(`Найдены номера: ${phoneNumbers.join(', ')}`);
            
            // Save to BybitOrderInfo
            // Check if record exists for this orderNo
            const existingInfo = await prisma.bybitOrderInfo.findFirst({
                where: { 
                    orderNo: transaction.orderNo,
                },
            });
            
            if (existingInfo) {
                // Update existing record
                await prisma.bybitOrderInfo.update({
                    where: { id: existingInfo.id },
                    data: {
                        phoneNumbers: phoneNumbers,
                        updatedAt: new Date()
                    },
                });
                console.log(`Обновлена запись BybitOrderInfo ID: ${existingInfo.id} для заказа ${transaction.orderNo}`);
            } else {
                // Create new record
                const orderInfo = await prisma.bybitOrderInfo.create({
                    data: {
                        orderNo: transaction.orderNo,
                        phoneNumbers: phoneNumbers,
                        updatedAt: new Date()
                    },
                });
                console.log(`Создана запись BybitOrderInfo ID: ${orderInfo.id} для заказа ${transaction.orderNo}`);
            }
        } else {
            console.log(`Номера телефонов не найдены в чате для заказа ${transaction.orderNo}`);
        }

        // Mark transaction as processed
        await prisma.bybitTransaction.update({
            where: { id: transaction.id },
            data: {
                processed: true,
            },
        });

        console.log(`Транзакция покупки ${transaction.id} успешно обработана.`);
        
    } catch (error: any) {
        console.error(`Ошибка при обработке транзакции ${transaction.id}:`, error.message);
        
        // Mark transaction with error but don't set as processed
        await prisma.bybitTransaction.update({
            where: { id: transaction.id },
            data: {
                processed: false, // Keep as false to allow retry
                lastAttemptError: error.message?.substring(0, 255) || 'Unknown error'
            },
        });
    }
}

/**
 * Process a single transaction directly from Bybit API response
 */
async function processDirectTransaction(transaction: BybitTransaction, user: User): Promise<void> {
    console.log(`Обработка транзакции ПОКУПКИ orderId: ${transaction.id}, пользователь: ${user.id}`);
    
    try {
        // Extract chat history from Bybit
        const chatHistory = await fetchOrderChatHistory(transaction.id, user.bybitApiToken!, user.bybitApiSecret!);
        console.log(`Получена история чата для orderNo: ${transaction.id}, длина: ${chatHistory.length} символов`);
        
        // Extract phone numbers
        const phoneNumbers = extractPhoneNumbers(chatHistory);
        console.log(`Извлечено номеров телефонов: ${phoneNumbers.length} для orderNo: ${transaction.id}`);
        
        if (phoneNumbers.length > 0) {
            console.log(`Найдены номера: ${phoneNumbers.join(', ')}`);
            
            // Save to BybitOrderInfo
            const existingInfo = await prisma.bybitOrderInfo.findFirst({
                where: { 
                    orderNo: transaction.id,
                    userId: user.id
                },
            });
            
            if (existingInfo) {
                // Update existing record
                await prisma.bybitOrderInfo.update({
                    where: { id: existingInfo.id },
                    data: {
                        phoneNumbers: phoneNumbers,
                        updatedAt: new Date()
                    },
                });
                console.log(`Обновлена запись BybitOrderInfo ID: ${existingInfo.id} для заказа ${transaction.id}`);
            } else {
                // Create new record
                const orderInfo = await prisma.bybitOrderInfo.create({
                    data: {
                        orderNo: transaction.id,
                        userId: user.id,
                        phoneNumbers: phoneNumbers,
                        updatedAt: new Date(),
                        createdAt: new Date()
                    },
                });
                console.log(`Создана запись BybitOrderInfo ID: ${orderInfo.id} для заказа ${transaction.id}`);
            }
        } else {
            console.log(`Номера телефонов не найдены в чате для заказа ${transaction.id}`);
        }

        console.log(`Транзакция покупки ${transaction.id} успешно обработана.`);
        
    } catch (error: any) {
        console.error(`Ошибка при обработке транзакции ${transaction.id}:`, error.message);
    }
}

// Interface for Bybit API transaction
interface BybitTransaction {
    id: string;        // В API Bybit это поле содержит ID заказа
    side: number;      // 0 = Buy, 1 = Sell
    status: number;    // 50 = Completed
    targetNickName?: string;
    tokenId: string;
    amount: string;
    price: string;
    createDate: string;
    [key: string]: any;
}

// --- Main Processing Loop ---
async function mainProcessingLoop() {
    console.log('Запуск цикла прямой обработки покупок Bybit...');
    
    try {
        // Выполняем синхронизацию времени при запуске
        await syncTimeWithBybit();
        console.log('Успешная синхронизация времени с Bybit API');
    } catch (error) {
        console.error('Ошибка синхронизации времени. Продолжаем без синхронизации:', error);
    }

    while (true) { // Infinite loop, will be interrupted by SIGINT/SIGTERM
        let users: User[] = [];
        let dbQuerySuccess = false;
        
        // Retry loop for database query to get users with API keys
        for (let attempt = 1; attempt <= DB_QUERY_RETRIES; attempt++) {
            try {
                // Query active users with API keys
                users = await prisma.user.findMany({
                    where: {
                        isActive: true,
                        bybitApiToken: { not: null, not: '' },
                        bybitApiSecret: { not: null, not: '' }
                    }
                });
                dbQuerySuccess = true; // Mark as successful if query completes
                console.log(`Найдено ${users.length} активных пользователей с API ключами Bybit`);
                break; // Exit retry loop on success
            } catch (dbError: any) {
                console.error(`Попытка ${attempt} запроса пользователей не удалась:`, dbError.message || dbError);
                if (attempt < DB_QUERY_RETRIES) {
                    console.log(`Ожидание ${DB_RETRY_DELAY_MS}ms перед повторной попыткой...`);
                    await new Promise(resolve => setTimeout(resolve, DB_RETRY_DELAY_MS));
                } else {
                    console.error(`Запрос пользователей не удался после ${DB_QUERY_RETRIES} попыток. Пропускаем цикл.`);
                }
            }
        }

        // Only proceed if the database query was successful
        if (dbQuerySuccess && users.length > 0) {
            // Process each user
            for (const user of users) {
                try {
                    console.log(`Обработка пользователя ID: ${user.id}`);
                    
                    // Get user's Bybit transactions directly from the API
                    const buyTransactions = await fetchUserBuyTransactions(user);
                    
                    if (buyTransactions.length > 0) {
                        console.log(`Найдено ${buyTransactions.length} транзакций покупок для пользователя ${user.id}`);
                        
                        // Process each transaction
                        for (const transaction of buyTransactions) {
                            try {
                                // Process each transaction
                                await processDirectTransaction(transaction, user);
                                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS_MS));
                            } catch (txError: any) {
                                console.error(`Ошибка обработки транзакции ${transaction.orderId} для пользователя ${user.id}:`, txError.message);
                            }
                        }
                    } else {
                        console.log(`Транзакции покупок не найдены для пользователя ${user.id}`);
                    }
                    
                    // Wait between users to avoid API rate limits
                    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS_MS * 3));
                    
                } catch (userError: any) {
                    console.error(`Ошибка обработки пользователя ${user.id}:`, userError.message);
                }
            }
        } else {
            console.log('Нет активных пользователей с API ключами Bybit');
        }

        // Wait before the next poll cycle
        console.log(`Ожидание ${POLL_INTERVAL_MS / 1000} секунд перед следующей проверкой...`);
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
    }
}

// --- Graceful Shutdown ---
async function shutdown() {
    console.log('Disconnecting Prisma...');
    await prisma.$disconnect();
    console.log('Prisma disconnected. Exiting.');
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// --- Start the process ---
mainProcessingLoop().catch(async (e) => {
    console.error('Unhandled error in main processing loop:', e);
    await prisma.$disconnect();
    process.exit(1);
});