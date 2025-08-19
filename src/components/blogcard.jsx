import { useState, useRef, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { VscComment } from "react-icons/vsc";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import CommentSection from "./CommentSection";
import BlogForm from "./form/BlogForm";
import { BlogDelete, EditBlog } from "../api/blogApi";
import Loader from "./loader/loader";
import Banner from "./baner/baner";
import LikeButton from "./likeSection";

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
  const [showToast, setShowToast] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

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
      setShowLoader(true);
      setShowToast(false);
      await BlogDelete(bid);
      setStatus("success");
      setResponse("Blog Deleted Successfully");
      setShowPopup(true);
      setShowLoader(false);
      if (onDelete) onDelete(bid);
    } catch (err) {
      setStatus("error");
      setResponse(err.message);
      setShowLoader(false);
      setShowPopup(true);
    } finally {
      setShowLoader(false);

    }
  };


  const handleSaveEdit = async ({ title: updatedTitle, detailHtml, image }) => {
    try {
      setShowLoader(true);
      const formData = new FormData();
      formData.append("title", updatedTitle);
      formData.append("detail", detailHtml || "");
      if (image) formData.append("file", image);
      else formData.append("oldFile", src || "");
      const updatedBlog = await EditBlog(bid, formData);
      setStatus("success");
      setResponse("Blog Updated Successfully");
      setIsEditing(false);
      if (onUpdate) onUpdate(bid, updatedBlog);
    } catch (err) {
      setStatus("error");
      setResponse(err.message);
    } finally {
      setShowLoader(false);
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (!showPopup) return;
    const timer = setTimeout(() => setShowPopup(false), 3000);
    return () => clearTimeout(timer);
  }, [showPopup]);
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
            onClick={() => setShowToast(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
          >
            <MdDelete size={16} /> Delete
          </button>
        </div>
      )}

      {showLoader && <Loader />}

      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-transparent backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl p-6 w-80 max-w-sm shadow-lg flex flex-col items-center text-center">
            <p className="text-gray-800 text-lg font-medium mb-4">
              Do you want to delete this Blog?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleBlogDelete}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 cursor-pointer transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowToast(false)}
                className="px-4 py-2 border rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
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

      <div className="flex flex-wrap items-center justify-between text-gray-500 text-sm">
        <div className="flex items-center gap-1 hover:text-red-500 transition">
          <LikeButton blogId={bid} />
        </div>

        <button
          onClick={() => setShowComments((s) => !s)}
          aria-label="Toggle comments"
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
        >
          <VscComment size={18} />
          <span className="hidden sm:inline">Comments</span>
        </button>

        {/* Date */}
        <span className="text-xs text-gray-400 italic">
          {isUpdated
            ? `Updated • ${formatDate(date)}`
            : `Posted • ${formatDate(createdAt)}`}
        </span>
      </div>


      {showComments && <CommentSection blogId={bid} uid={uid} />}
      {showPopup && (
        <Banner
          type={status}
          message={response}
        />
      )}
    </div>
  );
};

export default BlogCard;
