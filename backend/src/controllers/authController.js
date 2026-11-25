import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../data/store.js";

function createToken(user) {
  return jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

export async function register(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2) return res.status(400).json({ message: "Name must contain at least 2 characters." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    if (users.some(user => user.email === email)) return res.status(409).json({ message: "An account with this email already exists." });

    const user = {
      id: randomUUID(),
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12)
    };
    users.push(user);

    return res.status(201).json({
      message: "Account created successfully.",
      token: createToken(user),
      user: publicUser(user)
    });
  } catch {
    return res.status(500).json({ message: "Could not create account." });
  }
}

export async function login(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = users.find(item => item.email === email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      token: createToken(user),
      user: publicUser(user)
    });
  } catch {
    return res.status(500).json({ message: "Could not log in." });
  }
}

export function getCurrentUser(req, res) {
  const user = users.find(item => item.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ user: publicUser(user) });
}
