// /lib/axios.ts
import axios from "axios";
import { BACKEND_URL } from "./utils";

const api = axios.create({
  baseURL: `${BACKEND_URL}`, // proxy points to your Express backend
  withCredentials: true, // always send cookies
});

export default api;
