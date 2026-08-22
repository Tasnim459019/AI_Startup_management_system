import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, X } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { NAVY, ORANGE, TEAL } from "../theme";
import { authHeaders } from "../utils/auth";

export default function Budget() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [note, setNote] = useState("");
  const [submitError, setSubmitError] = useState("");

  function loadBudget() {
    fetch("http://localhost:5000/api/budget", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load budget data. Is the backend server running?");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadBudget();
  }, []);

  function handleCreateEntry(e) {
    e.preventDefault();
    setSubmitError("");

    if (!category.trim() || !amount) {
      setSubmitError("Category and amount are required.");
      return;
    }

    fetch("http://localhost:5000/api/budget", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ category, amount: Number(amount), type, note }),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status !== 201) {
          setSubmitError(data.message || "Could not create entry.");
          return;
        }
        setCategory("");
        setAmount("");
        setType("expense");
        setNote("");
        setShowModal(false);
        loadBudget();
      })
      .catch(() => setSubmitError("Could not reach the server."));
  }

  if (loading) {
    return (
      <Layout title="Budget Monitoring">
        <p className="text-slate-500">Loading budget data...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Budget Monitoring">
        <p className="text-red-500">{error}</p>
      </Layout>
    );
  }

  const incomeEntries = entries.filter((e) => e.type === "income");
  const expenseEntries = entries.filter((e) => e.type === "expense");

  const totalIncome = incomeEntries.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSpent = expenseEntries.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = totalIncome - totalSpent;

  const categoryMap = {};
  expenseEntries.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
  });
  const categoryTotals = Object.keys(categoryMap).map((name) => ({
    name,
    value: categoryMap[name],
  }));

  const monthMap = {};
  expenseEntries.forEach((e) => {
    const monthLabel = new Date(e.created_at).toLocaleString("default", { month: "short" });
    monthMap[monthLabel] = (monthMap[monthLabel] || 0) + Number(e.amount);
  });
  const monthlySpend = Object.keys(monthMap).map((month) => ({
    month,
    spend: monthMap[month],
  }));

  return (
    <Layout title="Budget Monitoring">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: ORANGE }}
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">Total Income</p>
          <p className="text-2xl font-bold" style={{ color: NAVY }}>
            ${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">Spent So Far</p>
          <p className="text-2xl font-bold text-red-600">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">Remaining</p>
          <p className="text-2xl font-bold" style={{ color: TEAL }}>
            ${remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold mb-4" style={{ color: NAVY }}>
            Monthly Spending Trend
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="spend" stroke={ORANGE} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold mb-4" style={{ color: NAVY }}>
            Spending by Category
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={TEAL} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="font-semibold mb-4" style={{ color: NAVY }}>
          Expense Breakdown
        </h2>
        <ul className="space-y-3">
          {categoryTotals.map((c) => (
            <li key={c.name} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{c.name}</span>
              <span className="font-medium" style={{ color: NAVY }}>
                ${c.value.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="border rounded-xl p-5 text-sm"
        style={{ background: "#FFF7EA", borderColor: "#FDE7C2", color: "#92400E" }}
      >
        💡 AI Suggestion: Coming soon (AI Agent)
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold" style={{ color: NAVY }}>
                Add Budget Entry
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {submitError && <p className="text-red-500 text-xs mb-3">{submitError}</p>}

            <form onSubmit={handleCreateEntry} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  placeholder="e.g. Marketing"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Amount ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Note (optional)</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white text-sm font-medium py-2.5 rounded-lg mt-2"
                style={{ background: ORANGE }}
              >
                Add Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
