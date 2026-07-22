# Product Service - Amazon Microservices

Independent microservice managing Product Catalog, Search, Filtering, Categories, Product Details, and Inventory Management.

## Endpoints
- `GET /health`: Health status check
- `GET /api/docs`: Swagger OpenAPI docs
- `GET /api/product/products`: Search and filter products
- `GET /api/product/products/:id`: Get product details
- `GET /api/product/categories`: Get product categories
- `POST /api/product/products`: Add product (Admin required)
- `PUT /api/product/products/:id`: Edit product (Admin required)
- `DELETE /api/product/products/:id`: Delete product (Admin required)
- `PUT /api/product/inventory/:id`: Deduct/Update inventory stock
