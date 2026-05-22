// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// export default function TaskPage() {
//   const [open, setOpen] =
//     useState(false);

//   const [loading, setLoading] =
//     useState(false);

//   const [tasks, setTasks] =
//     useState<any[]>([]);
//     const [editId, setEditId] =
//   useState("");

//   const [formData, setFormData] =
//     useState({
//       taskTitle: "",
//       description: "",
//       assignTo: "",
//       importance: "Low",
//       deadline: "",
//       status: "Not Started",
//     });

//   // FETCH TASKS
//   const fetchTasks = async () => {
//     try {
//       const user = JSON.parse(
//         localStorage.getItem(
//           "user"
//         ) || "{}"
//       );

//       const branchName =
//         user.branchName;

//       const res = await fetch(
//         "/api/task"
//       );

//       const data = await res.json();

//       if (data.success) {
//         const filteredTasks =
//           data.tasks.filter(
//             (task: any) =>
//               task.branchName ===
//               branchName
//           );

//         setTasks(filteredTasks);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const handleChange = (
//     e: any
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]:
//         e.target.value,
//     });
//   };

//   const handleEdit = (
//   task: any
// ) => {
//   setEditId(task._id);

//   setFormData({
//     taskTitle:
//       task.taskTitle,

//     description:
//       task.description,

//     assignTo:
//       task.assignTo,

//     importance:
//       task.importance,

//     deadline:
//       task.deadline
//         ?.split("T")[0],

//     status: task.status,
//   });

//   setOpen(true);
// };
// const handleDelete = async (
//   id: string
// ) => {
//   try {
//     const confirmDelete =
//       confirm(
//         "Are you sure want to delete?"
//       );

//     if (!confirmDelete)
//       return;

//     const res = await fetch(
//       `/api/task/${id}`,
//       {
//         method: "DELETE",
//       }
//     );

//     const data =
//       await res.json();

//     alert(data.message);

//     fetchTasks();
//   } catch (error) {
//     console.log(error);
//   }
// };
//   // SUBMIT
//   const handleSubmit = async (
//     e: any
//   ) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const user = JSON.parse(
//         localStorage.getItem(
//           "user"
//         ) || "{}"
//       );

//       const branchName =
//         user.branchName;

//       const createdBy =
//         user.email;

//       const res = await fetch(
//   editId
//     ? `/api/task/${editId}`
//     : "/api/task",
//   {
//     method: editId
//       ? "PUT"
//       : "POST",

//     headers: {
//       "Content-Type":
//         "application/json",
//     },

//     body: JSON.stringify({
//       ...formData,
//       branchName,
//       createdBy,
//     }),
//   }
// );

//       const data =
//         await res.json();

//       alert(data.message);

//       if (data.success) {
//         setOpen(false);
//         setEditId("");

//         fetchTasks();

//         setFormData({
//           taskTitle: "",
//           description: "",
//           assignTo: "",
//           importance: "Low",
//           deadline: "",
//           status:
//             "Not Started",
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* TOP */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold">
//           Task Management
//         </h1>

//         <button
//           onClick={() =>
//             setOpen(true)
//           }
//           className="bg-blue-600 text-white px-5 py-2 rounded-lg"
//         >
//           Add Task
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto bg-white rounded-2xl shadow">
//         <table className="w-full">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-4 text-left">
//                 Task
//               </th>

//               <th className="p-4 text-left">
//                 Assign To
//               </th>

//               <th className="p-4 text-left">
//                 Importance
//               </th>

//               <th className="p-4 text-left">
//                 Deadline
//               </th>

//               <th className="p-4 text-left">
//                 Status
//               </th>
//               <th className="p-4 text-left">
//   Actions
// </th>
//             </tr>
//           </thead>

//           <tbody>
//             {tasks.map(
//               (task, index) => (
//                 <tr
//                   key={index}
//                   className="border-b"
//                 >
//                   <td className="p-4">
//                     {
//                       task.taskTitle
//                     }
//                   </td>

//                   <td className="p-4">
//                     {
//                       task.assignTo
//                     }
//                   </td>

//                   <td className="p-4">
//                     {
//                       task.importance
//                     }
//                   </td>

//                   <td className="p-4">
//                     {new Date(
//                       task.deadline
//                     ).toLocaleDateString()}
//                   </td>

//                   <td className="p-4">
//                     <span
//                       className={`px-3 py-1 rounded-full border text-sm
//                       ${
//                         task.status ===
//                         "Complete"
//                           ? "border-green-500 bg-green-500/10 text-green-600"

//                           : task.status ===
//                             "In Progress"
//                           ? "border-blue-500 bg-blue-500/10 text-blue-600"

//                           : "border-red-500 bg-red-500/10 text-red-600"
//                       }`}
//                     >
//                       {
//                         task.status
//                       }
//                     </span>
//                   </td>
//                   <td className="p-4 flex gap-3">
//   <button
//     onClick={() =>
//       handleEdit(task)
//     }
//     className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
//   >
//     Edit
//   </button>

//   <button
//     onClick={() =>
//       handleDelete(task._id)
//     }
//     className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
//   >
//     Delete
//   </button>
// </td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* MODAL */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white w-full max-w-2xl rounded-2xl p-6">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-2xl font-bold">
//                {editId
//   ? "Edit Task"
//   : "Create Task"}
//               </h2>

//               <button
//                 onClick={() =>
//                   setOpen(false)
//                 }
//               >
//                 ✕
//               </button>
//             </div>

//             <form
//               onSubmit={
//                 handleSubmit
//               }
//               className="grid grid-cols-2 gap-4"
//             >
//               <input
//                 type="text"
//                 name="taskTitle"
//                 placeholder="Task Title"
//                 value={
//                   formData.taskTitle
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 className="border p-3 rounded-lg"
//               />

