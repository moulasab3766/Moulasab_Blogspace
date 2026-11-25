# BlogSpace Backend — Module 2

REST API built with Node.js and Express.

## Setup

1. Install Node.js 18 or later.
2. Open a terminal in this folder: `cd backend`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env`.
5. Set a long random `JWT_SECRET` (at least 32 characters).
6. Start the API: `npm run dev`

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

## Important learning-stage limitation

Module 2 currently uses temporary in-memory arrays. Users and blogs reset whenever the server restarts. Module 3 will replace this storage with MongoDB and Mongoose. Never use real credentials or deploy this demo as a production service.
