import React, { useState } from "react";
import BlogForm from "../components/form/BlogForm";
import { createBlog } from "../api/blogApi";

export default function Create() {
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({ title, detailHtml, image }) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("detail", detailHtml);
      formData.append("image", image);

      await createBlog(formData);

      setBanner({ type: "success", message: "Blog created successfully!" });
    } catch (error) {
      setBanner({ type: "error", message: error.message || "Failed to create blog." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Create Blog</h1>

        {banner.message && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm shadow-sm ${banner.type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}>
            {banner.message}
          </div>
        )}

        <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
