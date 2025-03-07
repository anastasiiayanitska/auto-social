import React from "react";
import { IServicePost } from "../../types/post.types";

interface ServicePostDetailsProps {
  service: IServicePost["service"];
}

const ServicePostDetails: React.FC<ServicePostDetailsProps> = ({ service }) => {
  if (!service) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-lg mb-3">
      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
      <div className="mb-2">
        <p>{service.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {service.price && (
          <div className="flex flex-col">
            <span className="text-gray-600">Ціна:</span>
            <span className="font-semibold">
              {service.price} грн
              {service.priceType &&
                ` (${
                  service.priceType === "fixed"
                    ? "фіксована"
                    : service.priceType === "hourly"
                    ? "погодинна"
                    : "договірна"
                })`}
            </span>
          </div>
        )}
        {service.category && (
          <div className="flex flex-col">
            <span className="text-gray-600">Категорія:</span>
            <span className="font-semibold">{service.category}</span>
          </div>
        )}
        {service.availability && (
          <div className="flex flex-col">
            <span className="text-gray-600">Доступність:</span>
            <span className="font-semibold">{service.availability}</span>
          </div>
        )}
        {service.experience && (
          <div className="flex flex-col">
            <span className="text-gray-600">Досвід:</span>
            <span className="font-semibold">{service.experience}</span>
          </div>
        )}
        {service.location && (
          <div className="flex flex-col">
            <span className="text-gray-600">Місцезнаходження:</span>
            <span className="font-semibold">{service.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePostDetails;
