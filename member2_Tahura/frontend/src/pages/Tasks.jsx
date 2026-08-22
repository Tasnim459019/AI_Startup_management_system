import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { NAVY, ORANGE } from "../theme";
import { Plus, X, Sparkles, Trash2 } from "lucide-react";
import { authHeaders } from "../utils/auth";

const statusOptions = ["pending", "in progress", "completed"];

const statusStyle = {
  Done: { background: "#DCFCE7", color: "#15803D" },
  "In Progress": { background: "#FFF3D6", color: "#B45309" },
  Pending: { background: "#F1F5F9", color: "#475569" },
};

const statusLabelMap = {
  pending: "Pending",
  "in progress": "In Progress",
  completed: "Done",
};

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  function loadTasks() {
    fetch("http://localhost:5000/api/tasks", { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          return [];
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load tasks. Is the backend server running?");
        setLoading(false);
      });
  }

  function loadEmployees() {
    fetch("http://localhost:5000/api/employees", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch(() => {});
  }

  useEffect(() => {
    loadTasks();
    loadEmployees();
  }, []);

  function handleAskAI() {
    if (!title.trim()) {
      setSubmitError("Enter a task title first so the AI has something to analyze.");
      return;
    }
    setSubmitError("");
    setAiLoading(true);
    setAiSuggestion(null);

    fetch("http://localhost:5000/api/ai/suggest-assignee", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAiSuggestion(data);
        setAiLoading(false);
      })
      .catch(() => {
        setAiLoading(false);
        setSubmitError("AI suggestion failed. You can still assign manually.");
      });
  }

  function acceptSuggestion() {
    if (aiSuggestion?.employeeId) {
      setAssignedTo(String(aiSuggestion.employeeId));
    }
  }

  function handleCreateTask(e) {
    e.preventDefault();
    setSubmitError("");

    if (!title.trim()) {
      setSubmitError("Task title is required.");
      return;
    }

    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        title,
        description,
        due_date: dueDate || null,
        assigned_to: assignedTo || null,
        status: "pending",
      }),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status !== 201) {
          setSubmitError(data.message || "Could not create task.");
          return;
        }
        setTitle("");
        setDescription("");
        setDueDate("");
        setAssignedTo("");
        setAiSuggestion(null);
        setShowModal(false);
        loadTasks();
      })
      .catch(() => setSubmitError("Could not reach the server."));
  }

  function handleStatusChange(task, newStatus) {
    fetch(`http://localhost:5000/api/tasks/${task.id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: newStatus,
        assigned_to: task.assigned_to,
        due_date: task.due_date,
      }),
    })
      .then((res) => {
        if (res.status !== 200) throw new Error();
        loadTasks();
      })
      .catch(() => setError("Could not update task status."));
  }

  function handleDeleteTask(taskId) {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;

    fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
      .then((res) => {
        if (res.status !== 200) throw new Error();
        loadTasks();
      })
      .catch(() => setError("Could not delete task."));
  }

  if (loading) {
    return (
      <Layout title="Smart Task Management">
        <p className="text-slate-500">Loading tasks...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Smart Task Management">
        <p className="text-red-500">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout title="Smart Task Management">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: ORANGE }}
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: "#FFF7EA" }} className="text-slate-500 text-left">
            <tr>
              <th className="p-4">Task</th>
              <th className="p-4">Assignee</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              const displayStatus = statusLabelMap[t.status] || "Pending";
              const assignee = employees.find((e) => e.id === t.assigned_to);
              return (
                <tr key={t.id} className="border-t border-slate-100 align-top">
                  <td className="p-4">
                    <p className="font-medium" style={{ color: NAVY }}>
                      {t.title}
                    </p>
                    {t.description && (
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">{t.description}</p>
                    )}
                  </td>
                  <td className="p-4 text-slate-600">
                    {assignee ? assignee.name : "Unassigned"}
                  </td>
                  <td className="p-4 text-slate-600 text-xs">
                    {t.due_date ? new Date(t.due_date).toLocaleDateString() : "No due date"}
                  </td>
                  <td className="p-4">
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t, e.target.value)}
                      className="px-2 py-1 rounded-full text-xs font-medium border-0 outline-none cursor-pointer"
                      style={statusStyle[displayStatus]}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {statusLabelMap[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="text-slate-400 hover:text-red-500 transition"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold" style={{ color: NAVY }}>
                Create New Task
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {submitError && <p className="text-red-500 text-xs mb-3">{submitError}</p>}

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  placeholder="e.g. Write API documentation"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                />
              </div>

              <button
                type="button"
                onClick={handleAskAI}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg border disabled:opacity-60"
                style={{ borderColor: ORANGE, color: ORANGE }}
              >
                <Sparkles size={14} />
                {aiLoading ? "Thinking..." : "Ask AI who to assign this to"}
              </button>

              {aiSuggestion && (
                <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="font-medium mb-1" style={{ color: NAVY }}>
                    AI Suggestion:{" "}
                    {employees.find((e) => e.id === aiSuggestion.employeeId)?.name || "No clear match"}
                  </p>
                  <p className="text-slate-600 mb-2">{aiSuggestion.reason}</p>
                  {aiSuggestion.employeeId && (
                    <button
                      type="button"
                      onClick={acceptSuggestion}
                      className="text-white text-xs font-medium px-3 py-1.5 rounded-md"
                      style={{ background: ORANGE }}
                    >
                      Accept Suggestion
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Assign To</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full text-white text-sm font-medium py-2.5 rounded-lg mt-2"
                style={{ background: ORANGE }}
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
