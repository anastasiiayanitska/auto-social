import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  selectPostsLoading,
  selectPostsError,
} from "../../store/postSlice";
import {
  PostType,
  VehicleType,
  EngineType,
  TransmissionType,
  Condition,
} from "../../types/vehicle.types";

const CreatePostForm: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  const [postType, setPostType] = useState<PostType>(PostType.REGULAR);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // Стан для продуктового поста
  const [product, setProduct] = useState({
    title: "",
    price: 0,
    condition: Condition.USED,
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    vehicleType: VehicleType.SEDAN,
    mileage: undefined as number | undefined,
    engineType: undefined as EngineType | undefined,
    transmission: undefined as TransmissionType | undefined,
    features: [] as string[],
    location: "",
    contactPhone: "",
    contactEmail: "",
  });

  // Стан для сервісного поста
  const [service, setService] = useState({
    title: "",
    price: undefined as number | undefined,
    priceType: "fixed" as "fixed" | "hourly" | "negotiable",
    category: "",
    description: "",
    availability: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    experience: "",
  });

  // Хендлер для обробки зміни типу поста
  const handlePostTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPostType(e.target.value as PostType);
  };

  // Хендлер для обробки зміни полів продукту
  const handleProductChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // Хендлер для обробки зміни полів сервісу
  const handleServiceChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setService({
      ...service,
      [name]: value,
    });
  };

  // Хендлер для обробки завантаження зображень (мокап)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Імітація завантаження - в реальному додатку тут буде завантаження на сервер
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
        // Це мокап URL, в реальному додатку тут буде URL від сервера
        newImages.push(URL.createObjectURL(files[i]));
      }
      setImages(newImages);
    }
  };

  // Хендлер для відправки форми
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let postData = {
      content,
      images,
      postType,
    };

    if (postType === PostType.PRODUCT) {
      postData = {
        ...postData,
        product,
      };
    } else if (postType === PostType.SERVICE) {
      postData = {
        ...postData,
        service,
      };
    }

    dispatch(createPost(postData as any) as any);

    // Очищаємо форму після успішного створення
    setContent("");
    setImages([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Створити новий пост</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Тип поста</label>
          <select
            value={postType}
            onChange={handlePostTypeChange}
            className="w-full p-2 border rounded"
          >
            <option value={PostType.REGULAR}>Звичайний пост</option>
            <option value={PostType.PRODUCT}>Продам авто</option>
            <option value={PostType.SERVICE}>Послуги</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Контент</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Завантажити зображення
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            multiple
            className="w-full p-2 border rounded"
          />

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Попередній перегляд ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Поля для продуктового поста */}
        {postType === PostType.PRODUCT && (
          <div className="bg-gray-50 p-3 rounded mb-4">
            <h3 className="font-semibold mb-3">Деталі продукту</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Назва</label>
                <input
                  type="text"
                  name="title"
                  value={product.title}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Ціна (грн)</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Стан</label>
                <select
                  name="condition"
                  value={product.condition}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                >
                  <option value={Condition.NEW}>Новий</option>
                  <option value={Condition.USED}>Вживаний</option>
                  <option value={Condition.FOR_PARTS}>На запчастини</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Бренд</label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Модель</label>
                <input
                  type="text"
                  name="model"
                  value={product.model}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Рік</label>
                <input
                  type="number"
                  name="year"
                  value={product.year}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Колір</label>
                <input
                  type="text"
                  name="color"
                  value={product.color}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Тип транспорту
                </label>
                <select
                  name="vehicleType"
                  value={product.vehicleType}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                >
                  {Object.values(VehicleType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Пробіг (км)</label>
                <input
                  type="number"
                  name="mileage"
                  value={product.mileage || ""}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Тип двигуна</label>
                <select
                  name="engineType"
                  value={product.engineType || ""}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Виберіть тип двигуна --</option>
                  {Object.values(EngineType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Коробка передач
                </label>
                <select
                  name="transmission"
                  value={product.transmission || ""}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Виберіть тип КПП --</option>
                  {Object.values(TransmissionType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Місцезнаходження
                </label>
                <input
                  type="text"
                  name="location"
                  value={product.location}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Поля для сервісного поста */}
        {postType === PostType.SERVICE && (
          <div className="bg-gray-50 p-3 rounded mb-4">
            <h3 className="font-semibold mb-3">Деталі послуги</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Назва послуги
                </label>
                <input
                  type="text"
                  name="title"
                  value={service.title}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Ціна (грн)</label>
                <input
                  type="number"
                  name="price"
                  value={service.price || ""}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Тип ціни</label>
                <select
                  name="priceType"
                  value={service.priceType}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="fixed">Фіксована</option>
                  <option value="hourly">Погодинна</option>
                  <option value="negotiable">Договірна</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Категорія</label>
                <input
                  type="text"
                  name="category"
                  value={service.category}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Опис послуги</label>
                <textarea
                  name="description"
                  value={service.description}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Доступність</label>
                <input
                  type="text"
                  name="availability"
                  value={service.availability}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                  placeholder="Напр.: Пн-Пт, 9:00-18:00"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Досвід</label>
                <input
                  type="text"
                  name="experience"
                  value={service.experience}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                  placeholder="Напр.: 5 років досвіду"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Місцезнаходження
                </label>
                <input
                  type="text"
                  name="location"
                  value={service.location}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Контактний телефон
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={service.contactPhone}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Контактний email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={service.contactEmail}
                  onChange={handleServiceChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Публікація..." : "Опублікувати"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;
