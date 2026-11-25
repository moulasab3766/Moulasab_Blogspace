import { Router } from "express";
import { createBlog, deleteBlog, getBlog, listBlogs, updateBlog } from "../controllers/blogController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", listBlogs);
router.get("/:id", getBlog);
router.post("/", requireAuth, createBlog);
router.put("/:id", requireAuth, updateBlog);
router.delete("/:id", requireAuth, deleteBlog);

export default router;
