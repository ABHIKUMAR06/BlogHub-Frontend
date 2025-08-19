const API_URI = `${import.meta.env.VITE_API_URI}comment`;
export const createComment = async (comment, blogId, parentId) => {
    const token = localStorage.getItem("token");

    if (parentId) {
        const res = await fetch(`${API_URI}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                comment: comment,
                blog_id: blogId,
                parent_comment_id: parentId
            }),
        });
        if (!res.ok) throw new Error("Failed to post comment");
        return await res.json()
    } else {
        const res = await fetch(`${API_URI}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                comment: comment,
                blog_id: blogId
            }),
        });
        if (!res.ok) throw new Error("Failed to post comment");
        return await res.json()
    }


}


export const getComment = async (blogId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URI}/read/${blogId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch comments");
    }
    return await res.json()
}

export const updateComment = async (cid, editText) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/api/comment/update/${cid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: editText }),
    });

    if (!res.ok) throw new Error("Failed to update comment");
    return await res.json()

}
export const deleteComment = async (cid) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URI}/delete/${cid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to delete comment");
    return await response.json()
}