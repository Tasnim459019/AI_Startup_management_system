import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { NAVY, ORANGE } from "../theme";
import { Plus, X } from "lucide-react";
import { authHeaders } from "../utils/auth";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [submitError, setSubmitError] = useState("");

  function loadEmployees() {
    fetch("http://localhost:5000/api/employees", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load employees. Is the backend server running?");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function handleAddEmployee(e) {
    e.preventDefault();
    setSubmitError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setSubmitError("Name, email, and password are all required.");
      return;
    }

    fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name, email, password, skills }),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status !== 201) {
          setSubmitError(data.message || "Could not add employee.");
          return;
        }
        setName("");
        setEmail("");
        setPassword("");
        setSkills("");
        setShowModal(false);
        loadEmployees();
      })
      .catch(() => setSubmitError("Could not reach the server."));
  }

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

  return (
    <Layout title="Employee Management">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: ORANGE }}
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <p className="text-slate-500">No employees yet. Add one to get started.</p>
      ) : (
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
                Skills: <span className="text-slate-700">{e.skills || "Not specified"}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold" style={{ color: NAVY }}>
                Add Employee
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {submitError && <p className="text-red-500 text-xs mb-3">{submitError}</p>}

            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  placeholder="e.g. Sharaban Tahura"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  placeholder="employee@startup.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Temporary Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  placeholder="They can change this later"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Skills</label>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  placeholder="e.g. Figma, React, CSS"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Comma-separated. Used by the AI to suggest task assignments.
                </p>
              </div>
              <button
                type="submit"
                className="w-full text-white text-sm font-medium py-2.5 rounded-lg mt-2"
                style={{ background: ORANGE }}
              >
                Add Employee
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
