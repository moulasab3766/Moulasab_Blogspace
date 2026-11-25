# BlogSpace

A responsive blog application built with HTML, CSS and vanilla JavaScript, with a Node.js + Express REST API being developed in Module 2.

## Frontend features
- Responsive home page with category filtering and search
- Login and registration pages with client-side validation
- Dashboard with post counts
- Create, edit and delete blog posts (frontend demo storage at present)

## Backend (Module 2)
The `backend/` folder contains the Express API, authentication routes, blog CRUD routes, JWT middleware and setup instructions. See [`backend/README.md`](backend/README.md).

## Run the frontend
Open `index.html` in a browser, or use VS Code Live Server.

## Important
The frontend's current localStorage authentication is demo-only. The backend currently uses temporary in-memory data for learning; records reset when the server restarts. Module 3 will add MongoDB. Do not use real credentials or deploy this learning version as production software.
