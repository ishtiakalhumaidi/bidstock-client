import client from "./client";

export const addBid = (payload) =>
  client.post("/bids", payload).then((res) => res.data);

export const getBids = (params = {}) => 
  client.get("/bids", { params }).then((res) => res.data);

export const getMyBids = (params = {}) =>
  client.get("/bids/my-bids", { params }).then((res) => res.data);

export const getSingleBid = (bid_id) =>
  client.get(`/bids/${bid_id}`).then((res) => res.data);

export const updateBid = (bid_id, payload) =>
  client.put(`/bids/${bid_id}`, payload).then((res) => res.data);

export const deleteBid = (bid_id) =>
  client.delete(`/bids/${bid_id}`).then((res) => res.data);

// --- Market Offer Resolution Nodes ---

export const getBidOffers = (bid_id) =>
  client.get(`/bids/${bid_id}/offers`).then((res) => res.data);

export const acceptOffer = (bid_id, offer_id) =>
  client.put(`/bids/${bid_id}/offers/${offer_id}/accept`).then((res) => res.data);

export const rejectOffer = (bid_id, offer_id) =>
  client.put(`/bids/${bid_id}/offers/${offer_id}/reject`).then((res) => res.data);