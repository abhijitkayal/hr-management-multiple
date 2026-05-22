"use client";

import { useEffect, useState } from "react";

const TNR: React.CSSProperties = {
  fontFamily: "'Times New Roman', Times, serif",
};

const emptyForm = {
  trainingTitle: "",
  trainingType: "",
  department: "",
  trainerName: "",
  trainerEmail: "",
  trainingUrl: "",
  assignEmails: "",
  status: "Pending",
};

// ── Icons ────────────────────────────────────────────────
function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── Status config ────────────────────────────────────────
const statusStyle: Record<string, string> = {
  Complete: "border-green-500 bg-green-50 text-green-700",
  Progress: "border-yellow-500 bg-yellow-50 text-yellow-700",
  Pending:  "border-blue-500 bg-blue-50 text-blue-700",
};

// ── Summary card data ────────────────────────────────────
const summaryCards = [
  { label: "Total Trainings",   key: "total",    border: "border-black",       text: "text-black" },
  { label: "Complete",          key: "Complete", border: "border-green-500",   text: "text-green-600" },
  { label: "In Progress",       key: "Progress", border: "border-yellow-500",  text: "text-yellow-600" },
  { label: "Pending",           key: "Pending",  border: "border-blue-500",    text: "text-blue-600" },
];

export default function TrainingPage() {
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [editId, setEditId]     = useState("");
  const [trainings, setTrainings] = useState<any[]>([]);
  const [formData, setFormData] = useState(emptyForm);

  // ── FETCH ──────────────────────────────────────────────
const fetchTrainings = async () => {
  try {
    // GET LOGIN USER
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    // GET LOGIN USER BRANCH
    const branchName =
      user.branchName;

    const res = await fetch(
      "/api/training"
    );

    const data = await res.json();

    if (data.success) {

      // SHOW ONLY SAME BRANCH TRAININGS
      const filteredTrainings =
        data.trainings.filter(
          (training: any) =>
            training.branchName ===
            branchName
        );

      setTrainings(
        filteredTrainings
      );
    }
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => { fetchTrainings(); }, []);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ── EDIT ───────────────────────────────────────────────
  const handleEdit = (t: any) => {
    setEditId(t._id);
    setFormData({
      trainingTitle: t.trainingTitle,
      trainingType:  t.trainingType,
      department:    t.department,
      trainerName:   t.trainerName,
      trainerEmail:  t.trainerEmail,
      trainingUrl:   t.trainingUrl,
      assignEmails:  t.assignEmails.join(","),
      status:        t.status,
    });
    setOpen(true);
  };

  // ── DELETE ─────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this training?")) return;
    try {
      const res  = await fetch(`/api/training/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);
      fetchTrainings();
    } catch (err) { console.error(err); }
  };

  // ── SUBMIT ─────────────────────────────────────────────
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user        = JSON.parse(localStorage.getItem("user") || "{}");
      const emailsArray = formData.assignEmails.split(",").map((em) => em.trim());
      const res = await fetch(
        editId ? `/api/training/${editId}` : "/api/training",
        {
          method:  editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            assignEmails: emailsArray,
            branchName:   user.branchName,
            createdBy:    user.email,
          }),
        }
      );
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setOpen(false);
        setEditId("");
        setFormData(emptyForm);
        fetchTrainings();
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ── Summary counts ─────────────────────────────────────
  const counts: Record<string, number> = {
    total:    trainings.length,
    Complete: trainings.filter((t) => t.status === "Complete").length,
    Progress: trainings.filter((t) => t.status === "Progress").length,
    Pending:  trainings.filter((t) => t.status === "Pending").length,
  };

  const inputClass =
    "border-2 border-black bg-white text-black p-3 rounded-xl w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <div className="min-h-screen bg-white p-8" style={TNR}>

      {/* ── PAGE HEADER ─────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-black" style={TNR}>
          Training Management
        </h1>
        <button
          onClick={() => { setOpen(true); setEditId(""); setFormData(emptyForm); }}
          className="bg-black text-white px-6 py-2.5 rounded-xl text-base font-semibold hover:bg-gray-800 transition-colors"
          style={TNR}
        >
          + Add Training
        </button>
      </div>

      {/* ── SUMMARY CARDS ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
        {summaryCards.map(({ label, key, border, text }) => (
          <div key={key} className={`bg-white border-2 ${border} rounded-2xl p-5 shadow-sm`}>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1" style={TNR}>
              {label}
            </p>
            <p className={`text-4xl font-bold ${text}`} style={TNR}>
              {counts[key]}
            </p>
          </div>
        ))}
      </div>

      {/* ── TABLE ───────────────────────────────── */}
      <div className="overflow-x-auto bg-white rounded-2xl border-2 shadow-sm">
        <table className="w-full" style={TNR}>
          <thead className="bg-black text-white">
            <tr>
              {["Title", "Type", "Department", "Trainer", "Trainer Email", "Status","url", "Actions"].map((h) => (
                <th key={h} className="p-4 text-left text-xs uppercase tracking-wider font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {trainings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400 italic" style={TNR}>
                  No training records found.
                </td>
              </tr>
            ) : (
              trainings.map((training, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-black whitespace-nowrap">{training.trainingTitle}</td>
                  <td className="p-4 text-black">{training.trainingType}</td>
                  <td className="p-4 text-black">{training.department}</td>
                  <td className="p-4 text-black whitespace-nowrap">{training.trainerName}</td>
                  <td className="p-4 text-black text-sm">{training.trainerEmail}</td>

                  {/* Status badge */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wide whitespace-nowrap
                        ${statusStyle[training.status] ?? "border-gray-400 bg-gray-50 text-gray-600"}`}
                      style={TNR}
                    >
                      {training.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={training.trainingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:text-red-700 underline transition-colors"
                    >
                      View Training
                    </a>
                  </td>

                  {/* Icon actions */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(training)}
                        title="Edit"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-100 hover:text-blue-600 text-blue-600 transition-all"
                        style={TNR}
                      >
                        <EditIcon />
                        {/* <span className="text-xs">Edit</span> */}
                      </button>
                      <button
                        onClick={() => handleDelete(training._id)}
                        title="Delete"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 hover:bg-red-100 hover:text-red-600 text-red-600 transition-all"
                        style={TNR}
                      >
                        <DeleteIcon />
                        {/* <span className="text-xs">Delete</span> */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL ───────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white w-full max-w-3xl rounded-2xl p-8 border-2 border-black shadow-2xl max-h-[90vh] overflow-y-auto"
            style={TNR}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black" style={TNR}>
                {editId ? "Edit Training" : "Create Training"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-black hover:text-gray-500 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="trainingTitle"
                placeholder="Training Title"
                value={formData.trainingTitle}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="text"
                name="trainingType"
                placeholder="Training Type"
                value={formData.trainingType}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="text"
                name="trainerName"
                placeholder="Trainer Name"
                value={formData.trainerName}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="email"
                name="trainerEmail"
                placeholder="Trainer Email"
                value={formData.trainerEmail}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="text"
                name="trainingUrl"
                placeholder="Training URL"
                value={formData.trainingUrl}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
              />

              <textarea
                name="assignEmails"
                placeholder="Assign emails — separate multiple with commas"
                value={formData.assignEmails}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} col-span-2 resize-none`}
                style={TNR}
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} col-span-2`}
                style={TNR}
              >
                <option value="Pending">Pending</option>
                <option value="Progress">Progress</option>
                <option value="Complete">Complete</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white py-3 rounded-xl col-span-2 font-semibold text-base hover:bg-gray-800 transition-colors disabled:opacity-60"
                style={TNR}
              >
                {loading
                  ? editId ? "Updating..." : "Creating..."
                  : editId ? "Update Training" : "Create Training"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}