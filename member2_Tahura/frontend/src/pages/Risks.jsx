import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { AlertTriangle, AlertCircle, Info, ScanSearch } from "lucide-react";
import { NAVY, ORANGE } from "../theme";
import { authHeaders } from "../utils/auth";

const severityStyle = {
  high: { icon: AlertTriangle, color: "#DC2626", bg: "#FEF2F2" },
  medium: { icon: AlertCircle, color: "#B45309", bg: "#FFF7EA" },
  low: { icon: Info, color: "#0369A1", bg: "#EFF6FF" },
};

export default function Risks() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  function loadRisks() {
    fetch("http://localhost:5000/api/risks", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setRisks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load risks. Is the backend server running?");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadRisks();
  }, []);

  function handleScan() {
    setScanning(true);
    setScanMessage("");

    fetch("http://localhost:5000/api/ai/scan-risks", {
      method: "POST",
      headers: authHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        setScanMessage(data.message || "Scan complete.");
        setScanning(false);
        if (data.risksCreated > 0) {
          loadRisks();
        }
      })
      .catch(() => {
        setScanMessage("Scan failed. Please try again.");
        setScanning(false);
      });
  }

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

  return (
    <Layout title="Risk Detection & Notifications">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={handleScan}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
          style={{ background: ORANGE }}
        >
          <ScanSearch size={16} />
          {scanning ? "Scanning..." : "Scan for Risks"}
        </button>
        {scanMessage && <p className="text-xs text-slate-500">{scanMessage}</p>}
      </div>

      {risks.length === 0 ? (
        <p className="text-slate-500">No risks flagged right now. 🎉</p>
      ) : (
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
      )}
    </Layout>
  );
}
