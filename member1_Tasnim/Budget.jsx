import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { TrendingDown, TrendingUp } from "lucide-react";
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

export default function Budget() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/budget")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load budget data. Is the backend server running?");
        setLoading(false);
      });
  }, []);

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

  // Separate income vs expense entries
  const incomeEntries = entries.filter((e) => e.type === "income");
  const expenseEntries = entries.filter((e) => e.type === "expense");

  // Add up all income and all expenses
  const totalIncome = incomeEntries.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSpent = expenseEntries.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = totalIncome - totalSpent;

  // Group expenses by category (for the bar chart + breakdown list)
  const categoryMap = {};
  expenseEntries.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
  });
  const categoryTotals = Object.keys(categoryMap).map((name) => ({
    name,
    value: categoryMap[name],
  }));

  // Group expenses by month (for the line chart)
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
    </Layout>
  );
}