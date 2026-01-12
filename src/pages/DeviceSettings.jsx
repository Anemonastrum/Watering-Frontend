import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { updateConfig } from "../api/control";
import toast from "react-hot-toast";

import { PageHeader } from "../components/PageHeader";

export default function DeviceSettings() {
  const { config } = useSocket();

  const [form, setForm] = useState({
    auto_mode: false,
    dry_threshold: "",
    pump_duration: "",
    water_min_level: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!config) return;

    setForm({
      auto_mode: config.auto_mode ?? false,
      dry_threshold: config.dry_threshold ?? "",
      pump_duration: config.pump_duration ?? "",
      water_min_level: config.water_min_level ?? "",
    });
  }, [config]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig({
        auto_mode: form.auto_mode,
        dry_threshold: Number(form.dry_threshold),
        pump_duration: Number(form.pump_duration),
        water_min_level: Number(form.water_min_level),
      });
      toast.success("Configuration saved");
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex justify-center px-4 py-6 pb-24">
      <div className="w-full max-w-[402px] flex flex-col gap-6">

        <PageHeader title="Settings" />

        {/* DEVICE INFO */}
        <Section title="Device">
          <Row title="Name" value="Strelitzia" />
          <Row title="Type" value="Plant Waterer" />
          <Row title="Model" value="ESP32-S3-N16R8" last />
        </Section>

        <Section title="Thresholds">
          <InputRow
            title="Dry Soil Threshold"
            value={form.dry_threshold}
            unit=""
            onChange={(v) => handleChange("dry_threshold", v)}
          />
          <InputRow
            title="Pump Duration (sec)"
            value={form.pump_duration}
            onChange={(v) => handleChange("pump_duration", v)}
          />
          <InputRow
            title="Min Water Level"
            value={form.water_min_level}
            onChange={(v) => handleChange("water_min_level", v)}
            last
          />
        </Section>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={saving || !config}
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
          {saving ? "Saving…" : "Save Changes"}
        </button>

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

function Row({ title, value, last }) {
  return (
    <div
      className={`flex items-center h-[44px] px-4 ${
        !last ? "border-b border-[rgba(84,84,86,0.34)]" : ""
      }`}
    >
      <div className="flex-1 text-[17px] text-black">
        {title}
      </div>
      <div className="text-[17px] text-[rgba(60,60,67,0.6)]">
        {value}
      </div>
    </div>
  );
}

function InputRow({ title, value, unit, onChange, last }) {
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-[100px]
          text-right
          text-[17px]
          bg-transparent
          outline-none
          text-black
          placeholder:text-[rgba(60,60,67,0.3)]
        "
        placeholder="—"
      />
      {unit && (
        <span className="ml-1 text-[17px] text-[rgba(60,60,67,0.6)]">
          {unit}
        </span>
      )}
    </div>
  );
}

function ToggleRow({ title, value, onChange }) {
  return (
    <div className="flex items-center h-[44px] px-4">
      <div className="flex-1 text-[17px] text-black">
        {title}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`
          w-[50px] h-[30px]
          rounded-full
          transition
          ${value ? "bg-[#34C759]" : "bg-[#E5E5EA]"}
        `}
      >
        <div
          className={`
            w-[26px] h-[26px]
            bg-white rounded-full
            transition
            ${value ? "translate-x-[20px]" : "translate-x-[2px]"}
          `}
        />
      </button>
    </div>
  );
}
