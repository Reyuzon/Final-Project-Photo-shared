import { axiosInstance } from "@/lib/axios";
import { getCookie } from "cookies-next";

export const uploadImage = async (image) => {
  const response = await axiosInstance.post(
    "/api/v1/upload-image",
    { image },
    {
      headers: {
        Authorization: "Bearer " + getCookie("token"),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};
