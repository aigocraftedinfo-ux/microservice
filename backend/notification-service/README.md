# Notification Service - Amazon Microservices

Independent microservice managing event notification logs (Order Created, Payment Success, Order Cancelled, Email Sent).

## Endpoints
- `GET /health`: Health status
- `GET /api/docs`: Swagger OpenAPI docs
- `POST /api/notification/send`: Record notification log
- `GET /api/notification/logs`: Get all notification logs
