import mongoose from "mongoose";
import Blog from "../models/Blog.js";

const categories = ["Technology", "Lifestyle", "Learning", "Design"];

function validateBlog(body) {
  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();
  const category = String(body.category || "").trim();

  if (title.length < 3 || title.length > 120) {
    return { error: "Title must be between 3 and 120 characters." };
  }
  if (content.length < 20) {
    return { error: "Content must contain at least 20 characters." };
  }
  if (!categories.includes(category)) {
    return { error: "Choose a valid category." };
  }
  return { value: { title, content, category } };
}

function validId(id) {
  return mongoose.isValidObjectId(id);
}

// READ: get all published blog records.
export async function listBlogs(_req, res) {
  const blogs = await Blog.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.json({ blogs });
}

// READ: get one blog by its MongoDB ID.
export async function getBlog(req, res) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: "Invalid blog ID." });
  }

  const blog = await Blog.findById(req.params.id).populate("author", "name");
  if (!blog) return res.status(404).json({ message: "Blog not found." });
  res.json({ blog });
}

// CREATE: save a blog document linked to the logged-in author.
export async function createBlog(req, res) {
  const result = validateBlog(req.body);
  if (result.error) return res.status(400).json({ message: result.error });

  const blog = await Blog.create({
    ...result.value,
    author: req.user.id
  });

  await blog.populate("author", "name");
  res.status(201).json({ message: "Blog created.", blog });
}

// UPDATE: only the author who owns the blog can update it.
export async function updateBlog(req, res) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: "Invalid blog ID." });
  }

  const result = validateBlog(req.body);
  if (result.error) return res.status(400).json({ message: result.error });

  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.id, author: req.user.id },
    result.value,
    { new: true, runValidators: true }
  ).populate("author", "name");

  if (!blog) {
    const exists = await Blog.exists({ _id: req.params.id });
    if (!exists) return res.status(404).json({ message: "Blog not found." });
    return res.status(403).json({ message: "You can only edit your own blogs." });
  }

  res.json({ message: "Blog updated.", blog });
}

// DELETE: only the author who owns the blog can delete it.
export async function deleteBlog(req, res) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: "Invalid blog ID." });
  }

  const blog = await Blog.findOneAndDelete({
    _id: req.params.id,
    author: req.user.id
  });

  if (!blog) {
    const exists = await Blog.exists({ _id: req.params.id });
    if (!exists) return res.status(404).json({ message: "Blog not found." });
    return res.status(403).json({ message: "You can only delete your own blogs." });
  }

  res.json({ message: "Blog deleted." });
}
