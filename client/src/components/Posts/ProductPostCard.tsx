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

export const ProductPostCard: React.FC = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [product, setProduct] = useState<ProductPost["product"]>({
    title: "",
    price: 0,
    condition: Condition.USED,
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    vehicleType: VehicleType.SEDAN,
    mileage: 0,
    engineType: EngineType.GASOLINE,
    transmission: TransmissionType.MANUAL,
    features: [],
    location: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleProductChange = (
    field: keyof ProductPost["product"],
    value: any
  ) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(",").map((feature) => feature.trim());
    setProduct((prev) => ({ ...prev, features }));
  };

  const handleSubmit = () => {
    const postData: CreatePostData = {
      content,
      postType: PostType.PRODUCT,
      images: images.length ? images : undefined,
      product,
    };
    console.log(postData);
    dispatch(createPost(postData));
  };

  return (
    <div className="p-4 border rounded-xl shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Product Post</h2>
      <textarea
        placeholder="Describe your product"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={product.title}
          onChange={(e) => handleProductChange("title", e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => handleProductChange("price", Number(e.target.value))}
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select
          value={product.condition}
          onChange={(e) => handleProductChange("condition", e.target.value)}
          className="p-2 border rounded"
        >
          <option value={Condition.NEW}>New</option>
          <option value={Condition.USED}>Used</option>
          <option value={Condition.FOR_PARTS}>For Parts</option>
        </select>

        <select
          value={product.vehicleType}
          onChange={(e) => handleProductChange("vehicleType", e.target.value)}
          className="p-2 border rounded"
        >
          {Object.values(VehicleType).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Brand"
          value={product.brand}
          onChange={(e) => handleProductChange("brand", e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Model"
          value={product.model}
          onChange={(e) => handleProductChange("model", e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Year"
          value={product.year}
          onChange={(e) => handleProductChange("year", Number(e.target.value))}
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Color"
          value={product.color}
          onChange={(e) => handleProductChange("color", e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Mileage"
          value={product.mileage}
          onChange={(e) =>
            handleProductChange("mileage", Number(e.target.value))
          }
          className="p-2 border rounded"
        />
        <select
          value={product.engineType}
          onChange={(e) => handleProductChange("engineType", e.target.value)}
          className="p-2 border rounded"
        >
          {Object.values(EngineType).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select
          value={product.transmission}
          onChange={(e) => handleProductChange("transmission", e.target.value)}
          className="p-2 border rounded"
        >
          {Object.values(TransmissionType).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location"
          value={product.location}
          onChange={(e) => handleProductChange("location", e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="tel"
          placeholder="Contact Phone"
          value={product.contactPhone}
          onChange={(e) => handleProductChange("contactPhone", e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={product.contactEmail}
          onChange={(e) => handleProductChange("contactEmail", e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <input
        type="text"
        placeholder="Features (comma separated)"
        value={product.features?.join(", ")}
        onChange={handleFeaturesChange}
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
        Create Product Post
      </button>
    </div>
  );
};
