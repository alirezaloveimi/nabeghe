"use client";

import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

export default function ToastWrapper() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      hideProgressBar
      draggable
      position="top-center"
      closeButton={false}
      autoClose={1500}
      theme={theme}
      toastClassName="border border-border"
    />
  );
}
