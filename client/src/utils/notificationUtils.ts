import { format, formatDistanceToNow } from "date-fns";

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return "ThumbUp";
    case "comment":
      return "ChatBubbleOutline";
    case "follow":
      return "PersonAdd";
    default:
      return "Notifications";
  }
};

export const getNotificationColor = (type: string) => {
  switch (type) {
    case "like":
      return "primary";
    case "comment":
      return "secondary";
    case "follow":
      return "success";
    default:
      return "default";
  }
};

export const formatNotificationContent = (notification: any) => {
  const senderName = notification.senderId?.username || "User";
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });
  const exactTime = format(new Date(notification.createdAt), "PPpp");

  switch (notification.type) {
    case "like":
      return {
        primary: {
          senderName,
          content: "liked your post",
          postTitle: notification.postId?.title || "",
        },
        secondary: {
          timeAgo,
          exactTime,
        },
        linkTo: `/posts/${notification.postId?._id}`,
      };
    case "comment":
      return {
        primary: {
          senderName,
          content: "commented on your post",
          commentText: notification.commentText || "",
        },
        secondary: {
          timeAgo,
          exactTime,
        },
        linkTo: `/posts/${notification.postId?._id}`,
      };
    case "follow":
      return {
        primary: {
          senderName,
          content: "subscribed to your updates",
        },
        secondary: {
          timeAgo,
          exactTime,
        },
        linkTo: `/profile/${notification.senderId?._id}`,
      };
    default:
      return {
        primary: {
          content: "New notification",
        },
        secondary: {
          timeAgo,
          exactTime,
        },
        linkTo: "/",
      };
  }
};

export const notificationTypes = [
  { type: "like", label: "Like", icon: "ThumbUp" },
  { type: "comment", label: "Comments", icon: "ChatBubbleOutline" },
  { type: "follow", label: "Subscriptions", icon: "PersonAdd" },
];
