import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyProfile, updateUser } from "../api/userApi";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await MyProfile()
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
        setError("Failed to load user info.");
      }
    };
    fetchUser();
  }, []);


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
  
     await updateUser(name,email,password || undefined);

    setSuccess("Profile updated successfully!");
    setPassword("");
    navigate("/profile");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>

      {error && <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>}
      {success && <p className="text-green-600 bg-green-100 p-2 rounded">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>


        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
