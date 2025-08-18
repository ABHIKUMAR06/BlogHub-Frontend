import { useEffect, useState, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { VscComment } from "react-icons/vsc";
import CommentSection from "./CommentSection";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";
import { BlogDelete, EditBlog } from "../api/blogApi";

const BlogCard = ({
  name,
  title,
  detail,
  src,
  createdAt,
  uid,
  buid,
  date,
  bid,
  onDelete,
  onUpdate,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const detailRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const isOwner = String(uid) === String(buid);
  const isUpdated = Boolean(date);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(src || null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const url = URL.createObjectURL(file);
    if (imagePreview && imagePreview !== src) URL.revokeObjectURL(imagePreview);
    setImagePreview(url);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const url = URL.createObjectURL(file);
      if (imagePreview && imagePreview !== src) URL.revokeObjectURL(imagePreview);
      setImagePreview(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!showOptions) return;
    const handleOutside = (e) => {
      const btn = btnRef.current;
      const menu = menuRef.current;
      if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showOptions]);

  const handleBlogDelete = async () => {
    try{    
    await BlogDelete(bid)
     setStatus("success");
      setResponse("Blog Deleted Successfully");
      setShowPopup(true);
      if (onDelete) onDelete(bid);
    } catch (err) {
      setResponse(err.message);
      setShowPopup(true);
      setStatus("");
    }
  };

  const handleSaveEdit = async () => {
    const updatedDetail = detailRef.current?.innerHTML ?? "";
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("detail", updatedDetail);
    if (image) {
      formData.append("file", image);
    } else {
      formData.append("oldFile", src || "");
    }
    try {
      setIsSubmitting(true);
      const updatedBlog = await EditBlog(bid,formData);
      setStatus("success");
      setResponse("Blog Updated Successfully");
      setShowPopup(true);
      setIsEditing(false);
      setImage(null);
      if (onUpdate) onUpdate(bid, updatedBlog);
    } catch (err) {
      setResponse(err.message);
      setShowPopup(true);
      setStatus("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const execCommand = (command) => {
    document.execCommand(command, false, null);
    detailRef.current?.focus();
  };

  useEffect(() => {
    if (!showPopup) return;
    const t = setTimeout(() => setShowPopup(false), 3000);
    return () => clearTimeout(t);
  }, [showPopup]);

  return (
    <div className="relative border border-gray-100 rounded-2xl p-6 mb-6 shadow-md hover:shadow-xl transition-all duration-300 bg-white max-w-3xl mx-auto overflow-visible">
      {isOwner && (
        <button
          ref={btnRef}
          onClick={() => setShowOptions((s) => !s)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition z-30"
        >
          <HiDotsVertical size={20} />
        </button>
      )}

      {showOptions && (
        <div
          ref={menuRef}
          className="absolute top-12 right-4 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-48 overflow-hidden"
        >
          <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
            Posted by: <span className="font-medium text-gray-800">{name}</span>
          </div>

          <button
            onClick={() => {
              setIsEditing(true);
              setShowOptions(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <FiEdit size={15} />
            Edit
          </button>

          <button
            onClick={handleBlogDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
          >
            <MdDelete size={16} />
            Delete
          </button>
        </div>
      )}

      <div className="mb-3 text-sm text-gray-500">
        <span className="font-semibold text-purple-600">{name}</span>
      </div>

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-400 outline-none"
        />
      ) : (
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-snug">{title}</h2>
      )}

      {isEditing ? (
        !imagePreview ? (
          <div
            className="text-center text-gray-500 border border-dashed border-gray-300 rounded-xl p-6 mb-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
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
          <div className="flex items-center gap-4 mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-28 w-28 object-cover rounded-xl border"
            />
            <div className="text-sm text-gray-600">
              <p className="font-medium truncate max-w-[14rem]">{image?.name || "Current Image"}</p>
              <div className="mt-2 flex items-center gap-2">
                <label
                  htmlFor="image"
                  className="inline-block cursor-pointer px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Replace
                </label>
                <button
                  type="button"
                  onClick={handleRemoveImage}
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
        )
      ) : (
        src && (
          <div className="overflow-hidden rounded-xl mb-4">
            <img
              src={src}
              alt={title}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 ease-out"
            />
          </div>
        )
      )}

      <div className="h-px bg-gray-200 mb-4" />

      {isEditing ? (
        <>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => execCommand("bold")}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-semibold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => execCommand("italic")}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => execCommand("underline")}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm underline"
            >
              U
            </button>
          </div>
          <div
            ref={detailRef}
            className="border border-gray-300 rounded-lg p-3 min-h-[120px] focus:outline-none"
            contentEditable
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: detail }}
          />
          <div className="flex gap-3 mt-4">
            <button
              disabled={isSubmitting}
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              {isSubmitting ? "Saving" : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditTitle(title);
                setImagePreview(src);
                setImage(null);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div
          className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: detail }}
        />
      )}

      <div className="h-px bg-gray-200 mt-4 mb-4" />

      <div className="flex flex-wrap items-center justify-between text-gray-500 hover:text-gray-700 gap-3">
        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center gap-2 hover:cursor-pointer focus:outline-none hover:text-purple-600 transition"
        >
          <VscComment size={20} />
          Comment
        </button>

        <span className="text-xs sm:text-sm">
          {isUpdated
            ? "Updated at " +
              new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Posted at " +
              new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
        </span>
      </div>

      {showComments && <CommentSection blogId={bid} uid={uid} />}

      {showPopup && (
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl z-50 border shadow-lg w-[90%] sm:w-auto transition-all ${
            status === "success"
              ? "bg-green-100 text-green-800 border-green-400"
              : "bg-red-100 text-red-800 border-red-400"
          }`}
        >
          <div className="flex items-center gap-2 text-sm sm:text-base">
            {status === "success" ? <CiCircleCheck /> : <MdOutlineCancel />}
            <span>{response}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
