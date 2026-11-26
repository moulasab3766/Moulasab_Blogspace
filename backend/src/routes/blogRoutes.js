import { Router } from "express";
import { createBlog, deleteBlog, getBlog, listBlogs, listMyBlogs, updateBlog } from "../controllers/blogController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", listBlogs);
router.get("/mine", requireAuth, listMyBlogs);
router.get("/:id", getBlog);
router.post("/", requireAuth, createBlog);
router.put("/:id", requireAuth, updateBlog);
router.delete("/:id", requireAuth, deleteBlog);

export default router;
