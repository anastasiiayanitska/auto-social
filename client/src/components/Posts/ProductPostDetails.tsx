import React from "react";
import { IProductPost } from "../../types/post.types";

interface ProductPostDetailsProps {
  product: IProductPost["product"];
}

const ProductPostDetails: React.FC<ProductPostDetailsProps> = ({ product }) => {
  if (!product) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-lg mb-3">
      <h3 className="font-bold text-lg mb-2">{product.title}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-600">Ціна:</span>
          <span className="font-semibold">{product.price} грн</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600">Стан:</span>
          <span className="font-semibold">{product.condition}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600">Бренд/Модель:</span>
          <span className="font-semibold">
            {product.brand} {product.model}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600">Рік:</span>
          <span className="font-semibold">{product.year}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600">Колір:</span>
          <span className="font-semibold">{product.color}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600">Тип транспорту:</span>
          <span className="font-semibold">{product.vehicleType}</span>
        </div>
        {product.mileage && (
          <div className="flex flex-col">
            <span className="text-gray-600">Пробіг:</span>
            <span className="font-semibold">{product.mileage} км</span>
          </div>
        )}
        {product.engineType && (
          <div className="flex flex-col">
            <span className="text-gray-600">Тип двигуна:</span>
            <span className="font-semibold">{product.engineType}</span>
          </div>
        )}
        {product.transmission && (
          <div className="flex flex-col">
            <span className="text-gray-600">Коробка передач:</span>
            <span className="font-semibold">{product.transmission}</span>
          </div>
        )}
      </div>
      {product.features && product.features.length > 0 && (
        <div className="mt-2">
          <span className="text-gray-600">Особливості:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {product.features.map((feature, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
      {product.location && (
        <div className="mt-2">
          <span className="text-gray-600">Місцезнаходження:</span>
          <span className="ml-1">{product.location}</span>
        </div>
      )}
    </div>
  );
};

export default ProductPostDetails;
