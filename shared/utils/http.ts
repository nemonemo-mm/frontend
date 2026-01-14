import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://54.206.86.138:8080/api/v1",
  timeout: 10000,
});
