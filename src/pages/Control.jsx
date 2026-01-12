import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { setPump } from "../api/control";
import toast from "react-hot-toast";

import { PageHeader } from "../components/PageHeader";

export default function Control() {
  const { config } = useSocket();

  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const isOffline = !config;

  const deviceMode = isOffline
    ? "OFFLINE"
    : config.auto_mode
    ? "AUTO"
    : "MANUAL";

  const startPump = async () => {
    setLoading(true);
    try {
      await setPump("ON", duration ? Number(duration) : undefined);
      toast.success("Pump started");
    } catch {
      toast.error("Failed to start pump");
    } finally {
      setLoading(false);
    }
  };

  const stopPump = async () => {
    setLoading(true);
    try {
      await setPump("OFF");
      toast.success("Pump stopped");
    } catch {
      toast.error("Failed to stop pump");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex justify-center px-4 py-6 pb-24">
      <div className="w-full max-w-[402px] flex flex-col gap-6">

        <PageHeader title="Control" />

        {/* STATUS LIST */}
        <Section title="Status">
          <Row
            title="Device Mode"
            value={deviceMode}
            danger={isOffline}
          />
          <Row
            title="Pump"
            value={
              isOffline
                ? "—"
                : config.pump_running
                ? "Running"
                : "Stopped"
            }
            last
          />
        </Section>

        {/* INPUT LIST */}
        <Section title="Pump Settings">
          <InputRow
            title="Duration (sec)"
            value={duration}
            onChange={setDuration}
            disabled={isOffline || loading}
            last
          />
        </Section>

        {/* ACTION BUTTONS (OUTSIDE LIST) */}
        <div className="flex flex-col gap-3 px-1">
          <button
            onClick={startPump}
            disabled={
              isOffline ||
              loading ||
              config?.pump_running ||
              config?.auto_mode
            }
            className="
              h-[50px]
              rounded-[14px]
              bg-[#34C759]
              text-white
              text-[17px]
              font-semibold
              disabled:opacity-60
            "
          >
            Start Pump
          </button>

          <button
            onClick={stopPump}
            disabled={
              isOffline ||
              loading ||
              !config?.pump_running
            }
            className="
              h-[50px]
              rounded-[14px]
              bg-[#FF3B30]
              text-white
              text-[17px]
              font-semibold
              disabled:opacity-60
            "
          >
            Stop Pump
          </button>
        </div>

        {isOffline && (
          <p className="text-center text-[13px] text-[rgba(60,60,67,0.6)]">
            Device is offline. Controls are disabled.
          </p>
        )}

        {!isOffline && config.auto_mode && (
          <p className="text-center text-[13px] text-[rgba(60,60,67,0.6)]">
            Manual control is disabled while Auto mode is enabled.
          </p>
        )}

      </div>
    </div>
  );
}

/* ---------------- UI ---------------- */

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="px-4">
        <p className="text-[13px] uppercase text-[rgba(60,60,67,0.6)]">
          {title}
        </p>
      </div>
      <div className="bg-white rounded-[10px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ title, value, last, danger }) {
  return (
    <div
      className={`flex items-center h-[44px] px-4 ${
        !last ? "border-b border-[rgba(84,84,86,0.34)]" : ""
      }`}
    >
      <div className="flex-1 text-[17px] text-black">
        {title}
      </div>
      <div
        className={`text-[17px] ${
          danger ? "text-red-500" : "text-[rgba(60,60,67,0.6)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function InputRow({ title, value, onChange, disabled, last }) {
  return (
    <div
      className={`flex items-center h-[44px] px-4 ${
        !last ? "border-b border-[rgba(84,84,86,0.34)]" : ""
      }`}
    >
      <div className="flex-1 text-[17px] text-black">
        {title}
      </div>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Default"
        className="
          w-[120px]
          text-right
          text-[17px]
          bg-transparent
          outline-none
          text-black
          placeholder:text-[rgba(60,60,67,0.3)]
          disabled:opacity-60
        "
      />
    </div>
  );
}
