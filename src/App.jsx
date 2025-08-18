import { Routes, Route } from "react-router-dom";
import Register from "./Pages/Registor";
import LoginPage from "./Pages/Login";
import UserProfile from "./Pages/Userprofile";
import UserLayout from "./components/UserLayout";
import Create from "./Pages/Create";
import Home from "./Pages/Home";
import UpdateProfile from "./Pages/udate-user";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<UserLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="create/blog" element={<Create />} />
        <Route path="update/profile" element={<UpdateProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
