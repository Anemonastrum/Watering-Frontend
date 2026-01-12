import { useEffect, useState } from "react";
import {
  getHourlyStats,
  getDailyStats,
  getDailyPumpUsage,
} from "../api/telemetry";

import { PageHeader } from "../components/PageHeader";

export default function Stats() {
  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [pump, setPump] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHourlyStats().catch(() => ({ data: [] })),
      getDailyStats().catch(() => ({ data: [] })),
      getDailyPumpUsage().catch(() => ({ data: [] })),
    ])
      .then(([h, d, p]) => {
        setHourly(h.data.slice(-6));
        setDaily(d.data.slice(-5));
        setPump(p.data.slice(-5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Page>
        <p className="text-[17px] text-[rgba(60,60,67,0.6)]">
          Loading stats…
        </p>
      </Page>
    );
  }

  return (
    <Page>

        <PageHeader title="Stats" />

      {/* CHART */}
      <Section title="Last 6 Hours · Temperature">
        {hourly.length === 0 ? (
          <EmptyRow />
        ) : (
          <div className="px-4 py-4">
            <TemperatureChart data={hourly} />
          </div>
        )}
      </Section>

      {/* AVG TEMPERATURE */}
      <Section title="Average Temperature">
        {daily.length === 0 ? (
          <EmptyRow />
        ) : (
          daily.map((d, i) => (
            <Row
              key={i}
              title={formatDay(d.day)}
              value={`${d.avgTemperature} °C`}
              last={i === daily.length - 1}
            />
          ))
        )}
      </Section>

      {/* AVG HUMIDITY */}
      <Section title="Average Humidity">
        {daily.length === 0 ? (
          <EmptyRow />
        ) : (
          daily.map((d, i) => (
            <Row
              key={i}
              title={formatDay(d.day)}
              value={`${d.avgHumidity} %`}
              last={i === daily.length - 1}
            />
          ))
        )}
      </Section>

      {/* PUMP ACTIVATIONS */}
      <Section title="Pump Activations">
        {pump.length === 0 ? (
          <EmptyRow />
        ) : (
          pump.map((p, i) => (
            <Row
              key={i}
              title={formatDay(p.day)}
              value={`${p.activations} times`}
              last={i === pump.length - 1}
            />
          ))
        )}
      </Section>

      {/* PUMP RUNTIME */}
      <Section title="Pump Runtime">
        {pump.length === 0 ? (
          <EmptyRow />
        ) : (
          pump.map((p, i) => (
            <Row
              key={i}
              title={formatDay(p.day)}
              value={formatSeconds(p.runtimeSeconds)}
              last={i === pump.length - 1}
            />
          ))
        )}
      </Section>

    </Page>
  );
}

/* ---------------- Layout ---------------- */

function Page({ children }) {
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex justify-center px-4 py-6 pb-24">
      <div className="w-full max-w-[402px] flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}

/* ---------------- Chart ---------------- */

function TemperatureChart({ data }) {
  const values = data.map(d => d.avgTemperature);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return (
    <svg viewBox="0 0 300 100" className="w-full h-[100px]">
      <polyline
        fill="none"
        stroke="#34C759"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={values.map((v, i) => {
          const x = (i / (values.length - 1)) * 300;
          const y = 100 - ((v - min) / range) * 80 - 10;
          return `${x},${y}`;
        }).join(" ")}
      />
    </svg>
  );
}

/* ---------------- Helpers ---------------- */

function formatHour(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(day) {
  return new Date(day).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatSeconds(sec = 0) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/* ---------------- UI Components ---------------- */

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1 w-full">
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
      <div className="text-[17px] text-right text-[rgba(60,60,67,0.6)]">
        {value}
      </div>
    </div>
  );
}

function EmptyRow() {
  return (
    <div className="h-[44px] px-4 flex items-center text-[17px] text-[rgba(60,60,67,0.6)]">
      No data available
    </div>
  );
}
