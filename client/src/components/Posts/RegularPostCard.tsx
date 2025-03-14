import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../store/post/postsThunks.tsx";
import {
  PostType,
  CreatePostData,
  ProductPost,
  ServicePost,
} from "../../types/social.types";
import {
  VehicleType,
  EngineType,
  TransmissionType,
  Condition,
} from "../../types/vehicle.types";

// Regular Post Card Component
export const RegularPostCard: React.FC = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    const postData: CreatePostData = {
      content,
      postType: PostType.REGULAR,
      images: images.length ? images : undefined,
    };
    dispatch(createPost(postData));
  };

  return (
    <div className="p-4 border rounded-xl shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Regular Post</h2>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Post
      </button>
    </div>
  );
};
