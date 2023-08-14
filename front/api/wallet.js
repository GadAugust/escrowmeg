import apiClient from "./client";
const endpoint = "/api/v1/wallet/";
const stripeEndpoint = "/api/v1/stripe/";

const addMoney = (data) => apiClient.post(endpoint + "add-money", data);
const createPaymentIntent = (data) =>
  apiClient.post(stripeEndpoint + "intent", data);
const withdrawMoney = (data) => apiClient.post(endpoint + "withdraw", data);
const transactionHistory = (data) =>
  apiClient.post(endpoint + "transactions", data);

export default {
  addMoney,
  createPaymentIntent,
  withdrawMoney,
  transactionHistory,
};
