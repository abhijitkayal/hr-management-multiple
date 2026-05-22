"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  position: "",
  interviewType: "First Round",
  interviewerName: "",
  date: "",
  time: "",
  duration: "",
  url: "",
  description: "",
};

function getStatus(date: string, time: string) {
  if (!date || !time) return "upcoming";
  const interviewDateTime = new Date(`${date}T${time}`);
  return interviewDateTime < new Date() ? "closed" : "upcoming";
}

// Icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function InterviewPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [interviews, setInterviews] = useState<any[]>([]);
  const [formData, setFormData] = useState(emptyForm);

  const fetchInterviews = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const branchName = user.branchName;
      const res = await fetch("/api/interview");
      const data = await res.json();
      if (data.success) {
        const filtered = data.interviews.filter(
          (interview: any) => interview.branchName === branchName
        );
        setInterviews(filtered);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (interview: any) => {
    setEditId(interview._id);
    setFormData({
      position: interview.position,
      interviewType: interview.interviewType,
      interviewerName: interview.interviewerName,
      date: interview.date?.split("T")[0],
      time: interview.time,
      duration: interview.duration,
      url: interview.url,
      description: interview.description,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = confirm("Are you sure?");
      if (!confirmDelete) return;
      const res = await fetch(`/api/interview/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);
      fetchInterviews();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(
        editId ? `/api/interview/${editId}` : "/api/interview",
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            branchName: user.branchName,
            createdBy: user.email,
          }),
        }
      );
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setOpen(false);
        setEditId("");
        setFormData(emptyForm);
        fetchInterviews();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalInterviews = interviews.length;
  const closedCount = interviews.filter(
    (i) => getStatus(i.date?.split("T")[0], i.time) === "closed"
  ).length;
  const upcomingCount = totalInterviews - closedCount;

  const inputClass =
    "border border-gray-300 p-3 rounded-lg bg-white text-black w-full focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400";
  const labelClass = "block text-sm font-semibold text-black mb-1";

  return (
    <div
      className="min-h-screen bg-white text-black p-6"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black">
            Interview Management
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            Schedule and manage your interviews
          </p>
        </div>
        <button
          onClick={() => {
            setOpen(true);
            setEditId("");
            setFormData(emptyForm);
          }}
          className="bg-black text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-900 transition-colors shadow-sm"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          + Add Interview
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            Total Interviews
          </span>
          <span className="text-4xl font-bold text-black">{totalInterviews}</span>
        </div>
        {/* Upcoming */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">
            Upcoming
          </span>
          <span className="text-4xl font-bold text-emerald-600">{upcomingCount}</span>
        </div>
        {/* Closed */}
        <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-red-400 font-semibold">
            Closed
          </span>
          <span className="text-4xl font-bold text-red-500">{closedCount}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-100">
        <table
          className="w-full"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          <thead>
            <tr className="bg-black text-white">
              {[
                "Position",
                "Type",
                "Interviewer",
                "Date",
                "Time",
                "Duration",
                "Link",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="p-4 text-left text-sm font-semibold tracking-wide"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="p-8 text-center text-gray-400 italic"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  No interviews scheduled yet.
                </td>
              </tr>
            )}
            {interviews.map((interview, index) => {
              const status = getStatus(
                interview.date?.split("T")[0],
                interview.time
              );
              const isClosed = status === "closed";

              return (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="p-4 font-semibold text-black"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    {interview.position}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-semibold
                        ${
                          interview.interviewType === "Technical"
                            ? "border-blue-400 bg-blue-50 text-blue-600"
                            : interview.interviewType === "HR Round"
                            ? "border-green-400 bg-green-50 text-green-600"
                            : "border-yellow-400 bg-yellow-50 text-yellow-600"
                        }`}
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      {interview.interviewType}
                    </span>
                  </td>

                  <td
                    className="p-4 text-gray-700"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    {interview.interviewerName}
                  </td>

                  <td
  className="p-4"
  style={{
    fontFamily:
      "'Times New Roman', Times, serif",
  }}
>
  <span
    className="
      px-3 py-1
      rounded-full
      border
      border-amber-500
      bg-amber-500/10
      text-amber-700
      text-sm
      font-semibold
      whitespace-nowrap
    "
  >
    {new Date(
      interview.date
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )}
  </span>
</td>

                  <td
                    className="p-4 text-gray-700"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    {interview.time}
                  </td>

                  <td
                    className="p-4 text-gray-700 "
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    {interview.duration}
                  </td>

                  {/* LINK */}
                  <td className="p-4">
                    {interview.url ? (
                      <a
                        href={interview.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-black underline underline-offset-2 hover:text-gray-600 text-sm font-medium transition-colors"
                        style={{ fontFamily: "'Times New Roman', Times, serif" }}
                      >
                        <LinkIcon /> Join
                      </a>
                    ) : (
                      <span className="text-gray-300 text-sm italic">—</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                        ${
                          isClosed
                            ? "bg-red-50 border-red-300 text-red-600"
                            : "bg-emerald-50 border-emerald-300 text-emerald-600"
                        }`}
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isClosed ? "bg-red-500" : "bg-emerald-500"
                        }`}
                      />
                      {isClosed ? "Closed" : "Upcoming"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(interview)}
                        title="Edit"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-100 hover:text-blue-600 text-blue-600 transition-all"
                        style={{ fontFamily: "'Times New Roman', Times, serif" }}
                      >
                        <EditIcon /> 
                      </button>
                      <button
                        onClick={() => handleDelete(interview._id)}
                        title="Delete"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 hover:bg-red-100 hover:text-red-600 text-red-600 transition-all"
                        style={{ fontFamily: "'Times New Roman', Times, serif" }}
                      >
                        <DeleteIcon /> 
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-black">
                {editId ? "Edit Interview" : "Schedule Interview"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-black transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {/* Position */}
                <div>
                  <label className={labelClass}>Position</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="e.g. Software Engineer"
                    value={formData.position}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  />
                </div>

                {/* Interview Type */}
                <div>
                  <label className={labelClass}>Interview Type</label>
                  <select
                    name="interviewType"
                    value={formData.interviewType}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <option value="First Round">First Round</option>
                    <option value="Technical">Technical</option>
                    <option value="HR Round">HR Round</option>
                  </select>
                </div>

                {/* Interviewer */}
                <div>
                  <label className={labelClass}>Interviewer Name</label>
                  <input
                    type="text"
                    name="interviewerName"
                    placeholder="Interviewer's full name"
                    value={formData.interviewerName}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  />
                </div>

                {/* Time */}
                <div>
                  <label className={labelClass}>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className={labelClass}>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g. 45 mins"
                    value={formData.duration}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  />
                </div>

                {/* URL */}
                <div className="col-span-2">
                  <label className={labelClass}>Interview URL</label>
                  <input
                    type="text"
                    name="url"
                    placeholder="https://meet.google.com/..."
                    value={formData.url}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    placeholder="Interview notes or instructions..."
                    value={formData.description}
                    onChange={handleChange}
                    className={inputClass}
                    rows={3}
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="col-span-2 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {loading
                    ? editId
                      ? "Updating..."
                      : "Creating..."
                    : editId
                    ? "Update Interview"
                    : "Create Interview"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}