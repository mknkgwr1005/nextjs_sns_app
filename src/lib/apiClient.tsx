import axios from "axios";
import { headers } from "next/headers";

const apiClient = axios.create(
  process.env.ENVIROMENT === "PRODUCTION"
    ? {
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          "Content-Type": "application/json",
        },
      }
    : {
        baseURL: process.env.NEXT_PUBLIC_API_FOR_LOCAL,
        headers: {
          "Content-Type": "application/json",
        },
      }
);

export default apiClient;
