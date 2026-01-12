import { ModeIcon } from "./ModeIcon";

export function ModeCircle({ mode, onClick, disabled }) {
  const bgClass =
    mode === "auto"
      ? "bg-[#34C759]" // green
      : mode === "manual"
      ? "bg-[#FFCC00]" // yellow
      : "bg-[#E5E5EA]"; // gray (offline)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-[140px] h-[139px]
        rounded-full
        flex items-center justify-center
        transition-colors duration-200
        ${bgClass}
        ${disabled ? "opacity-70 cursor-not-allowed" : "active:scale-95"}
      `}
    >
      <ModeIcon mode={mode} />
    </button>
  );
}
