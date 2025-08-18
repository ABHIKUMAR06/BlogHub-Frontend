import { useState, useEffect } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../api/userApi";

const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [status, setStatus] = useState("");
    const [type, setType] = useState("password");
    const [ctype, setCtype] = useState("password");

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/login");
        }
    }, [navigate]);
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
        if (!formData.name) newErrors.name = "Full Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
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
            await createUser(formData.name, formData.email, formData.password);

            setResponse("User registered successfully!");
            setStatus("success");
            setShowPopup(true);

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            navigate("/login");
        } catch (err) {
            console.error("Network error:", err);
            setResponse(err.message || "Registration failed");
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
                <div
                    className={`fixed bottom-34 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md z-50 border shadow-md w-[90%] sm:w-auto
          ${status === "success"
                            ? "bg-green-100 text-green-800 border-green-400"
                            : "bg-red-100 text-red-800 border-red-400"
                        }`}
                >
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        {status === "success" ? <CiCircleCheck /> : <MdOutlineCancel />}
                        <span>{response}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-center mb-2 px-4 sm:px-6 md:px-12">
                <div className="w-full max-w-md mt-10">
                    <div className="flex justify-between">
                        <h3 className="text-zinc-900 font-[400] mb-4 text-[20px]">
                            Creat Account
                        </h3>
                        <Link to="/login" className="text-purple-600 font-[400] mb-4 text-[16px]">
                            Login
                        </Link>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="shadow-md rounded-lg p-4 pb-16 lg:pb-4 shadow-gray-400 bg-white"
                    >
                        <label htmlFor="name" className="font-[400] text-[16px] leading-[24px]">Full Name</label>
                        <div className="relative w-full px-4 py-2 rounded-md border border-gray-300 mt-1 mb-1">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="peer w-full text-base bg-transparent focus:outline-none placeholder-transparent"
                            />
                            <span className={`absolute left-4 transition-all text-zinc-400 px-1 bg-white
                ${formData.name ? 'top-[-10px] text-sm' : 'top-2 text-base'}
                peer-focus:top-[-10px] peer-focus:text-sm pointer-events-none`}
                            >
                                Full Name
                            </span>
                        </div>
                        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

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

                        <label htmlFor="confirmPassword" className="font-[400] text-[16px]">Confirm Password</label>
                        <div className="relative w-full px-4 py-2 rounded-md border border-gray-300 mt-1 mb-1">
                            <input
                                type={ctype}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="peer w-full text-base bg-transparent focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={ctype === "password" ? () => setCtype("text") : () => setCtype("password")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {ctype === "password" ? <FaRegEye /> : <FaRegEyeSlash />}
                            </button>
                            <span className={`absolute left-4 transition-all text-zinc-400 px-1 bg-white
                ${formData.confirmPassword ? 'top-[-10px] text-sm' : 'top-2 text-base'}
                peer-focus:top-[-10px] peer-focus:text-sm pointer-events-none`}
                            >
                                Confirm Password
                            </span>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>}
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

export default Register;
