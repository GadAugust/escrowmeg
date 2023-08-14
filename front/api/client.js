import { create } from "apisauce";

const myLocalPhone = "http://192.168.43.153:8080";


const apiClient = create({
  baseURL: myLocalPhone,
});

export default apiClient;
