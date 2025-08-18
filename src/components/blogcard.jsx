import { useState, useRef, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { VscComment } from "react-icons/vsc";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";
import CommentSection from "./CommentSection";
import BlogForm from "./form/BlogForm";
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
  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const isOwner = String(uid) === String(buid);
  const isUpdated = Boolean(date);

  useEffect(() => {
    if (!showOptions) return;
    const handleOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showOptions]);

  const handleBlogDelete = async () => {
    try {
      await BlogDelete(bid);
      setStatus("success");
      setResponse("Blog Deleted Successfully");
      setShowPopup(true);
      if (onDelete) onDelete(bid);
    } catch (err) {
      setStatus("");
      setResponse(err.message);
      setShowPopup(true);
    }
  };

  const handleSaveEdit = async ({ title: updatedTitle, detailHtml, image }) => {
    const formData = new FormData();
    formData.append("title", updatedTitle);
    formData.append("detail", detailHtml || "");
    if (image) formData.append("file", image);
    else formData.append("oldFile", src || "");
try{
    const updatedBlog = await EditBlog(bid, formData);
    setStatus("Success")
    setIsEditing(false);
    if (onUpdate) onUpdate(bid, updatedBlog);
    }catch(err){setResponse(err.message)}
    setStatus(" ")
  };

  useEffect(() => {
    if (!showPopup) return;
    const timer = setTimeout(() => setShowPopup(false), 3000);
    return () => clearTimeout(timer);
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
            <FiEdit size={15} /> Edit
          </button>
          <button
            onClick={handleBlogDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
          >
            <MdDelete size={16} /> Delete
          </button>
        </div>
      )}

      <div className="mb-3 text-sm text-gray-500">
        <span className="font-semibold text-purple-600">{name}</span>
      </div>

      {isEditing ? (
                <BlogForm
          initialTitle={title}
          initialDetail={detail}
          initialImage={src}
          onSubmit={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
        />

      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-snug">{title}</h2>
          {src && (
            <div className="overflow-hidden rounded-xl mb-4">
              <img
                src={src}
                alt={title}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 ease-out"
              />
            </div>
          )}
          <div
            className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: detail }}
          />
        </>
      )}

      <div className="h-px bg-gray-200 my-4" />

      <div className="flex flex-wrap items-center justify-between text-gray-500 hover:text-gray-700 gap-3">
        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center gap-2 hover:cursor-pointer focus:outline-none hover:text-purple-600 transition"
        >
          <VscComment size={20} /> Comment
        </button>
        <span className="text-xs sm:text-sm">
          {isUpdated
            ? "Updated at " + new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            : "Posted at " + new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
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
