# Order Service - Amazon Microservices

Independent microservice managing checkout orchestration, order creation, order tracking, order cancellation, and status updates. Communicates via REST APIs with Cart Service, Payment Service, Product Service, and Notification Service.

## Endpoints
- `GET /health`: Health check status
- `GET /api/docs`: Swagger OpenAPI documentation
- `POST /api/order/checkout`: Process checkout and create order (JWT required)
- `GET /api/order/my-orders`: Get user orders history (JWT required)
- `GET /api/order/all-orders`: Get all orders across platform (Admin required)
- `GET /api/order/:id`: Get order details / track order (JWT required)
- `POST /api/order/:id/cancel`: Cancel order (JWT required)
- `PUT /api/order/:id/status`: Update shipping status (Admin required)