//               <input
//                 type="email"
//                 name="assignTo"
//                 placeholder="Assign Email"
//                 value={
//                   formData.assignTo
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 className="border p-3 rounded-lg"
//               />

//               <textarea
//                 name="description"
//                 placeholder="Description"
//                 value={
//                   formData.description
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 className="border p-3 rounded-lg col-span-2"
//               />

//               <select
//                 name="importance"
//                 value={
//                   formData.importance
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 className="border p-3 rounded-lg"
//               >
//                 <option value="Low">
//                   Low
//                 </option>

//                 <option value="Medium">
//                   Medium
//                 </option>

//                 <option value="High">
//                   High
//                 </option>
//               </select>

//               <input
//                 type="date"
//                 name="deadline"
//                 value={
//                   formData.deadline
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 className="border p-3 rounded-lg"
//               />

//               <select
//                 name="status"
//                 value={
//                   formData.status
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 className="border p-3 rounded-lg col-span-2"
//               >
//                 <option value="Not Started">
//                   Not Started
//                 </option>

//                 <option value="In Progress">
//                   In Progress
//                 </option>

//                 <option value="Complete">
//                   Complete
//                 </option>
//               </select>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-green-600 text-white py-3 rounded-lg col-span-2"
//               >
//                 {loading
//   ? editId
//     ? "Updating..."
//     : "Creating..."
//   : editId
//   ? "Update Task"
//   : "Create Task"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




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
function PieChart({ notStarted, inProgress, complete }: { notStarted: number; inProgress: number; complete: number }) {
  const total = notStarted + inProgress + complete;

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

  // Build pie slices
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
        <text x="60" y="56" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111" fontFamily="Times New Roman">
          {total}
        </text>
        <text x="60" y="69" textAnchor="middle" fontSize="8" fill="#9ca3af" fontFamily="Times New Roman">
          Total
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 w-full">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: s.color }} />
              <span className="text-gray-600" style={{ fontFamily: '"Times New Roman", serif' }}>{s.label}</span>
            </div>
            <span className="font-semibold text-gray-800" style={{ fontFamily: '"Times New Roman", serif' }}>{s.value}</span>
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

// ── Main Page ──────────────────────────────────────────────────────────────────
const TNR = '"Times New Roman", Times, serif';

const emptyForm = {
  taskTitle: "",
  description: "",
  assignTo: "",
  importance: "Low",
  deadline: "",
  status: "Not Started",
};

export default function TaskPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState(emptyForm);

//   const fetchTasks = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       const res = await fetch("/api/task");
//       const data = await res.json();
//       if (data.success) {
//         setTasks(data.tasks.filter((t: any) => t.branchName === user.branchName));
//       }
//     } catch (e) { console.log(e); }
//   };

const fetchTasks = async () => {
  try {
    // GET LOGIN USER
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    // GET LOGIN USER BRANCH
    const branchName =
      user.branchName;

    const res = await fetch(
      "/api/task"
    );

    const data = await res.json();

    if (data.success) {

      // FILTER SAME BRANCH TASKS
      const filteredTasks =
        data.tasks.filter(
          (task: any) =>
            task.branchName ===
            branchName
        );

      setTasks(filteredTasks);
    }
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => { fetchTasks(); }, []);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEdit = (task: any) => {
    setEditId(task._id);
    setFormData({
      taskTitle: task.taskTitle,
      description: task.description,
      assignTo: task.assignTo,
      importance: task.importance,
      deadline: task.deadline?.split("T")[0],
      status: task.status,
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
    } catch { alert("Something went wrong"); }
    finally { setLoading(false); }
  };

  // Counts
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
        {/* Stat Cards */}
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
          {/* High importance banner */}
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

        {/* Pie Chart */}
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
              {["Task", "Assigned To", "Importance", "Deadline", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-400 italic text-base">
                  No tasks found. Add your first task.
                </td>
              </tr>
            ) : (
              tasks.map((task, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">{task.taskTitle}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{task.assignTo}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${importanceBadge(task.importance)}`}>
                      {task.importance}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs">
                    {new Date(task.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ fontFamily: TNR }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
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

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <input
                type="text" name="taskTitle" placeholder="Task Title"
                value={formData.taskTitle} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm"
                style={{ fontFamily: TNR }}
              />
              <input
                type="email" name="assignTo" placeholder="Assign To (Email)"
                value={formData.assignTo} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm"
                style={{ fontFamily: TNR }}
              />
              <textarea
                name="description" placeholder="Description"
                value={formData.description} onChange={handleChange}
                rows={3}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm col-span-2 resize-none"
                style={{ fontFamily: TNR }}
              />

              {/* Importance */}
              <select
                name="importance" value={formData.importance} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm"
                style={{ fontFamily: TNR,
                  color: formData.importance === "High" ? "#b91c1c"
                       : formData.importance === "Medium" ? "#92400e"
                       : "#374151"
                }}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>

              <input
                type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm text-gray-900"
                style={{ fontFamily: TNR }}
              />

              {/* Status */}
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm col-span-2"
                style={{ fontFamily: TNR,
                  color: formData.status === "Complete" ? "#15803d"
                       : formData.status === "In Progress" ? "#1d4ed8"
                       : "#dc2626"
                }}
              >
                <option value="Not Started">🔴 Not Started</option>
                <option value="In Progress">🔵 In Progress</option>
                <option value="Complete">🟢 Complete</option>
              </select>

              <button
                type="submit" disabled={loading}
                className="col-span-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                style={{ fontFamily: TNR }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {editId ? "Updating..." : "Creating..."}
                  </>
                ) : editId ? "Update Task" : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}