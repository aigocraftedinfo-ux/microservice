# API Gateway - Amazon Microservices

Central entrypoint for routing client traffic, health check aggregation, microservice status dashboard, and unified OpenAPI Swagger documentation.

## Endpoints
- `GET /health`: Overall system health check
- `GET /dashboard`: Service status monitoring (UP/DOWN, response time, ping checks)
- `GET /api/docs`: Aggregated Swagger UI
