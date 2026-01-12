import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export function PageHeader({
  title,
  showBack = false,
  trailing,
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[402px] bg-[#F2F2F7] z-20">
      {/* Controls row (optional, kept for spacing consistency) */}
      <div className="relative h-[44px]">
        {/* Leading */}
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="
              absolute left-0 top-0
              h-[44px] px-4
              flex items-center
              text-[#34C759]
            "
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        )}

        {/* Trailing */}

      </div>

      {/* Large title */}
      <div className="px-4 pt-[3px] pb-2">
        <h1 className="text-[34px] leading-[41px] font-bold tracking-[0.4px] text-black">
          {title}
        </h1>
      </div>
    </div>
  );
}
