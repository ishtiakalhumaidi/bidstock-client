import client from "./client";

export const addInventory = (payload) =>
  client.post("/inventory/add", payload).then((res) => res.data);

export const getInventories = (params = {}) =>
  client.get("/inventory", { params }).then((res) => res.data);

export const getMyInventory = (params = {}) =>
  client.get("/inventory/my-inventory", { params }).then((res) => res.data);

export const getWarehouseOwnerInventory = (params = {})=>
  client.get("/inventory/my-warehouse-inventory", { params }).then((res) => res.data);

export const getSingleInventory = (product_id, warehouse_id) =>
  client
    .get(`/inventory/${product_id}/${warehouse_id}`)
    .then((res) => res.data);

export const updateInventory = (product_id, warehouse_id, payload) =>
  client
    .put(`/inventory/${product_id}/${warehouse_id}`, payload)
    .then((res) => res.data);

export const deleteInventory = (product_id, warehouse_id) =>
  client
    .delete(`/inventory/${product_id}/${warehouse_id}`)
    .then((res) => res.data);