import Layout from "../components/Layout";
import ChatWidget from "../components/ChatWidget";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  Wallet,
  AlertTriangle,
  ListChecks,
  Sparkles,
  Plus,
  Receipt,
  UserPlus,
  FileBarChart,
} from "lucide-react";
import { NAVY, NAVY_DEEP, ORANGE, TEAL, AMBER } from "../theme";

const stats = [
  { label: "Active Projects", value: 6, icon: Briefcase, color: NAVY },
  { label: "Team Progress", value: "72%", icon: TrendingUp, color: TEAL },
  { label: "Budget Used", value: "$18,400", icon: Wallet, color: ORANGE },
  { label: "Risk Alerts", value: 2, icon: AlertTriangle, color: "#DC2626" },
  { label: "Pending Tasks", value: 14, icon: ListChecks, color: AMBER },
];

const quickActions = [
  { label: "New Task", icon: Plus, to: "/tasks" },
  { label: "Add Expense", icon: Receipt, to: "/budget" },
  { label: "Add Employee", icon: UserPlus, to: "/employees" },
  { label: "View Reports", icon: FileBarChart, to: "/budget" },
];

const team = [
  { name: "Sharaban Tahura", role: "UI/UX Designer", workload: 85 },
  { name: "Tasnim Tabassum", role: "Backend Developer", workload: 60 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout title="Dashboard">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 mb-6 text-white flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DEEP})` }}
      >
        <div>
          <p className="text-sm text-slate-300">Welcome back,</p>
          <h2 className="text-2xl font-bold">Manager 👋</h2>
          <p className="text-sm text-slate-300 mt-1">
            Here's what's happening with your team today.
          </p>
        </div>
        <Sparkles size={40} style={{ color: AMBER }} className="hidden sm:block" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-white"
              style={{ background: color }}
            >
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold" style={{ color: NAVY }}>
              {value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        {quickActions.map(({ label, icon: Icon, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium hover:shadow-sm transition"
            style={{ color: NAVY }}
          >
            <Icon size={15} style={{ color: ORANGE }} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold mb-4" style={{ color: NAVY }}>
              Recent Risk Alerts
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={16} /> Backend API task is 3 days overdue
              </li>
              <li className="flex items-center gap-2" style={{ color: ORANGE }}>
                <AlertTriangle size={16} /> Designer workload is above 90%
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold mb-4" style={{ color: NAVY }}>
              Pending Tasks
            </h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>• Finalize UI wireframes</li>
              <li>• Write API documentation</li>
              <li>• Review Q3 budget report</li>
            </ul>
          </div>
        </div>

        {/* Team snapshot */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold mb-4" style={{ color: NAVY }}>
            Team Snapshot
          </h2>
          <div className="space-y-4">
            {team.map((t) => (
              <div key={t.name}>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold"
                    style={{ background: ORANGE }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: NAVY }}>
                      {t.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${t.workload}%`, background: t.workload > 80 ? "#DC2626" : TEAL }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChatWidget />
    </Layout>
  );
}