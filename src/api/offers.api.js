import client from "./client";

export const addOffer = (payload) =>
  client.post("/offers", payload).then((res) => res.data);


export const getOffers = (params = {}) => 
  client.get("/offers", { params }).then((res) => res.data);

export const getSingleOffer = (offer_id) =>
  client.get(`/offers/${offer_id}`).then((res) => res.data);


export const getBidOffers = (bid_id, params = {}) =>
  client.get(`/offers/bid/${bid_id}`, { params }).then((res) => res.data);

export const acceptOffer = (offer_id) =>
  client.post(`/offers/${offer_id}/accept`).then((res) => res.data);


export const getMyOffers = (params = {}) =>
  client.get("/offers/my-offers", { params }).then((res) => res.data);

export const updateOffer = (offer_id, payload) =>
  client.put(`/offers/${offer_id}`, payload).then((res) => res.data);

export const deleteOffer = (offer_id) =>
  client.delete(`/offers/${offer_id}`).then((res) => res.data);