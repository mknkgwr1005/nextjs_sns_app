import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_FOR_LOCAL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
