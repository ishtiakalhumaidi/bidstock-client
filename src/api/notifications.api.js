import client from "./client";

export const getMyNotifications = (params = {}) =>
  client.get("/notifications/my-notifications", { params }).then((res) => res.data);

export const getUnreadCount = () =>
  client.get("/notifications/unread-count").then((res) => res.data);

export const markAsRead = (notification_id) =>
  client
    .patch(`/notifications/${notification_id}/read`)
    .then((res) => res.data);

export const markAllAsRead = () =>
  client.patch("/notifications/read-all").then((res) => res.data);

export const deleteNotification = (notification_id) =>
  client.delete(`/notifications/${notification_id}`).then((res) => res.data);