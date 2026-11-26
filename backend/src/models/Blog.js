import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      minlength: 15,
      maxlength: 180
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 20
    },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Lifestyle", "Learning", "Design", "Career"]
    },
    readTime: {
      type: String,
      enum: ["3 min read", "5 min read", "7 min read", "10 min read"],
      default: "5 min read"
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
