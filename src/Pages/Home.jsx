import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/blogcard";
import { fecthAllBlog } from "../api/blogApi";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login first.");
        navigate("/login");
        return;
      }

      try {
        const data = await fecthAllBlog();
        
      setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [navigate]);
  const handleBlogDelete = (deletedId) => {
    setBlogs((prev) => prev.filter((blog) => blog._id !== deletedId));
  };
  if (loading) return <p className="text-center pt-16">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500 pt-16">{error}</p>;

  const uid = localStorage.getItem("uid");
const handleUpdate = (id, updatedFields) => {
    setBlogs(prev =>
      prev.map(blog =>
        blog._id === id ? { ...blog, ...updatedFields } : blog
      )
    );
  };
  return (
    <div className=" max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>

      {blogs.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        blogs.map((blog) => (
          <BlogCard
            {...blog}
            key={blog._id}
            name={blog.user_id?.name}
            createdAt={blog.createdAt}
            title={blog.title}
            src={blog.img_url}
            detail={blog.detail}
            buid={blog.user_id?._id}
            uid={uid}
            date={blog.updatedAt}
            bid={blog._id}
            onDelete={handleBlogDelete}
          onUpdate={handleUpdate}
            />
        ))
      )}
    </div>
  );
};

export default Home;
