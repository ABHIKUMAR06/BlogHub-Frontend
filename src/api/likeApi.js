const API_URI = `${import.meta.env.VITE_API_URI}like`;
export const Like = async (blogId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URI}/create/${blogId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errData = await res.json().catch((err) => ({ message: err.message }));
        throw new Error(errData.message || "Failed to like blog");
    }

    return res.json();
};
export const getLikeByBlog = async (blogId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URI}/${blogId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch((err) => ({ message: err.message }));
    throw new Error(errData.message || "Failed to fetch likes");
  }

  return res.json();
};

export const Dislike = async (blogId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URI}/dislike/${blogId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errData = await res.json().catch((err) => ({ message: err.message }));
        throw new Error(errData.message || "Failed to like blog");
    }

    return res.json();
};
