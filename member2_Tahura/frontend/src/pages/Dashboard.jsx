import { useState, useEffect } from "react";
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
import { authHeaders, getUser } from "../utils/auth";

const quickActions = [
  { label: "New Task", icon: Plus, to: "/tasks" },
  { label: "Add Expense", icon: Receipt, to: "/budget" },
  { label: "Add Employee", icon: UserPlus, to: "/employees" },
  { label: "View Reports", icon: FileBarChart, to: "/budget" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [budgetEntries, setBudgetEntries] = useState([]);
  const [risks, setRisks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/tasks", { headers: authHeaders() }).then((r) => r.json()),
      fetch("http://localhost:5000/api/budget", { headers: authHeaders() }).then((r) => r.json()),
      fetch("http://localhost:5000/api/risks", { headers: authHeaders() }).then((r) => r.json()),
      fetch("http://localhost:5000/api/employees", { headers: authHeaders() }).then((r) => r.json()),
    ])
      .then(([tasksData, budgetData, risksData, employeesData]) => {
        setTasks(tasksData);
        setBudgetEntries(budgetData);
        setRisks(risksData);
        setEmployees(employeesData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <p className="text-slate-500">Loading dashboard...</p>
      </Layout>
    );
  }

  // Real calculations from real data
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const teamProgress = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);

  const totalExpenses = budgetEntries
    .filter((b) => b.type === "expense")
    .reduce((sum, b) => sum + Number(b.amount), 0);

  const stats = [
    { label: "Active Projects", value: tasks.length, icon: Briefcase, color: NAVY },
    { label: "Team Progress", value: `${teamProgress}%`, icon: TrendingUp, color: TEAL },
    { label: "Budget Used", value: `$${totalExpenses.toLocaleString()}`, icon: Wallet, color: ORANGE },
    { label: "Risk Alerts", value: risks.length, icon: AlertTriangle, color: "#DC2626" },
    { label: "Pending Tasks", value: pendingTasks.length, icon: ListChecks, color: AMBER },
  ];

  return (
    <Layout title="Dashboard">
      <div
        className="rounded-2xl p-6 mb-6 text-white flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DEEP})` }}
      >
        <div>
          <p className="text-sm text-slate-300">Welcome back,</p>
          <h2 className="text-2xl font-bold">{user?.name || "Manager"} 👋</h2>
          <p className="text-sm text-slate-300 mt-1">
            Here's what's happening with your team today.
          </p>
        </div>
        <Sparkles size={40} style={{ color: AMBER }} className="hidden sm:block" />
      </div>

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
            {risks.length === 0 ? (
              <p className="text-sm text-slate-400">No risks flagged right now 🎉</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {risks.slice(0, 4).map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center gap-2"
                    style={{ color: r.severity === "high" ? "#DC2626" : ORANGE }}
                  >
                    <AlertTriangle size={16} /> {r.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold mb-4" style={{ color: NAVY }}>
              Pending Tasks
            </h2>
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-slate-400">No pending tasks 🎉</p>
            ) : (
              <ul className="space-y-3 text-sm text-slate-600">
                {pendingTasks.slice(0, 4).map((t) => (
                  <li key={t.id}>• {t.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold mb-4" style={{ color: NAVY }}>
            Team Snapshot
          </h2>
          {employees.length === 0 ? (
            <p className="text-sm text-slate-400">No employees added yet.</p>
          ) : (
            <div className="space-y-4">
              {employees.map((e) => {
                const assignedCount = tasks.filter((t) => t.assigned_to === e.id).length;
                const workload = Math.min(assignedCount * 25, 100);
                return (
                  <div key={e.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold"
                        style={{ background: ORANGE }}
                      >
                        {e.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: NAVY }}>
                          {e.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{assignedCount} task(s) assigned</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${workload}%`, background: workload > 80 ? "#DC2626" : TEAL }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ChatWidget />
    </Layout>
  );
}
