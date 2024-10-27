import { getCookie } from "cookies-next";

const { axiosInstance } = require("@/lib/axios");

export const loginUser = async (data) => {
  const response = await axiosInstance.post("/api/v1/login", data);
  return response;
};

export const registerUser = async (data) => {
  const response = await axiosInstance.post("/api/v1/register", data);
  return response;
};

export const logoutUser = async () => {
  const response = await axiosInstance.get("/api/v1/logout", {
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
  });
  return response;
};
