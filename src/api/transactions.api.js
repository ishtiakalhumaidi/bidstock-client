import client from "./client";

export const addTransaction = (payload) =>
  client.post("/transactions", payload).then((res) => res.data);


export const getTransactions = (params = {}) =>
  client.get("/transactions", { params }).then((res) => res.data);

export const getSingleTransaction = (transaction_id) =>
  client.get(`/transactions/${transaction_id}`).then((res) => res.data);


export const getMyTransactions = (params = {}) =>
  client.get("/transactions/my-transactions", { params }).then((res) => res.data);

export const payTransaction = (transaction_id) =>
  client.patch(`/transactions/${transaction_id}/pay`).then((res) => res.data);

export const updateTransaction = (transaction_id, payload) =>
  client
    .put(`/transactions/${transaction_id}`, payload)
    .then((res) => res.data);

export const deleteTransaction = (transaction_id) =>
  client.delete(`/transactions/${transaction_id}`).then((res) => res.data);