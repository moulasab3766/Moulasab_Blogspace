# BlogSpace — Module 3 and Module 4

## Module 3: Database Management
- MongoDB is the database.
- Mongoose defines and validates User and Blog documents.
- User passwords are stored as bcrypt hashes, never as plain text.
- Blog documents reference their author using a MongoDB ObjectId.
- Timestamps are added automatically.

## Module 4: Blog CRUD
| Operation | Method | Endpoint | Authentication |
|---|---|---|---|
| Create | POST | /api/blogs | Required |
| Read all | GET | /api/blogs | Public |
| Read one | GET | /api/blogs/:id | Public |
| Update | PUT | /api/blogs/:id | Required; owner only |
| Delete | DELETE | /api/blogs/:id | Required; owner only |

## Setup
1. Install Node.js 18 or later.
2. In this folder, run `npm install`.
3. Create `backend/.env` from `.env.example`.
4. Set `MONGODB_URI` to your MongoDB Atlas connection string (or local MongoDB URI).
5. Replace `JWT_SECRET` with a random secret of at least 32 characters.
6. Run `npm run dev`.

The API listens on port 5000 by default. Check `GET /api/health` to verify that the server is running and connected to the database.

## Important
Never commit your real `.env` file or share your MongoDB password. The API code is prepared, but it must still be run and tested locally before claiming that the full application works.
