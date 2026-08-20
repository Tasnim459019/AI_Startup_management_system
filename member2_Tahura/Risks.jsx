import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { NAVY } from "../theme";

// Maps each severity level to an icon + color style
const severityStyle = {
  high: { icon: AlertTriangle, color: "#DC2626", bg: "#FEF2F2" },
  medium: { icon: AlertCircle, color: "#B45309", bg: "#FFF7EA" },
  low: { icon: Info, color: "#0369A1", bg: "#EFF6FF" },
};

export default function Risks() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/risks")
      .then((res) => res.json())
      .then((data) => {
        setRisks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load risks. Is the backend server running?");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout title="Risk Detection & Notifications">
        <p className="text-slate-500">Loading risks...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Risk Detection & Notifications">
        <p className="text-red-500">{error}</p>
      </Layout>
    );
  }

  if (risks.length === 0) {
    return (
      <Layout title="Risk Detection & Notifications">
        <p className="text-slate-500">No risks flagged right now. 🎉</p>
      </Layout>
    );
  }

  return (
    <Layout title="Risk Detection & Notifications">
      <div className="space-y-4">
        {risks.map((r) => {
          const style = severityStyle[r.severity] || severityStyle.medium;
          const Icon = style.icon;
          return (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: style.bg, color: style.color }}
              >
                <Icon size={18} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: NAVY }}>
                  {r.title}
                </p>
                <p className="text-sm text-slate-500">{r.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}