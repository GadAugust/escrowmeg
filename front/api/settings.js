import apiClient from "./client";
const endpoint = "/api/v1/settings/";

const changePassword = (data) =>
  apiClient.post(endpoint + "change-password", data);
const changePin = (data) => apiClient.post(endpoint + "change-pin", data);
const updatePin = (data) => apiClient.post(endpoint + "update-pin", data);

export default {
  changePassword,
  changePin,
  updatePin,
};
