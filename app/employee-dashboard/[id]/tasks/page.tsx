"use client";

import { useEffect, useState, use } from "react";

interface SubTask {
  _id: string;
  title: string;
  completed: boolean;
}

interface Task {
  _id: string;
  taskTitle: string;
  description: string;
  assignTo: string;
  importance: string;
  deadline: string;
  status: string;
  branchName: string;
  progress: number;
  subTasks: SubTask[];
}

const tnr = { fontFamily: "'Times New Roman', Times, serif" } as React.CSSProperties;

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isOverdue(deadline: string, status: string) {
  if (!deadline || status === "Complete" || status === "Cancelled") return false;
  return new Date(deadline) < new Date();
}

function progressColor(pct: number) {
  if (pct >= 100) return { bar: "bg-emerald-500", text: "text-emerald-600", ring: "bg-emerald-100" };
  if (pct >= 60)  return { bar: "bg-blue-500",    text: "text-blue-600",    ring: "bg-blue-100"    };
  if (pct >= 30)  return { bar: "bg-amber-400",   text: "text-amber-600",   ring: "bg-amber-100"   };
  return               { bar: "bg-red-400",     text: "text-red-600",     ring: "bg-red-100"     };
}

// ── Badges ─────────────────────────────────────────────────────────────────────
function ImportanceBadge({ importance }: { importance: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    High:   { cls: "border-red-300 bg-red-50 text-red-700",       dot: "bg-red-500"    },
    Medium: { cls: "border-amber-300 bg-amber-50 text-amber-700", dot: "bg-amber-400"  },
    Low:    { cls: "border-green-300 bg-green-50 text-green-700", dot: "bg-green-500"  },
  };
  const { cls, dot } = map[importance] ?? { cls: "border-gray-200 bg-gray-50 text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`} style={tnr}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {importance}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    Complete:    { cls: "border-emerald-300 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    "In Progress": { cls: "border-blue-300 bg-blue-50 text-blue-700",         dot: "bg-blue-500"    },
    Pending:     { cls: "border-orange-300 bg-orange-50 text-orange-700",    dot: "bg-orange-400"  },
    Cancelled:   { cls: "border-gray-300 bg-gray-50 text-gray-500",          dot: "bg-gray-400"    },
  };
  const { cls, dot } = map[status] ?? { cls: "border-gray-200 bg-gray-50 text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`} style={tnr}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />
      {status}
    </span>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

// ── Progress Ring (for card header) ───────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const { text } = progressColor(pct);
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={pct >= 100 ? "#10b981" : pct >= 60 ? "#3b82f6" : pct >= 30 ? "#f59e0b" : "#f87171"}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[10px] font-bold leading-none ${text}`} style={tnr}>{pct}%</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function EmployeeTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: employeeId } = use(params);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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

 async function toggleSubTask(
  taskId: string,
  subTaskId: string
) {

  try {

    const task =
      tasks.find(
        (t) =>
          t._id === taskId
      );

    if (!task) return;

    // TOGGLE
    const updatedSubTasks =
      task.subTasks.map(
        (sub) =>

          sub._id ===
          subTaskId

            ? {
                ...sub,

                completed:
                  !sub.completed,
              }

            : sub
      );

    // PROGRESS
    const completedCount =
      updatedSubTasks.filter(
        (s) =>
          s.completed
      ).length;

    const progress =
      Math.round(
        (
          completedCount /
          updatedSubTasks.length
        ) * 100
      );

    // STATUS
    const status =
      progress === 100
        ? "Complete"
        : progress > 0
        ? "In Progress"
        : "Pending";

    const updatedTask = {
      ...task,

      subTasks:
        updatedSubTasks,

      progress,

      status,
    };

    // UPDATE UI
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId
          ? updatedTask
          : t
      )
    );

    // UPDATE DATABASE
    await fetch(
      `/api/task/${taskId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          subTasks:
            updatedSubTasks,

          progress,

          status,
        }),
      }
    );
    console.log("progress:", progress, "status:", status);

  } catch (error) {

    console.log(error);
  }
}
  useEffect(() => { void fetchTasks(); }, []);

  const completed  = tasks.filter((t) => t.status === "Complete").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending    = tasks.filter((t) => t.status === "Pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={tnr}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading your tasks…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 py-8" style={tnr}>

      {/* ── Header ── */}
      <div className="mb-8 flex items-end justify-between border-b border-gray-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1" style={tnr}>
            Employee · {employeeId}
          </p>
          <h1 className="text-4xl font-bold text-black" style={tnr}>My Tasks</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400" style={tnr}>Total assigned</p>
          <p className="text-3xl font-bold text-black" style={tnr}>{tasks.length}</p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Completed",   value: completed,  border: "border-emerald-200", bg: "bg-emerald-50",  num: "text-emerald-700", dot: "bg-emerald-400" },
          { label: "In Progress", value: inProgress, border: "border-blue-200",    bg: "bg-blue-50",     num: "text-blue-700",    dot: "bg-blue-400"    },
          { label: "Pending",     value: pending,    border: "border-orange-200",  bg: "bg-orange-50",   num: "text-orange-700",  dot: "bg-orange-400"  },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl border ${c.border} ${c.bg} px-6 py-5 flex items-center justify-between`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500" style={tnr}>{c.label}</p>
              </div>
              <p className={`text-4xl font-bold ${c.num}`} style={tnr}>{c.value}</p>
            </div>
            {/* mini bar */}
            <div className="w-1.5 h-16 rounded-full bg-white/70 overflow-hidden flex flex-col-reverse">
              <div
                className={`rounded-full ${c.dot}`}
                style={{ height: tasks.length ? `${Math.round((c.value / tasks.length) * 100)}%` : "0%", transition: "height 0.6s ease" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty State ── */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 border border-dashed border-gray-200 rounded-2xl">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2" className="mb-5">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
          <p className="text-gray-400 text-lg font-semibold" style={tnr}>No tasks assigned yet</p>
          <p className="text-gray-300 text-sm mt-1" style={tnr}>Check back later for new assignments</p>
        </div>
      ) : (

        /* ── Task Cards ── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tasks.map((task) => {
            const overdue   = isOverdue(task.deadline, task.status);
            const pct       = task.progress ?? 0;
            const pc        = progressColor(pct);
            const doneCount = task.subTasks?.filter((s) => s.completed).length ?? 0;
            const subCount  = task.subTasks?.length ?? 0;

            return (
              <div
                key={task._id}
                className={`bg-white rounded-2xl border flex flex-col shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                  overdue ? "border-red-200" : "border-gray-100"
                }`}
              >
                {/* ── Colour accent strip ── */}
                <div className={`h-1 w-full ${pc.bar}`} />

                <div className="flex flex-col gap-0 p-5 flex-1">

                  {/* ── Card Header: title + progress ring ── */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-black leading-snug" style={tnr}>
                        {task.taskTitle}
                      </h2>
                      {overdue && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-red-500 border border-red-300 bg-red-50 px-2 py-0.5 rounded-full" style={tnr}>
                          ⚠ Overdue
                        </span>
                      )}
                    </div>
                    <ProgressRing pct={pct} />
                  </div>

                  {/* ── Progress bar ── */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400" style={tnr}>Progress</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pc.ring} ${pc.text}`} style={tnr}>
                        {pct === 100 ? "Done!" : pct === 0 ? "Not started" : `${pct}%`}
                      </span>
                    </div>
                    {/* Segmented bar */}
                    <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${pc.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {/* Tick marks at 25/50/75 */}
                    <div className="relative w-full flex justify-between mt-0.5 px-0">
                      {[25, 50, 75].map((tick) => (
                        <div key={tick} className="flex flex-col items-center" style={{ width: 0, marginLeft: `${tick}%`, position: "absolute", left: `${tick}%` }}>
                          <div className="w-px h-1.5 bg-gray-200" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Subtasks ── */}
                  {subCount > 0 && (
                    <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                      {/* Subtask header */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400" style={tnr}>
                          Subtasks
                        </span>
                        <div className="flex items-center gap-2">
                          {/* Mini progress dots */}
                          <div className="flex gap-0.5">
                            {task.subTasks.map((s) => (
                              <div
                                key={s._id}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${s.completed ? "bg-emerald-500" : "bg-gray-200"}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500" style={tnr}>
                            {doneCount}/{subCount}
                          </span>
                        </div>
                      </div>

                      {/* Subtask list */}
                      <div className="flex flex-col divide-y divide-gray-100">
                        {task.subTasks.map((sub, idx) => (
                          <label
                            key={sub._id}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white transition-colors group"
                          >
                            {/* Custom checkbox */}
                            <button
                              type="button"
                              onClick={() => toggleSubTask(task._id, sub._id)}
                              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                sub.completed
                                  ? "bg-emerald-500 border-emerald-500"
                                  : "bg-white border-gray-300 group-hover:border-emerald-400"
                              }`}
                            >
                              {sub.completed && (
                                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </button>

                            {/* Step number */}
                            <span className={`text-[10px] font-bold w-4 text-center flex-shrink-0 ${sub.completed ? "text-emerald-400" : "text-gray-300"}`} style={tnr}>
                              {idx + 1}
                            </span>

                            {/* Label */}
                            <span
                              className={`text-sm flex-1 leading-snug transition-all ${
                                sub.completed ? "line-through text-gray-400" : "text-gray-700"
                              }`}
                              style={tnr}
                            >
                              {sub.title}
                            </span>

                            {sub.completed && (
                              <span className="text-[10px] text-emerald-500 font-semibold flex-shrink-0" style={tnr}>✓</span>
                            )}
                          </label>
                        ))}
                      </div>

                      {/* Subtask completion bar */}
                      <div className="h-1 bg-gray-100">
                        <div
                          className="h-1 bg-emerald-400 transition-all duration-500"
                          style={{ width: subCount ? `${Math.round((doneCount / subCount) * 100)}%` : "0%" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Description ── */}
                  {task.description && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 italic" style={tnr}>
                      {task.description}
                    </p>
                  )}

                  {/* ── Spacer ── */}
                  <div className="flex-1" />

                  {/* ── Divider ── */}
                  <div className="border-t border-gray-100 mb-3" />

                  {/* ── Badges ── */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <ImportanceBadge importance={task.importance} />
                    <StatusBadge status={task.status} />
                  </div>

                  {/* ── Deadline ── */}
                  <div className={`flex items-center gap-2 ${overdue ? "text-red-400" : "text-gray-400"}`}>
                    <CalendarIcon />
                    <span
                      className={`text-xs font-medium ${overdue ? "text-red-500 font-semibold" : "text-gray-500"}`}
                      style={tnr}
                    >
                      {overdue ? "Was due " : "Due "}{formatDate(task.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}