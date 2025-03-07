import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserPosts,
  selectUserPosts,
  selectPostsLoading,
} from "../../store/postSlice";
import PostItem from "./PostItem";
import { IPost } from "../../types/post.types";

interface PostListProps {
  userId: string;
}

const PostList: React.FC<PostListProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const posts = useSelector(selectUserPosts);
  const loading = useSelector(selectPostsLoading);

  useEffect(() => {
    console.log(userId);
    dispatch(getUserPosts(userId) as any);
  }, [dispatch, userId]);

  // ✅ Мемоізація постів, щоб запобігти зайвим ререндерам
  const memoizedPosts = useMemo(() => posts, [posts]);

  if (loading && memoizedPosts.length === 0) {
    return <div className="text-center py-8">Завантаження...</div>;
  }

  if (memoizedPosts.length === 0) {
    return (
      <div className="text-center py-8">
        Користувач ще не створив жодного поста
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {memoizedPosts.map((post: IPost) => (
        <PostItem key={post._id.toString()} post={post} />
      ))}
    </div>
  );
};

export default PostList;
