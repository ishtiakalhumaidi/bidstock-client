// users.api.js
import client from "./client";

export const getUsers = (params = {}) =>
  client.get("/users", { params }).then((res) => res.data);

export const getSingleUser = (user_id) =>
  client.get(`/users/${user_id}`).then((res) => res.data);

export const getDashboardStats = () =>
  client.get("/users/dashboard-stats").then((res) => res.data);

export const updateUser = (user_id, payload) =>
  client.put(`/users/${user_id}`, payload).then((res) => res.data);

export const deleteUser = (user_id) =>
  client.delete(`/users/${user_id}`).then((res) => res.data);