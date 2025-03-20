import { API_URL } from "./url";
export const fetchNotifications = async (userId: string) => {
  const response = await fetch(`${API_URL}/notifications/${userId}`, {
    credentials: "include",
  });
  return response.json();
};

export const markAsRead = async (notificationId: string) => {
  return fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: "PUT",
    credentials: "include",
  });
};

export const markAllAsRead = async (userId: string) => {
  return fetch(`${API_URL}/notifications/${userId}/read-all`, {
    method: "PUT",
    credentials: "include",
  });
};
