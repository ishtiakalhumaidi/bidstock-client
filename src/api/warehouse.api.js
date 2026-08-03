// warehouse.api.js
import client from "./client";

export const addWarehouse = (payload) =>
  client.post("/warehouses", payload).then((res) => res.data);

export const getWarehouses = (params = {}) =>
  client.get("/warehouses", { params }).then((res) => res.data);

export const getMyWarehouses = (params = {}) =>
  client.get("/warehouses/my-warehouse", { params }).then((res) => res.data);

export const getSingleWarehouse = (warehouse_id) =>
  client.get(`/warehouses/${warehouse_id}`).then((res) => res.data);

export const updateWarehouse = (warehouse_id, payload) =>
  client.put(`/warehouses/${warehouse_id}`, payload).then((res) => res.data);

export const deleteWarehouse = (warehouse_id) =>
  client.delete(`/warehouses/${warehouse_id}`).then((res) => res.data);