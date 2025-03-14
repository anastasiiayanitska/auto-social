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

export const ServicePostCard: React.FC = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [service, setService] = useState<ServicePost["service"]>({
    title: "",
    price: undefined,
    priceType: "fixed",
    category: "",
    description: "",
    availability: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    experience: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleServiceChange = (
    field: keyof ServicePost["service"],
    value: any
  ) => {
    setService((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const postData: CreatePostData = {
      content,
      postType: PostType.SERVICE,
      images: images.length ? images : undefined,
      service,
    };
    dispatch(createPost(postData));
  };

  return (
    <div className="p-4 border rounded-xl shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Service Post</h2>
      <textarea
        placeholder="Describe your service"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Service Title"
          value={service.title}
          onChange={(e) => handleServiceChange("title", e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={service.category}
          onChange={(e) => handleServiceChange("category", e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Price (optional)"
          value={service.price}
          onChange={(e) =>
            handleServiceChange(
              "price",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="p-2 border rounded"
        />
        <select
          value={service.priceType}
          onChange={(e) => handleServiceChange("priceType", e.target.value)}
          className="p-2 border rounded"
        >
          <option value="fixed">Fixed</option>
          <option value="hourly">Hourly</option>
          <option value="negotiable">Negotiable</option>
        </select>
      </div>

      <textarea
        placeholder="Detailed description of your service"
        value={service.description}
        onChange={(e) => handleServiceChange("description", e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Availability"
          value={service.availability}
          onChange={(e) => handleServiceChange("availability", e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={service.location}
          onChange={(e) => handleServiceChange("location", e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="tel"
          placeholder="Contact Phone"
          value={service.contactPhone}
          onChange={(e) => handleServiceChange("contactPhone", e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={service.contactEmail}
          onChange={(e) => handleServiceChange("contactEmail", e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <input
        type="text"
        placeholder="Experience (e.g. '5 years in automotive repair')"
        value={service.experience}
        onChange={(e) => handleServiceChange("experience", e.target.value)}
        className="w-full p-2 border rounded mb-4"
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
        Create Service Post
      </button>
    </div>
  );
};
