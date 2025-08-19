import { useEffect, useState, useCallback } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { createComment, deleteComment, getComment, updateComment } from "../api/commentApi";

const CommentSection = ({ blogId, uid }) => {
  const [commentTree, setCommentTree] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  const getId = (val) => {
    if (val == null) return null;
    if (typeof val === "string") return val;
    if (typeof val === "object" && val._id) return String(val._id);
    return String(val);
  };

  const getUserName = (user) => {
    if (!user) return "Unknown";
    if (typeof user === "string") return user;
    return user.name || user.email || "Unknown";
  };

  const getUserId = (user) => {
    if (!user) return null;
    if (typeof user === "string") return user;
    return getId(user);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

const fetchComments = useCallback(async () => {
  setLoading(true);
  try {
    

    const data = await getComment(blogId);
    setCommentTree(data);
    
   
    
    const withReplies = new Set();
    data.forEach(c => {
      if (c.replies.length > 0) {
        withReplies.add(c._id.toString());
      }
    });
    setExpandedReplies(withReplies);
     
  } catch (error) {
    console.error("Error fetching comments:", error);
    showToast("Failed to load comments", "error");
  } finally {
    setLoading(false);
  }
}, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await createComment(newComment,blogId)
      setNewComment("");
      showToast("Comment posted successfully!");
      await fetchComments();
    } catch (error) {
      showToast("Failed to post comment", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {      
      await createComment(replyText,blogId,parentId)
      setReplyText("");
      setReplyingTo(null);
      showToast("Reply posted successfully!");
      
      setExpandedReplies(prev => new Set(prev).add(parentId));
      
      await fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
      showToast("Failed to post reply", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    setLoading(true);
    try {
      await  deleteComment(commentId)
      showToast("Comment deleted successfully!");
      setShowOptionsFor(null);
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Failed to delete comment", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (comment) => {
    setEditingId(getId(comment._id));
    setEditText(comment.comment);
    setShowOptionsFor(null);
  };
  const handleEditSubmit = async (id) => {
    if (!editText.trim()) return;
    setLoading(true);
    try {
      await updateComment(id,editText)
      showToast("Comment updated successfully!");
      setEditingId(null);
      setEditText("");
      await fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
      showToast("Failed to update comment", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleOptions = (id) => {
    setShowOptionsFor(prev => prev === id ? null : id);
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowOptionsFor(null);
    };

    if (showOptionsFor) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showOptionsFor]);

  const renderComment = (comment, depth = 0) => {
    const commentId = getId(comment._id);
    const ownerId = getUserId(comment.user_id);
    const ownerName = getUserName(comment.user_id);
    const isOwner = ownerId === uid;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies.has(commentId);

    return (
      <div key={commentId} className={`relative border rounded p-4 ${depth > 0 ? 'ml-6 mt-3 bg-gray-50' : 'mt-4 bg-white'}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{ownerName}</span>
            {comment.createdAt && (
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            )}
            {depth > 0 && (
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                Reply
              </span>
            )}
          </div>
          {isOwner && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOptions(commentId);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <HiDotsVertical size={16} />
              </button>
              
              {showOptionsFor === commentId && (
                <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(comment);
                    }}
                    className="flex items-center gap-2 text-sm hover:bg-gray-100 p-2 w-full text-left"
                  >
                    <FiEdit size={14} /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommentDelete(commentId);
                    }}
                    className="flex items-center gap-2 text-sm hover:bg-gray-100 hover:text-red-600 p-2 w-full text-left"
                  >
                    <MdDelete size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {editingId === commentId ? (
          <div className="mb-3">
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              disabled={loading}
            />
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                onClick={() => handleEditSubmit(commentId)}
                disabled={loading || !editText.trim()}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                onClick={() => {
                  setEditingId(null);
                  setEditText("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm mb-3 whitespace-pre-wrap">{comment.comment}</p>
        )}

        {editingId !== commentId && (
          <div className="flex items-center gap-4 text-xs">
            <button
              className="text-purple-600 hover:text-purple-700 font-medium"
              onClick={() => setReplyingTo(commentId)}
              disabled={loading}
            >
              Reply
            </button>
            {hasReplies && (
              <button
                className="text-gray-600 hover:text-gray-700 font-medium"
                onClick={() => toggleReplies(commentId)}
              >
                {isExpanded ? `Hide` : `Show`} {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        )}

        {replyingTo === commentId && (
          <div className="mt-3 p-3 bg-purple-50 rounded">
            <p className="text-sm text-gray-600 mb-2">Replying to {ownerName}</p>
            <textarea
              className="w-full border rounded p-2 mb-2 text-sm"
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${ownerName}...`}
              disabled={loading}
            />
            <div className="flex gap-2">
              <button
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                onClick={() => handleReplySubmit(commentId)}
                disabled={loading || !replyText.trim()}
              >
                {loading ? "Posting..." : "Post Reply"}
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {hasReplies && isExpanded && (
          <div className="mt-4 border-l-2 border-purple-200 pl-4">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Comments ({commentTree.length})
        </h3>

        <div className="bg-white rounded-lg border p-4">
          <textarea
            className="w-full border rounded p-3 mb-3"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={loading}
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={handleCommentSubmit}
            disabled={loading || !newComment.trim()}
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {commentTree.length > 0 ? (
          commentTree.map(comment => renderComment(comment))
        ) : !loading ? (
          <div className="text-center py-12 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : null}
      </div>

      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? <CiCircleCheck size={20} /> : <MdOutlineCancel size={20} />}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: "", type: "success" })}
              className="ml-2 hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;