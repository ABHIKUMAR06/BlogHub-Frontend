const API_URI = "http://localhost:8000/api/user";
const token = localStorage.getItem("token");

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

     
    return await res.json();   
}

export const MyProfile = async() =>{
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
    return await res.json(); 

};
