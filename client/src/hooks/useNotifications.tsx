import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setNotifications } from "../store/features/notificationSlice";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const messages = useSelector((state: RootState) => state.messages.messages);
  const { notifications, unreadCount: unreadNotifications } = useSelector(
    (state: RootState) => state.notifications
  );
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Перевірка на наявність непрочитаних повідомлень
  useEffect(() => {
    if (!user || !user._id) return;

    const unreadFound = Object.entries(messages).some(
      ([conversationId, conversationMessages]) =>
        conversationId.includes(user._id) &&
        conversationMessages.some(
          (msg) => !msg.read && msg.receiverId === user._id
        )
    );

    setHasUnreadMessages(unreadFound);
  }, [messages, user]);

  // Періодична перевірка нових сповіщень
  useEffect(() => {
    // Функція для отримання сповіщень з API
    const fetchNotifications = async () => {
      if (!user || !user._id) return;

      try {
        // Замініть цей URL на ваш реальний API endpoint
        const response = await fetch("/api/notifications");
        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        // Оновлюємо список сповіщень в Redux
        dispatch(setNotifications(data));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Отримуємо сповіщення одразу при завантаженні компонента
    fetchNotifications();

    // Налаштовуємо інтервал для періодичної перевірки (кожні 30 секунд)
    const interval = setInterval(fetchNotifications, 30000);

    // Прибираємо інтервал при розмонтуванні компонента
    return () => clearInterval(interval);
  }, [dispatch, user]);

  return { hasUnreadMessages, unreadNotifications };
};
