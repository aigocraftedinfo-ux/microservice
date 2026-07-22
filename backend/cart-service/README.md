# Cart Service - Amazon Microservices

Independent microservice managing shopping carts, line items, item quantities, and subtotal calculations. Communicates via REST API with Product Service.

## Endpoints
- `GET /health`: Health status
- `GET /api/docs`: Swagger OpenAPI docs
- `GET /api/cart`: Get user cart (JWT required)
- `POST /api/cart/add`: Add product to cart (JWT required)
- `PUT /api/cart/increase`: Increase item quantity (JWT required)
- `PUT /api/cart/decrease`: Decrease item quantity (JWT required)
- `DELETE /api/cart/items/:productId`: Remove item from cart (JWT required)
- `POST /api/cart/clear`: Clear all items from cart (JWT required)
