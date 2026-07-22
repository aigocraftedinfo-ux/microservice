# Payment Service - Amazon Microservices

Independent microservice managing payment gateway simulations (UPI, Credit/Debit Card, Net Banking, Wallet), transaction ID generation (`TXN-xxxxxxxx`), and payment history logs.

## Endpoints
- `GET /health`: Service health status
- `GET /api/docs`: Swagger OpenAPI docs
- `POST /api/payment/process`: Process fake payment
- `GET /api/payment/history`: Get payment transaction history (JWT required)
- `GET /api/payment/transactions/:id`: Get transaction by ID (JWT required)
