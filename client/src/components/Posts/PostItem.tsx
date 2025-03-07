import React from "react";
import { useDispatch } from "react-redux";
import { likePost } from "../../store/postSlice";
import {
  IPost,
  PostType,
  IProductPost,
  IServicePost,
} from "../../types/post.types";
import ProductPostDetails from "./ProductPostDetails";
import ServicePostDetails from "./ServicePostDetails";

interface PostItemProps {
  post: IPost;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const dispatch = useDispatch();

  const handleLike = () => {
    dispatch(likePost(post._id.toString()) as any);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-3">
        {post.user && (
          <>
            <img
              src={post.user.avatar || "/default-avatar.jpg"}
              alt={post.user.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold">{post.user.username}</span>
          </>
        )}
        <span className="text-gray-500 text-sm ml-auto">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-4">
        <p>{post.content}</p>
      </div>

      {/* Відображення деталей на основі типу поста */}
      {post.postType === PostType.PRODUCT && (
        <ProductPostDetails product={(post as IProductPost).product} />
      )}

      {post.postType === PostType.SERVICE && (
        <ServicePostDetails service={(post as IServicePost).service} />
      )}

      {/* Відображення зображень */}
      {post.images && post.images.length > 0 && (
        <div className="flex flex-wrap gap-2 my-3">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Зображення ${index + 1}`}
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Лайки та коментарі */}
      <div className="flex items-center mt-4 pt-3 border-t">
        <button
          onClick={handleLike}
          className="flex items-center text-gray-700 hover:text-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>{post.likesCount || 0}</span>
        </button>
        <div className="flex items-center ml-4 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{post.commentsCount || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
