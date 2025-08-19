const API_URI = "http://localhost:8000/api/blog"

export const createBlog = async (formData) => {
const token = localStorage.getItem("token");

    const res = await fetch(`${API_URI}/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: "Server error" }));
        throw new Error(errData.message || "Failed to create blog");
    }
    return res.json();
}
export const fetchMyBlogs = async () => {
const token = localStorage.getItem("token");

    const res = await fetch(`${API_URI}/my/blogs`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: "Server error" }));
        throw new Error(errData.message || "Failed to create blog");

    }
    return await res.json()
}
export const BlogDelete = async (bid) => {
const token = localStorage.getItem("token");

    const res = await fetch(`${API_URI}/delete/${bid}`, {

        method: "DELETE",

        headers: { Authorization: `Bearer ${token}` },

    });
    if (!res.ok) throw new Error("Failed to delete blog");
    return await res.json()
}
export const EditBlog = async (bid, formData) => {
const token = localStorage.getItem("token");

    const res = await fetch(`${API_URI}/update/${bid}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to update blog");
    return await res.json()
}
export const fecthAllBlog = async () => {
const token = localStorage.getItem("token");

    const res = await fetch(`${API_URI}/read`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to load blog");

    
    return await res.json();
}