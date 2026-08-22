import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Wallet,
  Users,
  AlertTriangle,
  Sparkles,
  Rocket,
  LogOut,
} from "lucide-react";
import { ORANGE, NAVY_DEEP } from "../theme";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Task Management", icon: ListTodo },
  { to: "/budget", label: "Budget Monitoring", icon: Wallet },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/risks", label: "Risk & Alerts", icon: AlertTriangle },
  { to: "/recommendations", label: "AI Recommendations", icon: Sparkles },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside
      className="w-64 h-screen text-slate-200 flex flex-col fixed left-0 top-0"
      style={{ background: NAVY_DEEP }}
    >
      <div className="p-6 flex items-center gap-2 border-b border-white/10">
        <div
          className="w-8 h-8 rounded-lg text-white flex items-center justify-center"
          style={{ background: ORANGE }}
        >
          <Rocket size={16} />
        </div>
        <span className="text-lg font-extrabold text-white">StartupAI</span>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "text-white" : "text-slate-300 hover:bg-white/5"
              }`
            }
            style={({ isActive }) => (isActive ? { background: ORANGE } : {})}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-slate-300 hover:bg-white/5 transition"
        >
          <LogOut size={18} />
          Log Out
        </button>
        
      </div>
    </aside>
  );
}
