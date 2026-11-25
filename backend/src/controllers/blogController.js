import { randomUUID } from "node:crypto";
import { blogs } from "../data/store.js";

const categories = ["Technology", "Lifestyle", "Learning", "Design"];

function validateBlog(body) {
  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();
  const category = String(body.category || "").trim();

  if (title.length < 3 || title.length > 120) return { error: "Title must be between 3 and 120 characters." };
  if (content.length < 20) return { error: "Content must contain at least 20 characters." };
  if (!categories.includes(category)) return { error: "Choose a valid category." };
  return { value: { title, content, category } };
}

export function listBlogs(req, res) {
  const items = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ blogs: items });
}

export function getBlog(req, res) {
  const blog = blogs.find(item => item.id === req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found." });
  res.json({ blog });
}

export function createBlog(req, res) {
  const result = validateBlog(req.body);
  if (result.error) return res.status(400).json({ message: result.error });

  const blog = {
    id: randomUUID(),
    ...result.value,
    authorId: req.user.id,
    authorEmail: req.user.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  blogs.push(blog);
  res.status(201).json({ message: "Blog created.", blog });
}

export function updateBlog(req, res) {
  const blog = blogs.find(item => item.id === req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found." });
  if (blog.authorId !== req.user.id) return res.status(403).json({ message: "You can only edit your own blogs." });

  const result = validateBlog(req.body);
  if (result.error) return res.status(400).json({ message: result.error });

  Object.assign(blog, result.value, { updatedAt: new Date().toISOString() });
  res.json({ message: "Blog updated.", blog });
}

export function deleteBlog(req, res) {
  const index = blogs.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Blog not found." });
  if (blogs[index].authorId !== req.user.id) return res.status(403).json({ message: "You can only delete your own blogs." });

  blogs.splice(index, 1);
  res.json({ message: "Blog deleted." });
}
