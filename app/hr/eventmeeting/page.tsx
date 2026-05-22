"use client";

import { useEffect, useState } from "react";

const TNR = '"Times New Roman", Times, serif';

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

function CloseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

const emptyForm = {
  title: "",
  description: "",
  meetingLink: "",
  date: "",
  time: "",
  assign: "",
};

export default function EventMeetingPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [meetings, setMeetings] = useState<any[]>([]);
  const [formData, setFormData] = useState(emptyForm);

//   const fetchMeetings = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       const res = await fetch("/api/eventmeeting");
//       const data = await res.json();
//       if (data.success) {
//         setMeetings(data.meetings.filter((m: any) => m.branchName === user.branchName));
//       }
//     } catch (e) { console.log(e); }
//   };
const fetchMeetings = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const branchName =
      user.branchName;

    const res = await fetch(
      "/api/eventmeeting"
    );

    const data = await res.json();

    if (data.success) {

      // FILTER SAME BRANCH
      const filteredMeetings =
        data.meetings.filter(
          (meeting: any) =>
            meeting.branchName ===
            branchName
        );

      setMeetings(
        filteredMeetings
      );
    }
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => { fetchMeetings(); }, []);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEdit = (meeting: any) => {
    setEditId(meeting._id);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      meetingLink: meeting.meetingLink,
      date: meeting.date,
      time: meeting.time,
      assign: meeting.assign.join(", "),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    const res = await fetch(`/api/eventmeeting/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message);
    fetchMeetings();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const assignArray = formData.assign.split(",").map((em) => em.trim()).filter(Boolean);
      const res = await fetch(
        editId ? `/api/eventmeeting/${editId}` : "/api/eventmeeting",
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            assign: assignArray,
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
        fetchMeetings();
      }
    } catch { alert("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-transparent p-8" style={{ fontFamily: TNR }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Events & Meetings</h1>
          <p className="text-sm text-gray-400 mt-1">{meetings.length} scheduled</p>
        </div>
        <button
          onClick={() => { setEditId(""); setFormData(emptyForm); setOpen(true); }}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          style={{ fontFamily: TNR }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Meeting
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm" style={{ fontFamily: TNR }}>
          <thead>
            <tr className="bg-gray-900 text-white">
              {["Title & Description", "Date", "Time", "Assigned To", "Meeting Link", "Actions"].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meetings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-gray-400 italic text-base" style={{ fontFamily: TNR }}>
                  No meetings scheduled yet.
                </td>
              </tr>
            ) : (
              meetings.map((meeting, i) => (
                <tr key={meeting._id ?? i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                  {/* Title + description */}
                  <td className="px-5 py-4 max-w-[220px]">
                    <p className="font-semibold text-gray-900 leading-snug">{meeting.title}</p>
                    {meeting.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 leading-relaxed">{meeting.description}</p>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formatDate(meeting.date)}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatTime(meeting.time)}
                    </span>
                  </td>

                  {/* Assignees */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      {meeting.assign?.slice(0, 2).map((email: string, idx: number) => (
                        <span key={idx} className="text-xs text-gray-500 leading-relaxed">{email}</span>
                      ))}
                      {meeting.assign?.length > 2 && (
                        <span className="text-xs text-gray-400 italic">+{meeting.assign.length - 2} more</span>
                      )}
                    </div>
                  </td>

                  {/* Link */}
                  <td className="px-5 py-4">
                    {meeting.meetingLink ? (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
                        style={{ fontFamily: TNR }}
                      >
                        <LinkIcon /> Join Meeting
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(meeting)}
                        title="Edit"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-blue-600 transition-all"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(meeting._id)}
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

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ fontFamily: TNR }}>

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{editId ? "Edit Meeting" : "Create Meeting"}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editId ? "Update the meeting details below" : "Fill in the details to schedule a meeting"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <input
                type="text" name="title" placeholder="Meeting Title"
                value={formData.title} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm"
                style={{ fontFamily: TNR }}
              />
              <input
                type="text" name="meetingLink" placeholder="Meeting Link (optional)"
                value={formData.meetingLink} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm"
                style={{ fontFamily: TNR }}
              />
              <textarea
                name="description" placeholder="Description (optional)"
                value={formData.description} onChange={handleChange}
                rows={3}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm col-span-2 resize-none"
                style={{ fontFamily: TNR }}
              />
              <input
                type="date" name="date" value={formData.date} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm text-gray-900"
                style={{ fontFamily: TNR }}
              />
              <input
                type="time" name="time" value={formData.time} onChange={handleChange}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm text-gray-900"
                style={{ fontFamily: TNR }}
              />
              <textarea
                name="assign" placeholder="Assign emails, separated by commas"
                value={formData.assign} onChange={handleChange}
                rows={2}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm col-span-2 resize-none"
                style={{ fontFamily: TNR }}
              />
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
                ) : editId ? "Update Meeting" : "Create Meeting"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}