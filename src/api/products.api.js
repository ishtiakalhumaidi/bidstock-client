// products.api.js
import client from "./client";

export const addProduct = (payload) =>
  client.post("/products", payload).then((res) => res.data);

export const getProducts = (params = {}) =>
  client.get("/products", { params }).then((res) => res.data);

export const getSingleProduct = (product_id) =>
  client.get(`/products/${product_id}`).then((res) => res.data);

export const getSellerProducts = (params = {}) =>
  client.get("/products/my-products", { params }).then((res) => res.data);

export const updateProduct = (product_id, payload) =>
  client.put(`/products/${product_id}`, payload).then((res) => res.data);

export const deleteProduct = (product_id) =>
  client.delete(`/products/${product_id}`).then((res) => res.data);