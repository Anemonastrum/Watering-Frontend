import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import {
    getLatestTelemetry,
    getAlerts,
} from "../api/telemetry";
import { updateConfig } from "../api/control";
import toast from "react-hot-toast";
import { ModeCircle } from "../components/ModeCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    ArrowLeftIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";

import { DeviceInfoModal } from "../components/DeviceInfoModal";


function formatUptime(seconds) {
    if (seconds == null) return "—";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
}

function formatLastSeen(lastSeen) {
    if (!lastSeen) return "—";

    const diffSec = Math.floor((Date.now() - lastSeen) / 1000);

    if (diffSec < 60) return `${diffSec}s ago`;

    const min = Math.floor(diffSec / 60);
    if (min < 60) return `${min}m ago`;

    const h = Math.floor(min / 60);
    return `${h}h ago`;
}

export default function Dashboard() {
    const { telemetry, config, lastSeen } = useSocket();

    const [latest, setLatest] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [updatingMode, setUpdatingMode] = useState(false);

    const OFFLINE_TIMEOUT = 15_000; // 15 seconds

    const navigate = useNavigate();
    const { logout } = useAuth();


    const isOffline =
        !lastSeen || Date.now() - lastSeen > OFFLINE_TIMEOUT;

    const modeState = isOffline
        ? "offline"
        : config?.auto_mode
            ? "auto"
            : "manual";


    useEffect(() => {
        getLatestTelemetry().then((res) => setLatest(res.data));
        getAlerts().then((res) => setAlerts(res.data.slice(0, 3)));
    }, []);

    const data = telemetry || latest;

    const setMode = async (auto) => {
        if (config?.auto_mode === auto) return;

        setUpdatingMode(true);
        try {
            await updateConfig({ auto_mode: auto });
            toast.success(auto ? "Auto mode enabled" : "Manual mode enabled");
        } catch {
            toast.error("Failed to update mode");
        } finally {
            setUpdatingMode(false);
        }
    };

    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="min-h-screen bg-[#F2F2F7] flex justify-center px-4 py-6 pb-24">
            <div className="w-full max-w-[402px] flex flex-col gap-6">
                {/* DEVICE HEADER */}
                <div className=" rounded-[20px] px-4 py-5">
                    {/* TOP ROW */}
                    <div className="flex items-center justify-between h-[52px] mb-4">

                        {/* LEFT: LOGOUT */}
                        <button
                            onClick={logout}
                            className="
        w-[44px] h-[44px]
        flex items-center justify-center
        active:bg-[#E5E5EA]
        transition
      "
                        >
                            <ArrowLeftIcon className="w-6 h-6 text-black" />
                        </button>

                        {/* CENTER: TITLE */}
                        <div className="flex flex-col items-center text-center">
                            <p className="text-[20px] font-semibold leading-[25px] text-black">
                                Strelitzia
                            </p>
                            <p className="text-[17px] text-[rgba(60,60,67,0.6)]">
                                Plant Waterer
                            </p>
                        </div>

                        {/* RIGHT: INFO */}
                        <button
                            disabled={isOffline}
                            onClick={() => setShowInfo(true)}
                            className="
    w-[44px] h-[44px]
    flex items-center justify-center
    active:bg-[#E5E5EA]
    transition
    disabled:opacity-40
  "
                        >
                            <InformationCircleIcon className="h-6 w-6 text-black" />
                        </button>


                    </div>

                    {/* MODE SECTION */}
                    <div className="flex flex-col items-center gap-3">
                        <ModeCircle
                            mode={modeState}
                            disabled={updatingMode || isOffline || config === null}
                            onClick={() => {
                                if (isOffline) return;
                                setMode(!config?.auto_mode);
                            }}
                        />

                        <p className="text-[13px] text-[rgba(60,60,67,0.6)]">
                            Mode
                        </p>

                        <p className="text-[17px] font-semibold text-black">
                            {isOffline
                                ? "OFFLINE"
                                : config?.auto_mode
                                    ? "AUTO"
                                    : "MANUAL"}
                        </p>
                    </div>
                </div>


                {/* ALERTS */}
                <Section title="Alerts">
                    {alerts.length === 0 && (
                        <Row title="No alerts" value="" last />
                    )}
                    {alerts.map((a, i) => (
                        <Row
                            key={i}
                            title={a.message}
                            value={a.level}
                            danger={a.level === "critical"}
                            last={i === alerts.length - 1}
                        />
                    ))}
                </Section>

                {/* TELEMETRY */}
                <Section title="Sensors Data">
                    <Row title="Temperature" value={data ? `${data.temperature} °C` : "—"} />
                    <Row title="Humidity" value={data ? `${data.humidity} %` : "—"} />
                    <Row title="Soil Moisture" value={data ? data.soil_moisture : "—"} />
                    <Row title="Water Level" value={data ? data.water_level : "—"} />
                    <Row
                        title={isOffline ? "Last Seen" : "Uptime"}
                        value={
                            isOffline
                                ? formatLastSeen(lastSeen)
                                : data
                                    ? formatUptime(data.uptime_sec)
                                    : "—"
                        }
                    />

                    <Row title="IP Address" value={data ? data.ip_address : "—"} last />
                </Section>



            </div>
            {showInfo && (
                <DeviceInfoModal onClose={() => setShowInfo(false)} />
            )}
        </div>
    );
}

/* ---------------- Components ---------------- */

function ModeButton({ label, active, onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        px-6 py-2
        rounded-[20px]
        text-[17px]
        font-semibold
        transition
        ${active
                    ? "bg-[#34C759] text-white"
                    : "bg-white text-black border border-[rgba(60,60,67,0.29)]"
                }
        ${disabled ? "opacity-60" : ""}
      `}
        >
            {label}
        </button>
    );
}

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
            className={`flex items-center h-[44px] px-4 ${!last
                ? "border-b border-[rgba(84,84,86,0.34)]"
                : ""
                }`}
        >
            <div className="flex-1 text-[17px] text-black leading-[22px]">
                {title}
            </div>
            <div
                className={`text-[17px] text-right leading-[22px] ${danger
                    ? "text-red-500"
                    : "text-[rgba(60,60,67,0.6)]"
                    }`}
            >
                {value}
            </div>
            


        </div>
    );
}
