import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { NAVY, ORANGE } from "../theme";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load employees. Is the backend server running?");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout title="Employee Management">
        <p className="text-slate-500">Loading employees...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Employee Management">
        <p className="text-red-500">{error}</p>
      </Layout>
    );
  }

  if (employees.length === 0) {
    return (
      <Layout title="Employee Management">
        <p className="text-slate-500">No employees yet. Employees appear here once they sign up.</p>
      </Layout>
    );
  }

  return (
    <Layout title="Employee Management">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold"
                style={{ background: ORANGE }}
              >
                {e.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold" style={{ color: NAVY }}>
                  {e.name}
                </p>
                <p className="text-xs text-slate-500">{e.email}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-1">Workload</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
              <div className="h-2 rounded-full" style={{ width: "0%", background: ORANGE }} />
            </div>
            <p className="text-xs text-slate-500">
              Skills: <span className="text-slate-700">Coming soon</span>
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}