# User Service - Amazon Microservices

Independent microservice managing User Registration, Login, Profile, Role-Based Access Control (Admin/Customer), and JWT Authentication.

## Tech Stack
- Node.js, Express, TypeScript, Zod, JWT, bcryptjs

## Endpoints
- `GET /health`: Service health check
- `GET /api/docs`: Swagger OpenAPI documentation
- `POST /api/user/register`: User Registration
- `POST /api/user/login`: User Authentication
- `POST /api/user/logout`: Session Logout
- `GET /api/user/profile`: Get User Profile (JWT required)
- `PUT /api/user/profile/update`: Update Profile (JWT required)
- `DELETE /api/user/profile/delete`: Delete Profile (JWT required)
- `GET /api/user/users`: Get All Users (Admin required)
