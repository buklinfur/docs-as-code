# API

API предоставляет доступ к функциям ИИ-сервиса «Конспектор»: загрузка учебных материалов, вопросы по ним и получение ответов с источниками.

## Основные операции

- `POST /questions` — задать вопрос по материалам;
- `GET /answers/{id}` — получить ответ и его источники;
- `POST /documents` — загрузить учебный материал;
- `GET /documents/{id}` — получить статус индексации материала.

| Операция | Кто использует | Связь с требованиями |
|---|---|---|
| `POST /questions` | студент | US-01, UC-01 |
| `GET /answers/{id}` | студент | US-02 |
| `POST /documents` | преподаватель | US-03 |
| `GET /documents/{id}` | преподаватель | US-03 |

Подробнее о требованиях: [требования проекта](../project/requirements.md).

## Авторизация

Все операции требуют заголовок `Authorization: Bearer <token>`. Загрузка материалов и просмотр их статуса доступны только роли «преподаватель».

## Пример запроса

```bash
curl -X POST https://example.com/api/v1/questions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"text": "Что такое Docs as Code?"}'
```

Ответ `200`:

```json
{
  "id": 123,
  "questionId": 456,
  "status": "answered",
  "text": "Docs as Code — подход, при котором документация хранится в Git рядом с кодом.",
  "topSimilarity": 0.87,
  "sources": [
    {
      "chunkId": 3012,
      "documentId": 7,
      "documentTitle": "Лекция 1. Docs as Code.pdf",
      "page": 4,
      "fragment": "Docs as Code — это подход, при котором документацию создают теми же инструментами, что и код.",
      "similarity": 0.87
    }
  ],
  "modelVersion": "rag-1.0.0",
  "createdAt": "2026-10-24T12:30:00Z"
}
```

Если в материалах нет подходящей информации, возвращается тот же код `200`, но со статусом `no_answer` и пустым списком `sources`. Пример адреса условный, реальный сервер не развёрнут.

## Ошибки

Все ошибки возвращаются в одном формате:

```json
{
  "code": "INVALID_QUESTION",
  "message": "Question must not be empty"
}
```

| Код ответа | `code` | Когда возникает |
|---|---|---|
| `400` | `INVALID_QUESTION`, `INVALID_REQUEST` | пустой или слишком длинный вопрос, не передан файл |
| `401` | `UNAUTHORIZED` | нет токена или он недействителен |
| `403` | `FORBIDDEN` | нужна роль «преподаватель» |
| `404` | `NOT_FOUND` | ответ или материал не найден |
| `413` | `FILE_TOO_LARGE` | файл больше 20 МБ |
| `415` | `UNSUPPORTED_FORMAT` | допустимы только PDF, Markdown и TXT |
| `500` | `INTERNAL_ERROR` | внутренняя ошибка сервиса |
| `503` | `MODEL_UNAVAILABLE` | языковая модель недоступна или не ответила за 10 секунд |

## Спецификация

Полное описание API находится в файле [`openapi.yaml`](openapi.yaml). Чтобы посмотреть его в интерактивном виде, скопируйте содержимое файла в [Swagger Editor](https://editor.swagger.io/).
