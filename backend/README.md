# BlogSpace Backend — Modules 2, 3 and 4

REST API built with Node.js, Express and MongoDB Atlas through Mongoose.

## 1. Configure MongoDB Atlas

Follow [ATLAS-SETUP.md](./ATLAS-SETUP.md) to create a free Atlas cluster, database user and connection string.

## 2. Configure the backend

1. Install Node.js 18 or later.
2. Open a terminal in this folder: `cd backend`.
3. Install dependencies: `npm install`.
4. Copy `.env.example` to a new file named `.env`.
5. Set `MONGODB_URI` to your Atlas connection string.
6. Replace `JWT_SECRET` with a random secret of at least 32 characters.
7. Start the API: `npm run dev`.

The API starts on port 5000 after a successful database connection.

Health check: `GET http://localhost:5000/api/health`

## 3. Run the frontend

Open the repository's root folder in VS Code and use the Live Server extension on `index.html`. The default Live Server address should be `http://127.0.0.1:5500` or `http://localhost:5500`.

The frontend sends requests to `http://localhost:5000/api`. If you use another Live Server port, update the allowed origin in `backend/src/server.js` and restart the backend.

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

Registration body: `{ "name": "Moula", "email": "moula@example.com", "password": "at-least-8-characters" }`

Login body: `{ "email": "moula@example.com", "password": "at-least-8-characters" }`

Blog body: `{ "title": "My story", "excerpt": "A short summary of this story", "content": "The full story has at least twenty characters...", "category": "Technology", "readTime": "5 min read" }`

Protected routes require: `Authorization: Bearer YOUR_TOKEN`.

## Modules

- **Module 2 — Backend:** Express server, routes, middleware and JWT authentication.
- **Module 3 — Database:** Mongoose User and Blog models connected to MongoDB Atlas.
- **Module 4 — CRUD:** Create, Read, Update and Delete blog documents. Only the author can edit or delete their own post.
- **Frontend integration:** registration, login, public story listing, dashboard, create, edit and delete now use the backend API.

## Security notes

- Passwords are hashed with bcrypt before being saved.
- The password hash is excluded from normal user queries.
- Keep your real `.env` file private; it is ignored by Git.
- The frontend keeps the short-lived JWT in sessionStorage for this learning project. For production, prefer secure, HttpOnly cookies and add CSRF protection as appropriate.
- Never share your MongoDB connection string or JWT secret.

The code has been committed to GitHub but still needs to be installed, run and tested locally before it can be considered verified.
