# Project History

*   **YYYY-MM-DD HH:MM:SS** - Initial project setup.
*   **2025-04-10 14:46:00** - Created initial background service structure (`index.ts`) to process Bybit transactions, fetch order details (placeholder), extract phone numbers, and create `BybitOrderInfo` records. Added `bybit-api` dependency.
*   **2025-04-10 14:49:00** - Fixed incorrect import path for Prisma client in `index.ts` (changed from `../generated/prisma` to `./generated/prisma`).
*   **2025-04-10 14:51:00** - Implemented real P2P order chat history fetching in `fetchOrderChatHistory` function using the `/v5/p2p/order/message/listpage` endpoint documentation provided by the user. Added pagination logic and text message extraction.
*   **2025-04-10 15:38:00** - Исправление обработки чатов Bybit API и создания записей BybitOrderInfo
    - Исправлено парсинг ответа API Bybit (изменены поля с retCode на ret_code и retMsg на ret_msg)
    - Исправлен путь доступа к массиву сообщений в ответе API (response.data?.result?.result)
    - Добавлено обязательное поле updatedAt при создании записей BybitOrderInfo
    - Удалено несуществующее поле processedAt в методе update для BybitTransaction

*   **2025-04-10 15:50:00** - Улучшение обработки транзакций и добавление корректной пагинации чатов
    - Добавлено использование upsert вместо create для предотвращения ошибок с уже существующими записями BybitOrderInfo
    - Улучшена логика пагинации в функции fetchOrderChatHistory для корректной обработки всех страниц чата
    - Добавлено дополнительное логирование для отслеживания процесса получения сообщений со всех страниц

*   **2025-04-10 15:55:00** - Улучшение визуального представления логов и отображения источников телефонов
    - Добавлено отображение полной истории чата для каждой транзакции
    - Реализован поиск и отображение конкретных строк чата, где были найдены телефоны
    - Добавлено визуальное разделение вывода с помощью символов '====' и эмодзи
    - Улучшено форматирование текста для лучшей читаемости логов

*   **2025-04-10 16:20:00** - Изменение работы сервиса для обработки транзакций покупок (Buy)
    - Изменена схема данных: удалена связь между BybitOrderInfo и BybitTransaction
    - Обновлена логика обработки транзакций для фильтрации только покупок (side === 0) вместо продаж
    - Улучшена обработка и нормализация телефонных номеров в формат +7XXXXXXXXXX
    - Изменена логика сохранения BybitOrderInfo для работы без привязки к конкретной транзакции
    - Добавлена валидация телефонных номеров для исключения некорректных значений

*   **2025-04-10 16:30:00** - Полная переработка кода для прямого использования API Bybit
    - Удалена зависимость от таблицы BybitTransaction, добавлен прямой запрос к API
    - Реализована глобальная синхронизация времени с сервером Bybit для корректной аутентификации
    - Исправлен формат параметров для API запросов согласно документации Bybit
    - Оптимизирована логика аутентификации и создания подписи для запросов к API Bybit
    - Реализовано получение транзакций покупок напрямую из API и их обработка
