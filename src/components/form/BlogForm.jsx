import React, { useEffect, useRef, useState } from "react";

export default function BlogForm({
  initialTitle = "",
  initialDetail = "",
  initialImage = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [image, setImage] = useState(initialImage);
  const [imagePreview, setImagePreview] = useState(
    initialImage
      ? typeof initialImage === "string"
        ? initialImage
        : URL.createObjectURL(initialImage)
      : null
  );
  const [detailsEmpty, setDetailsEmpty] = useState(!initialDetail);
  const detailRef = useRef(null);

  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.innerHTML = initialDetail || "";
      setDetailsEmpty(!initialDetail);
    }
  }, [initialDetail]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const url = URL.createObjectURL(file);
    if (imagePreview && imagePreview !== initialImage) URL.revokeObjectURL(imagePreview);
    setImagePreview(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleImageChange({ target: { files: [file] } });
  };

  const handleDragOver = (e) => e.preventDefault();

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    detailRef.current.focus();
  };

  const onDetailsInput = () => {
    const text = detailRef.current?.textContent || "";
    setDetailsEmpty(text.trim().length === 0);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const detailHtml = detailRef.current?.innerHTML || "";
    if (!title.trim()) return alert("Title is required");
    if (!detailHtml.trim()) return alert("Details are required");
    if (!image) return alert("Image is required");

    await onSubmit({ title, detailHtml, image });

    // Reset form after submit
    setTitle("");
    setImage(null);
    if (imagePreview && imagePreview !== initialImage) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (detailRef.current) detailRef.current.innerHTML = "";
    setDetailsEmpty(true);
  };

  const handleReset = () => {
    setTitle(initialTitle);
    setImage(initialImage);
    setImagePreview(initialImage);
    if (detailRef.current) detailRef.current.innerHTML = initialDetail || "";
    setDetailsEmpty(!initialDetail);
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6">
      <label className="block mb-2 font-medium text-gray-800">
        Title <span className="ml-1 text-red-500">*</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-5 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
        placeholder="A short, catchy headline"
      />

      <label className="block mb-2 font-medium text-gray-800">Details <span className="ml-1 text-red-500">*</span></label>
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => execCommand("bold")} className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-semibold">B</button>
        <button type="button" onClick={() => execCommand("italic")} className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm italic">I</button>
        <button type="button" onClick={() => execCommand("underline")} className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm underline">U</button>
      </div>
      <div className="relative mb-6">
        <div
          ref={detailRef}
          contentEditable
          onInput={onDetailsInput}
          className="w-full min-h-[220px] max-h-[340px] overflow-auto px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none prose prose-sm max-w-none"
          spellCheck
          style={{ whiteSpace: "pre-wrap" }}
        />
        {detailsEmpty && <div className="pointer-events-none absolute inset-0 px-3 py-2 text-gray-400">Start writing your blog details here…</div>}
      </div>

      <label className="block mb-2 font-medium text-gray-800">Cover Image <span className="ml-1 text-red-500">*</span></label>
      <div onDrop={handleDrop} onDragOver={handleDragOver} className="rounded-2xl border-2 border-dashed border-gray-300 p-4 hover:border-purple-300 transition bg-gray-50 mb-6">
        {!imagePreview ? (
          <div className="text-center text-gray-500">
            <p className="text-sm">Drag & drop an image here, or</p>
            <label htmlFor="image" className="mt-2 inline-block cursor-pointer px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm">Choose File</label>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="hidden" />
            <p className="text-xs text-gray-400 mt-2">PNG, JPG, or JPEG</p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <img src={imagePreview} alt="Preview" className="h-28 w-28 object-cover rounded-xl border" />
            <div className="text-sm text-gray-600">
              <p className="font-medium truncate max-w-[14rem]">{image?.name || "Current Image"}</p>
              <div className="mt-2 flex items-center gap-2">
                <label htmlFor="image" className="inline-block cursor-pointer px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100">Replace</label>
                <button type="button" onClick={() => { setImage(null); if (imagePreview) URL.revokeObjectURL(imagePreview); setImagePreview(null); }} className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100">Remove</button>
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
        {onCancel && (
          <button type="button" onClick={handleReset} disabled={isSubmitting} className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-60">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}