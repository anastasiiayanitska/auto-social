import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../store/post/postsThunks.tsx";
import { PostType, CreatePostData } from "../../types/social.types";

const CreatePostComponent = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("regular");
  const [images, setImages] = useState<File[]>([]);
  const [productDetails, setProductDetails] = useState<string>("");
  const [serviceDetails, setServiceDetails] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    const postData: CreatePostData = {
      content,
      postType,
      images: images.length ? images : undefined,
      productDetails: productDetails ? JSON.parse(productDetails) : undefined,
      serviceDetails: serviceDetails ? JSON.parse(serviceDetails) : undefined,
    };
    console.log(postData);
    dispatch(createPost(postData));
  };

  return (
    <div className="p-4 border rounded-xl shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Створення поста</h2>
      <textarea
        placeholder="Введіть текст поста..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        placeholder="Додайте продукт (JSON формат)"
        value={productDetails}
        onChange={(e) => setProductDetails(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        placeholder="Додайте послугу (JSON формат)"
        value={serviceDetails}
        onChange={(e) => setServiceDetails(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <select
        value={postType}
        onChange={(e) => setPostType(e.target.value as PostType)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="regular">Звичайний</option>
        <option value="product">Продукт</option>
        <option value="service">Послуга</option>
      </select>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Створити пост
      </button>
    </div>
  );
};

export default CreatePostComponent;
