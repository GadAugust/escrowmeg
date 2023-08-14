import apiClient from "./client";
const endpoint = "/api/v1/listing";
const userendpoint = "/api/v1/user_manager";

const acceptBid = (data) => apiClient.post(endpoint + "/accept-bid", data);
const bidListing = (data) => apiClient.post(endpoint + "/bid", data);
const createListing = (data) =>
  apiClient.post(endpoint + "/create-listing", data);
const declineBid = (data) => apiClient.post(endpoint + "/decline-bid", data);
const fetchListings = (data) =>
  apiClient.post(endpoint + "/fetch-listings", data);
const searchListings = (data) =>
  apiClient.post(endpoint + "/search-listings", data);
const fetchListingBids = (data) =>
  apiClient.post(endpoint + "/fetch-listing-bids", data);
const fetchMyBids = (data) => apiClient.post(endpoint + "/fetch-my-bids", data);
const fetchAllListings = (data) =>
  apiClient.post(endpoint + "/fetch-all-listings", data);
const fetchMySummary = (data) =>
  apiClient.post(userendpoint + "/user-summary", data);
const fetchListingsWithBids = (data) =>
  apiClient.post(endpoint + "/fetch-listings-with-bids", data);

export default {
  acceptBid,
  bidListing,
  createListing,
  declineBid,
  fetchListings,
  fetchAllListings,
  fetchMyBids,
  fetchListingBids,
  searchListings,
  fetchMySummary,
  fetchListingsWithBids,
};
