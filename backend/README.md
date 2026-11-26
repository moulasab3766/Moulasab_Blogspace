# BlogSpace Backend — Modules 2, 3 and 4

REST API built with Node.js, Express and MongoDB (through Mongoose).

## Setup

1. Install Node.js 18 or later.
2. Create a MongoDB database using MongoDB Atlas or a local MongoDB server.
3. Open a terminal in this folder: `cd backend`.
4. Install dependencies: `npm install`.
5. Copy `.env.example` to `.env`.
6. Set `MONGODB_URI` to your MongoDB connection string.
7. Replace `JWT_SECRET` with a long random secret (at least 32 characters).
8. Start the API: `npm run dev`.

The server starts on port 5000 by default, after it connects to MongoDB.

Health check: `GET http://localhost:5000/api/health`

## API routes

| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Bearer token |
| GET | /api/blogs | Public |
| GET | /api/blogs/:id | Public |
| POST | /api/blogs | Bearer token |
| PUT | /api/blogs/:id | Owner only |
| DELETE | /api/blogs/:id | Owner only |

Register body: `{ "name": "Moula", "email": "moula@example.com", "password": "at-least-8-characters" }`

Login body: `{ "email": "moula@example.com", "password": "at-least-8-characters" }`

Blog body: `{ "title": "My story", "content": "At least twenty characters...", "category": "Technology" }`

For protected routes, send: `Authorization: Bearer YOUR_TOKEN`.

## Modules

- **Module 2 — Backend:** Express server, routes, middleware and JWT authentication.
- **Module 3 — Database:** Mongoose User and Blog models connected to MongoDB.
- **Module 4 — CRUD:** Create, Read, Update and Delete blog documents. Only the blog author can edit or delete their own post.

## Security notes

- Passwords are hashed with bcrypt before being saved.
- The password hash is excluded from normal user queries.
- Keep your real `.env` file private; it is ignored by Git.
- Never share your MongoDB connection string or JWT secret.

The code is prepared in the repository but still needs local installation, execution and API testing before it can be considered verified.
