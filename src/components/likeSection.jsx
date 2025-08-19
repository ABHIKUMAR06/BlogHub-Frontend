import { useState, useEffect } from "react";
import { getLikeByBlog, Like } from "../api/likeApi"; // your API function
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function LikeButton({ blogId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const data = await getLikeByBlog(blogId);
        
        setCount(data.count);
        const userId = localStorage.getItem("uid");
        if (data.likes.some((like) => like.user_id._id === userId)) {
          setLiked(true);
        }
      } catch (error) {
        console.error("Error fetching likes:", error.message);
      }
    };

    fetchLikes();
  }, []);

  const handleLike = async () => {
    try {
      const res = await Like(blogId); 
      if (res.message.includes("removed")) {
        setLiked(false);
        setCount((prev) => prev - 1);
      } else {
        setLiked(true);
        setCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition cursor-pointer"
    >
      {liked ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
      <span>{count}</span>
    </button>
  );
}
