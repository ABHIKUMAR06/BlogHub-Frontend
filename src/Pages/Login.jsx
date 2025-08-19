import { useState, useEffect } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";
import Banner from "../components/baner/baner";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("password");
useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/profile")
    return  
    }
    };
    fetchUser();
  }, []);
  const showPass = () => {
    setType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {

 await loginUser(formData.email,formData.password)

      
   

        setResponse("User Login successfully!");
        setStatus("success");
        setFormData({
          email: "",
          password: "",
        });
        setShowPopup(true);
        setTimeout(() => {
        navigate("/profile");
        }, 200);
    } catch (err) {
      console.error("Network error:", err);
      setResponse(err.message);
      setStatus("error");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <>
      {showPopup && (
        <Banner 
        type={status}
        message={response}
        />
      )}

      <div className="flex justify-center mb-2 px-4 sm:px-6 md:px-12">
        <div className="w-full max-w-md mt-10">
            <div className="flex justify-between">
          <h3 className="text-zinc-900 font-[400] mb-4 text-[20px]">
           Login
          </h3>
          <Link to="/" className="text-purple-600 font-[400] mb-4 text-[16px]">
           Create User
          </Link>
</div>
          <form
            onSubmit={handleSubmit}
            className="shadow-md rounded-lg p-4 pb-16 lg:pb-4 shadow-gray-400 bg-white"
          >
          
            <label htmlFor="email" className="font-[400] leading-[24px] text-[16px] mt-2">Email</label>
            <div className="relative w-full px-4 py-2 rounded-md border border-gray-300 mt-1 mb-1">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full text-base bg-transparent focus:outline-none"
              />
              <span className={`absolute left-4 transition-all text-zinc-400 px-1 bg-white
                ${formData.email ? 'top-[-10px] text-sm' : 'top-2 text-base'}
                peer-focus:top-[-10px] peer-focus:text-sm pointer-events-none`}
              >
                Email
              </span>
            </div>
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

            <label htmlFor="password" className="font-[400] leading-[24px] text-[16px]">Password</label>
            <div className="relative w-full px-4 py-2 rounded-md border border-gray-300 mt-1 mb-1">
              <input
                type={type}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="peer w-full text-base bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={type === "password" ? showPass : () => setType("password")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {type === "password" ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
              <span className={`absolute left-4 transition-all text-zinc-400 px-1 bg-white
                ${formData.password ? 'top-[-10px] text-sm' : 'top-2 text-base'}
                peer-focus:top-[-10px] peer-focus:text-sm pointer-events-none`}
              >
                Password
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

           
          </form>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <input
              type="submit"
              className="border-2 border-cyan-700 rounded-md px-6 py-2 hover:bg-cyan-700 hover:text-white"
              onClick={handleSubmit}
              value="Submit"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
