export function DeviceInfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-12">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* Bottom sheet */}
      <div
        className="
          relative
          w-full max-w-[402px]
          bg-white
          rounded-t-[20px]
          px-6 pt-4 pb-8
        "
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-[#D1D1D6] mx-auto mb-4" />

        {/* Title */}
        <p className="text-[17px] font-semibold text-black mb-4 text-center">
          Device Information
        </p>

        {/* Info list */}
        <div className="bg-[#F2F2F7] rounded-[12px] overflow-hidden">
          <InfoRow title="Device Name" value="Strelitzia" />
          <InfoRow title="Device Type" value="Plant Waterer" last />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="
            mt-6
            h-[50px]
            w-full
            rounded-[14px]
            bg-[#34C759]
            text-white
            text-[17px]
            font-semibold
          "
        >
          Done
        </button>
      </div>
    </div>
  );
}

function InfoRow({ title, value, last }) {
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
