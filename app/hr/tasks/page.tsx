"use client";

import { useEffect, useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Pie Chart ──────────────────────────────────────────────────────────────────
function PieChart({
  notStarted,
  inProgress,
  complete,
}: {
  notStarted: number;
  inProgress: number;
  complete: number;
}) {
  const total = notStarted + inProgress + complete;
  const TNR = '"Times New Roman", Times, serif';

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle cx="60" cy="60" r="48" fill="none" stroke="#e5e7eb" strokeWidth="24" />
        </svg>
        <p className="text-xs text-gray-400 italic">No tasks yet</p>
      </div>
    );
  }

  const slices = [
    { value: notStarted, color: "#ef4444", label: "Not Started" },
    { value: inProgress, color: "#3b82f6", label: "In Progress" },
    { value: complete, color: "#22c55e", label: "Complete" },
  ];

  const r = 48;
  const cx = 60;
  const cy = 60;
  let cumulative = 0;

  const paths = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
      cumulative += s.value;
      const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = s.value / total > 0.5 ? 1 : 0;
      return (
        <path
          key={s.label}
          d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
          fill={s.color}
          stroke="white"
          strokeWidth="2"
        />
      );
    });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 120 120" width="140" height="140">
        {paths}
        <circle cx="60" cy="60" r="26" fill="white" />
        <text x="60" y="56" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111" fontFamily={TNR}>
          {total}
        </text>
        <text x="60" y="69" textAnchor="middle" fontSize="8" fill="#9ca3af" fontFamily={TNR}>
          Total
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 w-full">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: s.color }} />
              <span className="text-gray-600" style={{ fontFamily: TNR }}>{s.label}</span>
            </div>
            <span className="font-semibold text-gray-800" style={{ fontFamily: TNR }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Badge helpers ──────────────────────────────────────────────────────────────
function statusBadge(status: string) {
  if (status === "Complete") return "border-green-400 bg-green-50 text-green-700";
  if (status === "In Progress") return "border-blue-400 bg-blue-50 text-blue-700";
  return "border-red-400 bg-red-50 text-red-700";
}

function importanceBadge(imp: string) {
  if (imp === "High") return "border-red-400 bg-red-50 text-red-700";
  if (imp === "Medium") return "border-yellow-400 bg-yellow-50 text-yellow-700";
  return "border-gray-300 bg-gray-50 text-gray-600";
}

function progressBarColor(pct: number) {
  if (pct >= 100) return "bg-green-500";
  if (pct >= 60) return "bg-blue-500";
  if (pct >= 30) return "bg-yellow-400";
  return "bg-red-400";
}

// ── Constants ──────────────────────────────────────────────────────────────────
const TNR = '"Times New Roman", Times, serif';

const emptyForm = {
  taskTitle: "",
  description: "",
  assignTo: "",
  importance: "Low",
  deadline: "",
  status: "Not Started",
  subTasks: [{ title: "", completed: false }],
};

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TaskPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch("/api/task");
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks.filter((t: any) => t.branchName === user.branchName));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSubTask = () =>
    setFormData({ ...formData, subTasks: [...formData.subTasks, { title: "", completed: false }] });

  const handleSubTaskChange = (index: number, field: string, value: any) => {
    const updated = [...formData.subTasks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, subTasks: updated });
  };

  const removeSubTask = (index: number) =>
    setFormData({ ...formData, subTasks: formData.subTasks.filter((_: any, i: number) => i !== index) });

  const handleEdit = (task: any) => {
    setEditId(task._id);
    setFormData({
      taskTitle: task.taskTitle,
      description: task.description,
      assignTo: task.assignTo,
      importance: task.importance,
      deadline: task.deadline?.split("T")[0],
      status: task.status,
      subTasks: task.subTasks?.length > 0 ? task.subTasks : [{ title: "", completed: false }],
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const res = await fetch(`/api/task/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message);
    fetchTasks();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(editId ? `/api/task/${editId}` : "/api/task", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, branchName: user.branchName, createdBy: user.email }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setOpen(false);
        setEditId("");
        setFormData(emptyForm);
        fetchTasks();
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const total = tasks.length;
  const notStarted = tasks.filter((t) => t.status === "Not Started").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const complete = tasks.filter((t) => t.status === "Complete").length;
  const highImp = tasks.filter((t) => t.importance === "High").length;

  return (
    <div className="min-h-screen bg-transparent p-8" style={{ fontFamily: TNR }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Task Management</h1>
          <p className="text-sm text-gray-400 mt-1">{total} total tasks</p>
        </div>
        <button
          onClick={() => { setOpen(true); setEditId(""); setFormData(emptyForm); }}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          style={{ fontFamily: TNR }}
        >
          <PlusIcon /> Add Task
        </button>
      </div>

      {/* ── Stats + Pie ── */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="col-span-3 grid grid-cols-4 gap-4">
          {[
            { label: "Total Tasks", value: total, color: "border-gray-200 bg-white text-gray-900" },
            { label: "Not Started", value: notStarted, color: "border-red-200 bg-red-50 text-red-800" },
            { label: "In Progress", value: inProgress, color: "border-blue-200 bg-blue-50 text-blue-800" },
            { label: "Complete", value: complete, color: "border-green-200 bg-green-50 text-green-800" },
          ].map((c) => (
            <div key={c.label} className={`rounded-2xl border ${c.color} p-5`}>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-1">{c.label}</p>
              <p className="text-4xl font-bold">{c.value}</p>
            </div>
          ))}
          <div className="col-span-4 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 opacity-80 mb-0.5">High Priority Tasks</p>
              <p className="text-3xl font-bold text-orange-800">{highImp}</p>
            </div>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Status Overview</p>
          <PieChart notStarted={notStarted} inProgress={inProgress} complete={complete} />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm" style={{ fontFamily: TNR }}>
          <thead>
            <tr className="bg-gray-900 text-white">
              {["Task & Subtasks", "Assigned To", "Importance", "Deadline", "Status", "Progress", "Actions"].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400 italic text-base">
                  No tasks found. Add your first task.
                </td>
              </tr>
            ) : (
              tasks.map((task, i) => {
                const pct = Math.min(100, Math.max(0, task.progress ?? 0));
                const completedSubs = task.subTasks?.filter((s: any) => s.completed).length ?? 0;
                const totalSubs = task.subTasks?.length ?? 0;

                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors align-top">

                    {/* ── Task Title + Subtasks + Progress ── */}
                    <td className="px-5 py-4 max-w-xs">
                      {/* Title */}
                      <p className="font-semibold text-gray-900 text-sm leading-snug">{task.taskTitle}</p>

                      {/* Progress bar */}
                      <div className="mt-2 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Progress</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              pct >= 100
                                ? "bg-green-100 text-green-700"
                                : pct >= 60
                                ? "bg-blue-100 text-blue-700"
                                : pct >= 30
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${progressBarColor(pct)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Subtasks */}
                      {totalSubs > 0 && (
                        <div className="border border-gray-100 rounded-xl bg-gray-50 px-3 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                            Subtasks · {completedSubs}/{totalSubs}
                          </p>
                          <div className="flex flex-col gap-1">
                            {task.subTasks.map((sub: any, si: number) => (
                              <div key={si} className="flex items-center gap-2">
                                <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                  sub.completed
                                    ? "bg-green-500 border-green-500"
                                    : "bg-white border-gray-300"
                                }`}>
                                  {sub.completed && (
                                    <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </span>
                                <span className={`text-xs leading-tight ${
                                  sub.completed ? "line-through text-gray-400" : "text-gray-600"
                                }`}>
                                  {sub.title || <span className="italic text-gray-300">Untitled</span>}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-500 text-xs align-top pt-5">{task.assignTo}</td>
                    <td className="px-5 py-4 align-top pt-5">
                      <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${importanceBadge(task.importance)}`}>
                        {task.importance}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs align-top pt-5 whitespace-nowrap">
                      {new Date(task.deadline).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 align-top pt-5">
                      <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </td>

                    {/* Progress column (standalone) */}
                    <td className="px-5 py-4 align-top pt-5 w-28">
                      <div className="flex flex-col gap-1">
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${progressBarColor(pct)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${
                          pct >= 100 ? "text-green-600"
                          : pct >= 60 ? "text-blue-600"
                          : pct >= 30 ? "text-yellow-600"
                          : "text-red-500"
                        }`}>
                          {pct}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top pt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          title="Edit"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-blue-600 transition-all"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          title="Delete"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-red-600 transition-all"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ fontFamily: TNR, maxHeight: "90vh" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{editId ? "Edit Task" : "Create Task"}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editId ? "Update the task details below" : "Fill in the details to create a new task"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Scrollable form body */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

                {/* ── Section: Basic Info ── */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Basic Info</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text" name="taskTitle" placeholder="Task Title" required
                      value={formData.taskTitle} onChange={handleChange}
                      className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm col-span-2"
                      style={{ fontFamily: TNR }}
                    />
                    <input
                      type="email" name="assignTo" placeholder="Assign To (Email)"
                      value={formData.assignTo} onChange={handleChange}
                      className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm col-span-2"
                      style={{ fontFamily: TNR }}
                    />
                    <textarea
                      name="description" placeholder="Task description…"
                      value={formData.description} onChange={handleChange}
                      rows={3}
                      className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm col-span-2 resize-none"
                      style={{ fontFamily: TNR }}
                    />
                  </div>
                </div>

                {/* ── Section: Priority & Schedule ── */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Priority & Schedule</p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Importance */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 pl-1">Importance</label>
                      <select
                        name="importance" value={formData.importance} onChange={handleChange}
                        className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm"
                        style={{
                          fontFamily: TNR,
                          color:
                            formData.importance === "High" ? "#b91c1c"
                            : formData.importance === "Medium" ? "#92400e"
                            : "#374151",
                        }}
                      >
                        <option value="Low">🟢 Low</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="High">🔴 High</option>
                      </select>
                    </div>

                    {/* Deadline */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 pl-1">Deadline</label>
                      <input
                        type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                        className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm text-gray-900"
                        style={{ fontFamily: TNR }}
                      />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 pl-1">Status</label>
                      <select
                        name="status" value={formData.status} onChange={handleChange}
                        className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm"
                        style={{
                          fontFamily: TNR,
                          color:
                            formData.status === "Complete" ? "#15803d"
                            : formData.status === "In Progress" ? "#1d4ed8"
                            : "#dc2626",
                        }}
                      >
                        <option value="Not Started">🔴 Not Started</option>
                        <option value="In Progress">🔵 In Progress</option>
                        <option value="Complete">🟢 Complete</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Section: Subtasks ── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Subtasks
                      <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] normal-case tracking-normal">
                        {formData.subTasks.length}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={addSubTask}
                      className="flex items-center gap-1.5 text-xs bg-gray-900 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-all"
                      style={{ fontFamily: TNR }}
                    >
                      <PlusIcon /> Add Subtask
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {formData.subTasks.map((sub: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                      >
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleSubTaskChange(index, "completed", !sub.completed)}
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                            sub.completed
                              ? "bg-green-500 border-green-500"
                              : "bg-white border-gray-300 hover:border-green-400"
                          }`}
                        >
                          {sub.completed && (
                            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>

                        {/* Input */}
                        <input
                          type="text"
                          placeholder={`Subtask ${index + 1}`}
                          value={sub.title}
                          onChange={(e) => handleSubTaskChange(index, "title", e.target.value)}
                          className={`flex-1 bg-transparent outline-none text-sm placeholder-gray-400 transition-all ${
                            sub.completed ? "line-through text-gray-400" : "text-gray-800"
                          }`}
                          style={{ fontFamily: TNR }}
                        />

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeSubTask(index)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all flex-shrink-0"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit" disabled={loading}
                  className="bg-black hover:bg-gray-800 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-1"
                  style={{ fontFamily: TNR }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      {editId ? "Updating…" : "Creating…"}
                    </>
                  ) : editId ? "Update Task" : "Create Task"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}