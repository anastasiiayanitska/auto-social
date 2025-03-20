import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import PrivateLayout from "./PrivateLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/password/ForgotPassword";
import ResetPassword from "../pages/password/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import VerifyPasswordChange from "../pages/auth/VerifyPasswordChange";
import Logout from "../pages/auth/Logout";
import UpdateProfile from "../pages/profile/UpdateProfile";
import MyProfilePage from "../pages/profile/MyProfilePage";
import UserProfilePage from "../pages/profile/UserProfilePage";
import GetAllUsers from "../pages/GetAllUsers";
import ChangePassword from "../pages/password/ChangePassword";
import DeleteProfile from "../pages/profile/DeleteProfile";
import AllPostsPage from "../pages/posts/AllPostsPage";
import PostDetail from "../components/Posts/PostDetail";
import { RegularPostCard } from "../pages/posts/creating/RegularPostCard";
import { ProductPostCard } from "../pages/posts/creating/ProductPostCard";
import { ServicePostCard } from "../pages/posts/creating/ServicePostCard";
import FeedPage from "../pages/posts/FeedPage";
import SavedPostsPage from "../pages/posts/SavedPostsPage";
import FollowingPage from "../pages/follow/FollowingPage";
import FollowersPage from "../pages/follow/FollowersPage";
import ProductSearchPage from "../pages/posts/ProductFilterPage";
import EditPost from "../components/Posts/EditPost";
import ChatPage from "../pages/ChatPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Перевірка на авторизацію
  const requireAuth = (element: JSX.Element) =>
    isAuthenticated ? element : <Navigate to="/login" replace />;

  // Захист від доступу до публічних сторінок для авторизованих
  const requireUnauth = (element: JSX.Element) =>
    !isAuthenticated ? element : <Navigate to="/posts" replace />;

  return (
    <Routes>
      {/* Публічні маршрути */}
      <Route path="/login" element={requireUnauth(<Login />)} />
      <Route path="/register" element={requireUnauth(<Register />)} />
      <Route
        path="/forgot-password"
        element={requireUnauth(<ForgotPassword />)}
      />
      <Route
        path="/reset-password"
        element={requireUnauth(<ResetPassword />)}
      />

      {/* Доступні для всіх */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/verify-password-change"
        element={<VerifyPasswordChange />}
      />

      {/* Приватні маршрути (з Header) */}
      <Route element={requireAuth(<PrivateLayout />)}>
        <Route path="/logout" element={<Logout />} />
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/me" element={<MyProfilePage />} />
        <Route path="/profile/:id" element={<UserProfilePage />} />
        <Route path="/all-users" element={<GetAllUsers />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/delete" element={<DeleteProfile />} />

        {/* Пости */}
        <Route path="/posts" element={<AllPostsPage />} />
        <Route path="/posts/:postId" element={<PostDetail />} />

        <Route path="/posts/create/regular" element={<RegularPostCard />} />
        <Route path="/posts/create/product" element={<ProductPostCard />} />
        <Route path="/posts/create/service" element={<ServicePostCard />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/save-posts" element={<SavedPostsPage />} />
        <Route path="/search-product" element={<ProductSearchPage />} />

        <Route path="/profile/:userId/following" element={<FollowingPage />} />
        <Route path="/profile/:userId/followers" element={<FollowersPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />
        <Route path="/posts/edit/:postId" element={<EditPost />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Редіректи */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/posts" : "/login"} replace />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/posts" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
