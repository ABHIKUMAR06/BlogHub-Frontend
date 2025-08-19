import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlogCard from "../components/blogcard";
import { fetchMyBlogs } from "../api/blogApi";
import { MyProfile } from "../api/userApi";
import Loader from "../components/loader/loader";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
  const token = localStorage.getItem("token");

     if (!token) {
      navigate("/login");
      return;
    }

  try {

    const [userData, blogData] = await Promise.all([
      MyProfile(),
      fetchMyBlogs()
    ]);

    setUser(userData);
    setBlogs(blogData);
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setError(err.message || "Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, []);

  const handleUpdate = (id, updatedFields) => {
    setBlogs(prev =>
      prev.map(blog =>
        blog._id === id ? { ...blog, ...updatedFields } : blog
      )
    );
  };

  const handleBlogDelete = (deletedId) => {
    setBlogs((prev) => prev.filter((blog) => blog._id !== deletedId));
  };

  if (loading) return <Loader />

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">User Profile</h2>
        <Link
          to="/update/profile"
          className="mt-2 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Update Profile
        </Link>
      </div>

      {error && (
        <p className="text-red-600 font-medium bg-red-100 px-4 py-2 rounded">
          {error}
        </p>
      )}

      {user && (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-2 border border-gray-200">
          <p>
            <strong className="text-gray-700">Name:</strong>{" "}
            <span className="text-gray-900">{user.name}</span>
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong>{" "}
            <span className="text-gray-900">{user.email}</span>
          </p>
          {blogs.length > 0 && (
            <p>
              <strong className="text-gray-700">Total Blogs:</strong>{" "}
              <span className="text-gray-900">{blogs.length}</span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Blogs</h1>

        {blogs.length === 0 ? (
          <p className="text-gray-500 text-lg">No blog posts available.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                createdAt={blog.createdAt}
                title={blog.title}
                detail={blog.detail}
                buid={blog.user_id?._id}
                uid={user?._id} 
                date={blog.updatedAt}
                bid={blog._id}
                onDelete={handleBlogDelete}
                onUpdate={handleUpdate}
                src={blog.img_url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
