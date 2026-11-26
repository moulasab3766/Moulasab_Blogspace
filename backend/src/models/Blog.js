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
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 20
    },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Lifestyle", "Learning", "Design"]
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
