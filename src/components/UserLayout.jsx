import { useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { IoCreateOutline, IoHomeOutline } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link, Outlet, useNavigate } from "react-router-dom"
import { userLogout } from "../api/userApi";

const UserLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login")
        return;
      }
    }
    fetchUser();
  }, []);
  const handleLogout = async () => {

    try {
      await userLogout()
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };
  return (<>
  <div className="relative flex min-h-screen">
    <div className="group flex min-h-screen">
  <div className=" bg-purple-500 p-4 flex flex-col justify-between text-white font-bold
                  w-14 group-hover:w-40 overflow-hidden transition-all duration-300">
    <nav className="flex flex-col gap-8 text-lg">
      <Link to="/home" className="text-xl whitespace-nowrap  group-hover:block">
        <span className="text-yellow-500">Blog</span>Hub
      </Link>
      <Link to="/home" className=" flex items-center justify-center gap-2 "> <IoHomeOutline size={20} /> <span className="hidden group-hover:inline" >Home</span></Link>
      <Link to="/create/blog" className=" flex items-center justify-center gap-2  "><IoCreateOutline size={20} /><span className="hidden group-hover:inline">Create</span></Link>
      <Link to="/profile" className=" flex items-center justify-center gap-2"><CgProfile size={20} /><span className="hidden group-hover:inline">Profile</span></Link>
    </nav>

    <button onClick={handleLogout} className="flex items-center justify-center gap-2 mt-4 cursor-pointer">
      <RiLogoutCircleRLine size={20} />
      <span className="hidden group-hover:inline">Logout</span>
    </button>

  </div>
  
       <Link to="/home" className="absolute text-xl top-4 z-10 pl-4 font-bold text-white whitespace-nowrap  group-hover:hidden">
        <span className="text-yellow-500">Blog</span>Hub
      </Link>
</div>


    <div className="flex-1 relative">
      <div className=" flex p-4 w-full h-14 top-0 bg-purple-500">
      
      </div>

      <div
  className="p-6 pt-16 overflow-auto h-[calc(100vh-56px)]">
  <Outlet />
    
      
    
</div>

    </div>
  </div>
</>

)
}
export default UserLayout