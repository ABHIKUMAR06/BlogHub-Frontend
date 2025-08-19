import  { useEffect, useState } from "react";
import BlogForm from "../components/form/BlogForm";
import { createBlog } from "../api/blogApi";
import Loader from "../components/loader/loader";
import Banner from "../components/baner/baner";

export default function Create() {
 const [showPopup, setShowpopup] = useState(false)
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showloader, setShowloader] = useState(false)

  const handleSubmit = async ({ title, detailHtml, image }) => {
    try {
      setIsSubmitting(true);
      setShowloader(true)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("detail", detailHtml);
      formData.append("image", image);
      
      await createBlog(formData);
      setShowpopup(true)

      setBanner({ type: "success", message: "Blog created successfully!" });
    } catch (err) {
      setShowpopup(true)
      setBanner({ type: "error", message: err.message  });
    } finally {
      setIsSubmitting(false);
      setShowloader(false)
    }
  };

  useEffect(() => {
    if (!showPopup) return;
    const timer = setTimeout(() => setShowpopup(false), 3000);
    return () => clearTimeout(timer);
  }, [showPopup]);

  return (<div className="relative">
    {showloader &&(
        <Loader/>
      )}
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Create Blog</h1>

        {showPopup && (
           <Banner 
            type={banner.type}
            message={banner.message}
           />
           
        )}

        <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
        </div>
  );
}
