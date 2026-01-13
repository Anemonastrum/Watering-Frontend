import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  socket = io("https://iot-api.anemona.cloud", {
    auth: { token },
  });
  return socket;
};

export const getSocket = () => socket;
