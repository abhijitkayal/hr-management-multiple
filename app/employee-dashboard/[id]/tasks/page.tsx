"use client";

import { useEffect, useState } from "react";

interface Task {
  _id: string;
  taskTitle: string;
  description: string;
  assignTo: string;
  importance: string;
  deadline: string;
  status: string;
  branchName: string;
}

const tnr = { fontFamily: "'Times New Roman', Times, serif" } as React.CSSProperties;

function ImportanceBadge({ importance }: { importance: string }) {
  const map: Record<string, string> = {
    High: "border-red-400 bg-red-50 text-red-600",
    Medium: "border-yellow-400 bg-yellow-50 text-yellow-600",
    Low: "border-green-400 bg-green-50 text-green-600",
  };
  const cls = map[importance] ?? "border-gray-300 bg-gray-50 text-gray-600";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cls}`}
      style={tnr}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          importance === "High"
            ? "bg-red-500"
            : importance === "Medium"
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
      />
      {importance}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "border-emerald-400 bg-emerald-50 text-emerald-600",
    "In Progress": "border-blue-400 bg-blue-50 text-blue-600",
    Pending: "border-orange-400 bg-orange-50 text-orange-600",
    Cancelled: "border-gray-400 bg-gray-50 text-gray-500",
  };
  const cls = map[status] ?? "border-gray-300 bg-gray-50 text-gray-600";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cls}`}
      style={tnr}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Completed"
            ? "bg-emerald-500"
            : status === "In Progress"
            ? "bg-blue-500"
            : status === "Pending"
            ? "bg-orange-500"
            : "bg-gray-400"
        }`}
      />
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isOverdue(deadline: string, status: string) {
  if (!deadline || status === "Completed" || status === "Cancelled") return false;
  return new Date(deadline) < new Date();
}

// Icons
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const BranchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"/>
    <circle cx="18" cy="6" r="3"/>
    <circle cx="6" cy="18" r="3"/>
    <path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
);

export default function EmployeeTasksPage({
  params,
}: {
  params: { id: string };
}) {
  const employeeId = params.id;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch("/api/task");
      const data = await response.json();
      const filteredTasks = data.tasks.filter(
        (task: Task) =>
          task.assignTo === user.email && task.branchName === user.branchName
      );
      setTasks(filteredTasks);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Stats
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;

  if (loading) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        style={tnr}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-base">Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6" style={tnr}>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black tracking-tight" style={tnr}>
          My Tasks
        </h1>
        <p className="text-gray-400 mt-1 text-sm" style={tnr}>
          Employee ID: <span className="text-gray-600 font-semibold">{employeeId}</span>
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1" style={tnr}>Total</p>
          <p className="text-4xl font-bold text-black" style={tnr}>{tasks.length}</p>
        </div>
        <div className="border border-emerald-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-emerald-500 font-semibold mb-1" style={tnr}>Completed</p>
          <p className="text-4xl font-bold text-emerald-600" style={tnr}>{completed}</p>
        </div>
        <div className="border border-blue-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-1" style={tnr}>In Progress</p>
          <p className="text-4xl font-bold text-blue-600" style={tnr}>{inProgress}</p>
        </div>
        <div className="border border-orange-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-1" style={tnr}>Pending</p>
          <p className="text-4xl font-bold text-orange-500" style={tnr}>{pending}</p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-200 rounded-2xl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mb-4">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
          <p className="text-gray-400 text-lg font-semibold" style={tnr}>No tasks assigned yet</p>
          <p className="text-gray-300 text-sm mt-1" style={tnr}>Check back later for new assignments</p>
        </div>
      ) : (

        /* TASK CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tasks.map((task) => {
            const overdue = isOverdue(task.deadline, task.status);
            return (
              <div
                key={task._id}
                className={`bg-white rounded-2xl border shadow-sm flex flex-col gap-4 p-5 hover:shadow-md transition-shadow ${
                  overdue ? "border-red-200" : "border-gray-100"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <h2
                    className="text-lg font-bold text-black leading-snug flex-1"
                    style={tnr}
                  >
                    {task.taskTitle}
                  </h2>
                  {overdue && (
                    <span
                      className="shrink-0 text-xs font-bold text-red-500 border border-red-300 bg-red-50 px-2 py-0.5 rounded-full"
                      style={tnr}
                    >
                      Overdue
                    </span>
                  )}
                </div>

                {/* Description */}
                {task.description && (
                  <p
                    className="text-gray-500 text-sm leading-relaxed line-clamp-3"
                    style={tnr}
                  >
                    {task.description}
                  </p>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Badges Row */}
                <div className="flex flex-wrap gap-2">
                  <ImportanceBadge importance={task.importance} />
                  <StatusBadge status={task.status} />
                </div>

                {/* Meta Info */}
                <div className="flex flex-col gap-2">
                  {/* Deadline */}
                  <div className="flex items-center gap-2">
                    <span className={overdue ? "text-red-400" : "text-gray-400"}>
                      <CalendarIcon />
                    </span>
                    <span
                      className={`text-sm font-medium ${overdue ? "text-red-500" : "text-gray-600"}`}
                      style={tnr}
                    >
                      {formatDate(task.deadline)}
                    </span>
                  </div>

                  {/* Branch */}
                  {/* <div className="flex items-center gap-2 text-gray-400">
                    <BranchIcon />
                    <span className="text-sm text-gray-500" style={tnr}>
                      {task.branchName}
                    </span>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}