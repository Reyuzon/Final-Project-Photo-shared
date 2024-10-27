import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";

const initialState = {
  isDarkMode: false, // Set default awal di server
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkMode: (state) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(true));
      }
      state.isDarkMode = true;
    },
    setLightMode: (state) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(false));
      }
      state.isDarkMode = false;
    },
    initializeTheme: (state) => {
      if (typeof window !== "undefined") {
        const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
        state.isDarkMode = !!isDarkMode;
      }
    },
  },
});

export const { setDarkMode, setLightMode, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;