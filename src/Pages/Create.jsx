import React, { useEffect, useRef, useState } from "react";
import { createBlog } from "../api/blogApi";
export default function Create() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [detailsEmpty, setDetailsEmpty] = useState(true);
  const detailsRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const url = URL.createObjectURL(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const url = URL.createObjectURL(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    detailsRef.current.focus();
  };

  const onDetailsInput = () => {
    const text = detailsRef.current?.textContent || "";
    setDetailsEmpty(text.trim().length === 0);
  };

  const resetForm = () => {
    setTitle("");
    setImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (detailsRef.current) detailsRef.current.innerHTML = "";
    setDetailsEmpty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const detailsHtml = detailsRef.current?.innerHTML || "";

    if (!title.trim()) {
      setBanner({ type: "error", message: "Title is required." });
      return;
    }
    if (!image) {
      setBanner({ type: "error", message: "Image is required." });
      return;
    }
    if (!detailsHtml.replace(/<[^>]*>/g, "").trim()) {
      setBanner({ type: "error", message: "Details cannot be empty." });
      return;
    }

    try {
      setIsSubmitting(true);
      setBanner({ type: "", message: "" });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("detail", detailsHtml);
      formData.append("image", image);

  await createBlog(formData)


      setBanner({ type: "success", message: "Blog created successfully!" });
      resetForm();
    } catch (error) {
      setBanner({ type: "error", message: error.message || "Failed to submit blog post." });
    } finally {
      setIsSubmitting(false);
    resetForm()
    }
    
  };

  useEffect(() => {
    if (!banner.message) return;
    const t = setTimeout(() => setBanner({ type: "", message: "" }), 3000);
    return () => clearTimeout(t);
  }, [banner]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Blog</h1>
          <p className="text-gray-500 mt-1">Write a title, add rich details, and upload a cover image.</p>
        </div>

        {banner.message && (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm shadow-sm ${
              banner.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {banner.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6"
        >
          <label htmlFor="title" className="block mb-2 font-medium text-gray-800">
            Title <span className="ml-1 text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-5 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
            placeholder="A short, catchy headline"
            required
          />

          <div className="flex items-center justify-between mb-2">
            <label htmlFor="details" className="font-medium text-gray-800">
              Details <span className="ml-1 text-red-500">*</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <button type="button" onClick={() => execCommand("bold")} className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-semibold">
              B
            </button>
            <button type="button" onClick={() => execCommand("italic")} className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm italic">
              I
            </button>
            <button type="button" onClick={() => execCommand("underline")} className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm underline">
              U
            </button>
          </div>

          <div className="relative">
            <div
              id="details"
              ref={detailsRef}
              contentEditable
              onInput={onDetailsInput}
              className="w-full min-h-[220px] max-h-[340px] overflow-auto px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none prose prose-sm max-w-none"
              spellCheck={true}
              style={{ whiteSpace: "pre-wrap" }}
            ></div>
            {detailsEmpty && (
              <div className="pointer-events-none absolute inset-0 px-3 py-2 text-gray-400">
                Start writing your blog details here…
              </div>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="image" className="block mb-2 font-medium text-gray-800">
              Cover Image <span className="ml-1 text-red-500">*</span>
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="rounded-2xl border-2 border-dashed border-gray-300 p-4 hover:border-purple-300 transition bg-gray-50"
            >
              {!imagePreview ? (
                <div className="text-center text-gray-500">
                  <p className="text-sm">Drag & drop an image here, or</p>
                  <label
                    htmlFor="image"
                    className="mt-2 inline-block cursor-pointer px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, or JPEG</p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-28 w-28 object-cover rounded-xl border"
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium truncate max-w-[14rem]">{image?.name}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label
                        htmlFor="image"
                        className="inline-block cursor-pointer px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
                      >
                        Replace
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          if (imagePreview) URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
                      >
                        Remove
                      </button>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
