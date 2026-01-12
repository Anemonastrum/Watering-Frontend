import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  HandRaisedIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

export function Dock() {
  const { pathname } = useLocation();

  // Hide dock on login page
  if (pathname === "/login") return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        bg-white
        border-t border-[rgba(60,60,67,0.29)]
        flex justify-center
        z-50
      "
    >
      <div className="w-full max-w-[402px] flex justify-between px-6 py-2">
        <DockItem to="/" icon={HomeIcon} label="Home" />
        <DockItem to="/stats" icon={ChartBarIcon} label="Stats" />
        <DockItem to="/control" icon={HandRaisedIcon} label="Manual" />
        <DockItem to="/settings" icon={Cog6ToothIcon} label="Settings" />
      </div>
    </div>
  );
}

function DockItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        flex flex-col items-center gap-1
        w-[60px]
        transition
        ${
          isActive
            ? "text-[#34C759]"
            : "text-[rgba(60,60,67,0.6)]"
        }
        active:scale-95
      `
      }
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium">
        {label}
      </span>
    </NavLink>
  );
}
