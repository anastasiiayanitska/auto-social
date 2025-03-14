import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import UpdateProfile from "./components/Profile/UpdateProfile";
import AuthCheck from "./hooks/AuthCheck";
import GetMyProfile from "./components/Profile/GetMyProfile";
import Logout from "./components/Auth/Logout";
import GetProfileById from "./components/Profile/GetProfileById";
import GetAllUsers from "./components/Profile/GetAllUsers";
// Нові компоненти
import VerifyEmail from "./components/Auth/VerifyEmail";
import ForgotPassword from "./components/Password/ForgotPassword";
import ResetPassword from "./components/Password/ResetPassword";
import ChangePassword from "./components/Password/ChangePassword";
import VerifyPasswordChange from "./components/Auth/VerifyPasswordChange";

import PostsList from "./components/Posts/PostsList";
import PostDetail from "./components/Posts/PostDetail";
import PostCreation from "./components/Posts/PostCreation";
import { RegularPostCard } from "./components/Posts/RegularPostCard";
import { ProductPostCard } from "./components/Posts/ProductPostCard";
import { ServicePostCard } from "./components/Posts/ServicePostCard";
function App() {
  return (
    <Router>
      <AuthCheck />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/me" element={<GetMyProfile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile/:id" element={<GetProfileById />} />
        <Route path="/all-users" element={<GetAllUsers />} />

        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/verify-password-change"
          element={<VerifyPasswordChange />}
        />

        <Route path="/posts" element={<PostsList />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/posts/create" element={<PostCreation />} />
        <Route path="/posts/create/regular" element={<RegularPostCard />} />
        <Route path="/posts/create/product" element={<ProductPostCard />} />
        <Route path="/posts/create/service" element={<ServicePostCard />} />
      </Routes>
    </Router>
  );
}

export default App;
