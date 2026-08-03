import client from "./client";

export const addRent = (payload) =>
  client.post("/rents", payload).then((res) => res.data);


export const getRents = (params = {}) => 
  client.get("/rents", { params }).then((res) => res.data);

export const getSingleRent = (rent_id) =>
  client.get(`/rents/${rent_id}`).then((res) => res.data);


export const getMyRents = (params = {}) =>
  client.get("/rents/my-rents", { params }).then((res) => res.data);


export const getWarehouseRents = (warehouse_id, params = {}) =>
  client.get(`/rents/warehouse/${warehouse_id}`, { params }).then((res) => res.data);

export const updateRent = (rent_id, payload) =>
  client.put(`/rents/${rent_id}`, payload).then((res) => res.data);

export const deleteRent = (rent_id) =>
  client.delete(`/rents/${rent_id}`).then((res) => res.data);