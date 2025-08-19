const API_URI = `${import.meta.env.VITE_API_URI}user`;

export const createUser = async (name, email, password) => {
    const res = await fetch(`${API_URI}/reg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: "Server error" }));
      throw new Error(errData.message || "Failed to create user");
    
    }

     
    return await res.json();
};

export const loginUser = async ( email, password ) =>{

 const res = await fetch(`${API_URI}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      
    });
        if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: "Server error" }));
      throw new Error(errData.message);
    
    }
    const data = await res.json();  
     localStorage.setItem("token", data.token)
        localStorage.setItem("uid", data.user?._id)
     
    return  data
}

export const MyProfile = async() =>{
const token = localStorage.getItem("token");

        const res = await fetch(`${API_URI}/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401 || data.error === "Invalid token") {
          throw new Error(data.error || "Failed to fetch user");
        }
        }
return data
        
}
export const updateUser = async(name,email,password)=>{
const token = localStorage.getItem("token");

 const res = await fetch(`${API_URI}/update`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, email, password }),
    });   
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: "Server error" }));
      throw new Error(errData.message || "Failed to update user");
    }

     
    return await res.json();
}
export const userLogout = async () => {
const token = localStorage.getItem("token");

  if (!token) return;

    const res = await fetch(`${API_URI}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      
      const errData = await res.json().catch(() => ({ message: "Logout failed" }));
      throw new Error(errData.message || "Logout failed");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    return await res.json(); 

};
