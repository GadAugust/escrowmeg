import apiClient from "./client";
const endpoint = "/api/v1/auth";

const verifyEmail = (data) => apiClient.post(endpoint + "/verify-email", data);
const verifyCode = (data) => apiClient.post(endpoint + "/verify-code", data);
const registerUser = (data) => apiClient.post(endpoint + "/register", data);
const logIn = (data) => apiClient.post(endpoint + "/login", data);
const forgotPassword = (data) =>
  apiClient.post(endpoint + "/forgot-password", data);
const addAccountDetails = (data) =>
  apiClient.post(endpoint + "/add-account-details", data);
const updatePassword = (data) =>
  apiClient.post(endpoint + "/update-password", data);
const transactionPin = (data) => apiClient.post(endpoint + "/add-pin", data);
const fetchAccounts = (data) =>
  apiClient.post(endpoint + "/fetch-accounts", data);
const addProfilePics = (data) =>
  apiClient.post(endpoint + "/add-profile-pics", data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

export default {
  verifyEmail,
  verifyCode,
  registerUser,
  logIn,
  forgotPassword,
  addAccountDetails,
  updatePassword,
  transactionPin,
  fetchAccounts,
  addProfilePics,
};
