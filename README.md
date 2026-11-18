# Cinema API
Серверна частина застосунку для керування кінотеатром.

Проєкт розроблено на NestJS та TypeScript у межах домашнього завдання №1.

## Технології
- NestJS
- TypeScript
- class-validator
- class-transformer
- Swagger

## Функціональність
- Створення, перегляд, редагування та видалення фільмів.
- Створення, перегляд і видалення залів.
- Автоматичне формування місць у залі.
- Створення сеансів.
- Фільтрація сеансів за фільмом і датою.
- Перегляд вільних і зайнятих місць.
- Бронювання одного або кількох місць.
- Скасування бронювань.
- Перевірка вхідних даних.

## Встановлення
```bash
npm install
```

## Запуск у режимі розробки
```bash
npm run start:dev
```

Сервер працює за адресою:

http://localhost:3000

## Змінні середовища
Приклад файлу `.env`:

```env
PORT=3000
```

Зразок конфігурації знаходиться у файлі `.env.example`.

Для запуску на стандартному порту файл `.env` не обов'язковий.

## Документація API
Swagger доступний за адресою:

http://localhost:3000/docs

### Films
- POST /films
- GET /films
- GET /films/:id
- PATCH /films/:id
- DELETE /films/:id

### Halls
- POST /halls
- GET /halls
- GET /halls/:id
- DELETE /halls/:id

### Showings
- POST /showings
- GET /showings
- GET /showings/:id
- GET /showings/:id/seats

### Bookings
- GET /bookings
- POST /showings/:id/bookings
- GET /showings/:id/bookings
- DELETE /bookings/:id

## Перевірка API
У корені проєкту знаходиться файл `requests.http`.

Для виконання HTTP-запитів використовується розширення REST Client у VS Code.

Файл містить приклади успішних запитів і перевірок помилок.

## Зберігання даних
База даних не використовується.

Дані зберігаються в приватних масивах сервісів і зникають після перезапуску сервера.

Ідентифікатори створюються за допомогою `randomUUID()` із модуля `node:crypto`.