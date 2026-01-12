import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "../socket/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [telemetry, setTelemetry] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);
  const [config, setConfig] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on("telemetry", (data) => {
        setTelemetry(data);
        setLastSeen(Date.now());
    });
    socket.on("config", setConfig);
    socket.on("alert", (alert) =>
      setAlerts((prev) => [alert, ...prev])
    );

    return () => socket.disconnect();
  }, [token]);

  return (
    <SocketContext.Provider value={{ telemetry, config, alerts, lastSeen }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
