import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchUser } from "../store/authSlice";
import { selectPostsError } from "../store/postSlice";
import CreatePostForm from "../components/Posts/CreatePostForm";
import PostList from "../components/Posts/PostList";

const PostsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const error = useSelector(selectPostsError);
  const currentUser = useSelector(fetchUser);
  // Отримуємо інформацію про поточного користувача (мокап)
  const currentUserId = currentUser._id; // Це потрібно замінити на реальне отримання ID поточного користувача

  const isCurrentUserProfile = userId === currentUserId;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {isCurrentUserProfile ? "Мої пости" : "Пости користувача"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isCurrentUserProfile && <CreatePostForm />}

      <PostList userId={userId || currentUserId} />
    </div>
  );
};

export default PostsPage;
