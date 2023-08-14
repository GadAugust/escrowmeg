import apiClient from "./client";
const endpoint = "/api/v1/project/";

const ongoingProjects = (data) =>
  apiClient.post(endpoint + "fetch-ongoing-projects", data);
const completedProjects = (data) =>
  apiClient.post(endpoint + "fetch-complete-projects", data);
const requestPayment = (data) =>
  apiClient.post(endpoint + "request-payment", data);
const raiseDispute = (data) =>
  apiClient.post(endpoint + "raise-dispute", data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
const requestPaymentHistory = (data) =>
  apiClient.post(endpoint + "request-payment-history", data);
const sendMessage = (data) => apiClient.post(endpoint + "send-message", data);
const fetchMesssages = (data) =>
  apiClient.post(endpoint + "fetch-messages", data);
const fetchDisputes = (data) =>
  apiClient.post(endpoint + "fetch-disputes", data);
const acceptPayment = (data) =>
  apiClient.post(endpoint + "accept-request-payment", data);
const declinePayment = (data) =>
  apiClient.post(endpoint + "decline-request-payment", data);
const releaseFund = (data) => apiClient.post(endpoint + "release-fund", data);

export default {
  ongoingProjects,
  completedProjects,
  requestPayment,
  raiseDispute,
  requestPaymentHistory,
  sendMessage,
  fetchMesssages,
  fetchDisputes,
  acceptPayment,
  declinePayment,
  releaseFund,
};
