import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/api";
import { logout } from "../auth/auth";

const SOCKET_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState({
    temperature: "-",
    humidity: "-",
    soil_moisture: "-",
    water_level: "-"
  });

  const [dryThreshold, setDryThreshold] = useState(450);
  const [pumpDuration, setPumpDuration] = useState(10);
  const [autoMode, setAutoMode] = useState(true);

  const [status, setStatus] = useState({
    wifi: "UNKNOWN",
    mqtt: "UNKNOWN"
  });

  // ---- SOCKET.IO ----
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"]
    });

    socket.on("mqtt-data", ({ topic, data }) => {
      if (topic.includes("telemetry")) {
        setTelemetry(data);
      }

      if (topic.includes("status")) {
        setStatus({
          wifi: "OK",
          mqtt: data.online ? "OK" : "DOWN"
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ---- SAVE CONFIG ----
  const saveConfig = async () => {
    try {
      await api.post("/api/device/config", {
        dry_threshold: dryThreshold,
        pump_duration: pumpDuration,
        auto_mode: autoMode
      });
      alert("Configuration saved");
    } catch (err) {
      alert("Failed to save config");
    }
  };

  // ---- MANUAL PUMP ----
  const pump = async (state) => {
    try {
      await api.post("/api/device/pump", { state });
    } catch {
      alert("Pump command failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Plant Watering Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatusCard label="Temperature" value={`${telemetry.temperature} °C`} />
        <StatusCard label="Humidity" value={`${telemetry.humidity} %`} />
        <StatusCard label="Soil Moisture" value={telemetry.soil_moisture} />
        <StatusCard label="Water Level" value={telemetry.water_level} />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Configuration</h2>

          <label className="block mb-1">Soil Dry Threshold</label>
          <input
            type="number"
            className="w-full border p-2 rounded mb-3"
            value={dryThreshold}
            onChange={(e) => setDryThreshold(Number(e.target.value))}
          />

          <label className="block mb-1">Pump Duration (seconds)</label>
          <input
            type="number"
            className="w-full border p-2 rounded mb-3"
            value={pumpDuration}
            onChange={(e) => setPumpDuration(Number(e.target.value))}
          />

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
            />
            <span>Auto Mode</span>
          </label>

          <button
            onClick={saveConfig}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Configuration
          </button>
        </div>

        {/* Manual Control */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Manual Pump Control</h2>

          <div className="flex gap-4">
            <button
              onClick={() => pump("ON")}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Pump ON
            </button>

            <button
              onClick={() => pump("OFF")}
              className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
            >
              Pump OFF
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Note: Pump may not activate if tank is empty or auto mode is enabled.
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- SMALL REUSABLE COMPONENT ----
function StatusCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
