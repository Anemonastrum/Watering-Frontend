import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { Toaster } from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "20px",
            background: "#FFFFFF",
            color: "#000000",
            fontSize: "15px",
            padding: "12px 16px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.08)",
          },
          success: {
            style: {
              border: "1px solid #34C759",
            },
          },
          error: {
            style: {
              border: "1px solid #FF3B30",
            },
          },
        }}
      />
    </>
  </React.StrictMode>
);