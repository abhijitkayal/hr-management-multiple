"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  department: "",
  type: "Full Time",
  closingDate: "",
  openingDate: "",
  salary: "",
  experience: "",
  interviewType: "Online",
  description: "",
};

const tnrStyle = { fontFamily: "'Times New Roman', Times, serif" };

// --- Icons ---
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",marginRight:4,verticalAlign:"middle"}}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",marginRight:8,verticalAlign:"middle"}}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);

// --- Type badge colours (light theme) ---
function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, React.CSSProperties> = {
    "Full Time": { background: "#dbeafe", color: "#1d4ed8", border: "1.5px solid #93c5fd" },
    "Intern":    { background: "#ede9fe", color: "#6d28d9", border: "1.5px solid #c4b5fd" },
  };
  const s = styles[type] || { background: "#f3f4f6", color: "#374151", border: "1.5px solid #d1d5db" };
  return (
    <span style={{ ...tnrStyle, ...s, padding: "3px 13px", borderRadius: 20, fontSize: 13, fontWeight: 600, letterSpacing: 0.2, whiteSpace: "nowrap" }}>
      {type}
    </span>
  );
}

// --- Status badge colours (light theme) ---
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, React.CSSProperties> = {
    "Open":   { background: "#dcfce7", color: "#15803d", border: "1.5px solid #86efac" },
    "Closed": { background: "#fee2e2", color: "#b91c1c", border: "1.5px solid #fca5a5" },
  };
  const s = styles[status] || { background: "#f3f4f6", color: "#374151", border: "1.5px solid #d1d5db" };
  return (
    <span style={{ ...tnrStyle, ...s, padding: "3px 13px", borderRadius: 20, fontSize: 13, fontWeight: 600, letterSpacing: 0.2, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

// --- Coloured Date chip (light theme) ---
function DateChip({ date, accent }: { date: string; accent: string }) {
  if (!date) return <span style={{ color: "#9ca3af", ...tnrStyle }}>—</span>;
  const d = new Date(date);
  const formatted = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const colorMap: Record<string, { bg: string; color: string; border: string }> = {
    green: { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
    amber: { bg: "#fef3c7", color: "#b45309", border: "#fcd34d" },
    red:   { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" },
    blue:  { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  };
  const c = colorMap[accent] || colorMap.blue;
  return (
    <span style={{ ...tnrStyle, background: c.bg, color: c.color, border: `1.5px solid ${c.border}`, padding: "3px 11px", borderRadius: 16, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>
      <CalendarIcon />{formatted}
    </span>
  );
}

export default function JobPostingPage() {
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [editId, setEditId]     = useState("");
  const [jobs, setJobs]         = useState<any[]>([]);
  const [formData, setFormData] = useState(emptyForm);

//   const fetchJobs = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       const res  = await fetch("/api/job");
//       const data = await res.json();
//       if (data.success) {
//         setJobs(data.jobs.filter((job: any) => job.branchName === user.branchName));
//       }
//     } catch (error) { console.log(error); }
//   };

const fetchJobs = async () => {
  try {
    // GET LOGIN USER
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    // GET LOGIN USER BRANCH
    const branchName =
      user.branchName;

    const res = await fetch(
      "/api/job"
    );

    const data = await res.json();

    if (data.success) {

      // SHOW ONLY SAME BRANCH JOBS
      const filteredJobs =
        data.jobs.filter(
          (job: any) =>
            job.branchName ===
            branchName
        );

      setJobs(filteredJobs);
    }
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => { fetchJobs(); }, []);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEdit = (job: any) => {
    setEditId(job._id);
    setFormData({
      title:         job.title,
      department:    job.department,
      type:          job.type,
      closingDate:   job.closingDate?.split("T")[0],
      openingDate:   job.openingDate?.split("T")[0] || "",
      salary:        job.salary,
      experience:    job.experience,
      interviewType: job.interviewType,
      description:   job.description,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const res  = await fetch(`/api/job/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);
      fetchJobs();
    } catch (error) { console.log(error); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res  = await fetch(editId ? `/api/job/${editId}` : "/api/job", {
        method:  editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, branchName: user.branchName, createdBy: user.email }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setOpen(false); setEditId(""); setFormData(emptyForm); fetchJobs();
      }
    } catch (error) { console.log(error); }
    finally { setLoading(false); }
  };

  const totalJobs  = jobs.length;
  const openJobs   = jobs.filter(j => j.status === "Open").length;
  const closedJobs = jobs.filter(j => j.status === "Closed").length;

  const inputStyle: React.CSSProperties = {
    ...tnrStyle,
    border: "1.5px solid #d1d5db",
    padding: "11px 14px",
    borderRadius: 10,
    background: "#fff",
    color: "#111",
    fontSize: 14.5,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    ...tnrStyle,
    fontSize: 12.5,
    color: "#6b7280",
    marginBottom: 4,
    display: "block",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontWeight: 600,
  };

  return (
    <div style={{ ...tnrStyle, padding: "28px 32px", background: "transparent", minHeight: "100vh", color: "#111" }}>

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ ...tnrStyle, fontSize: 30, fontWeight: 700, margin: 0, color: "#111", letterSpacing: -0.5 }}>
          <BriefcaseIcon />Job Postings
        </h1>
        <button
          onClick={() => { setOpen(true); setEditId(""); setFormData(emptyForm); }}
          style={{ ...tnrStyle, background: "#000", color: "#fff", border: "none", padding: "10px 26px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}
        >
          + Add Job
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: "flex", gap: 18, marginBottom: 28 }}>
        {[
          { label: "Total Postings", value: totalJobs,  color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" },
          { label: "Open",           value: openJobs,   color: "#15803d", bg: "#dcfce7", border: "#86efac" },
          { label: "Closed",         value: closedJobs, color: "#b91c1c", bg: "#fee2e2", border: "#fca5a5" },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{ flex: 1, background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: "18px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ ...tnrStyle, fontSize: 12.5, color, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
            <span style={{ ...tnrStyle, fontSize: 34, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#111", borderBottom: "2px solid #e5e7eb" }}>
              {["Title", "Department", "Type", "Salary", "Status", "Opening Date", "Closing Date", "Actions"].map(h => (
                <th key={h} style={{ ...tnrStyle, padding: "14px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={8} style={{ ...tnrStyle, padding: "36px", textAlign: "center", color: "#9ca3af", fontSize: 16, fontStyle: "italic" }}>
                  No job postings found.
                </td>
              </tr>
            )}
            {jobs.map((job, index) => (
              <tr
                key={index}
                style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ ...tnrStyle, padding: "13px 16px", fontSize: 14.5, fontWeight: 600, color: "#111" }}>{job.title}</td>
                <td style={{ ...tnrStyle, padding: "13px 16px", fontSize: 14, color: "#374151" }}>{job.department}</td>
                <td style={{ padding: "13px 16px" }}><TypeBadge type={job.type} /></td>
                <td style={{ ...tnrStyle, padding: "13px 16px", fontSize: 14, color: "#b45309", fontWeight: 600 }}>₹{job.salary}</td>
                <td style={{ padding: "13px 16px" }}><StatusBadge status={job.status} /></td>
                <td style={{ padding: "13px 16px" }}><DateChip date={job.postedDate} accent="green" /></td>
                <td style={{ padding: "13px 16px" }}><DateChip date={job.closingDate} accent="amber" /></td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(job)}
                      title="Edit"
                    //   style={{ ...tnrStyle, background: "#000", color: "#fff", border: "none", padding: "7px 13px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, transition: "opacity 0.15s" }}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-blue-600 text-blue-600 transition-all"
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      title="Delete"
                    //   style={{ ...tnrStyle, background: "#000", color: "#fff", border: "none", padding: "7px 13px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, transition: "opacity 0.15s" }}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-red-600 transition-all"
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      <TrashIcon /> 
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(3px)" }}>
          <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", width: "100%", maxWidth: 700, borderRadius: 18, padding: "28px 32px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ ...tnrStyle, fontSize: 24, fontWeight: 700, margin: 0, color: "#111" }}>
                {editId ? "Edit Job Posting" : "Create Job Posting"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", color: "#6b7280", fontSize: 22, cursor: "pointer", lineHeight: 1 }}
              >✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Job Title</label>
                <input type="text" name="title" placeholder="e.g. Senior Engineer" value={formData.title} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <input type="text" name="department" placeholder="e.g. Engineering" value={formData.department} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Job Type</label>
                <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                  <option value="Full Time">Full Time</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Interview Type</label>
                <select name="interviewType" value={formData.interviewType} onChange={handleChange} style={inputStyle}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Opening Date</label>
                <input type="date" name="openingDate" value={formData.openingDate} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Closing Date</label>
                <input type="date" name="closingDate" value={formData.closingDate} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Salary (₹)</label>
                <input type="text" name="salary" placeholder="e.g. 80000" value={formData.salary} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Experience</label>
                <input type="text" name="experience" placeholder="e.g. 2+ years" value={formData.experience} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Job Description</label>
                <textarea name="description" placeholder="Describe the role, responsibilities, and requirements..." value={formData.description} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} rows={4} />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ ...tnrStyle, gridColumn: "span 2", background: "#000", color: "#fff", border: "none", padding: "13px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", letterSpacing: 0.3, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (editId ? "Updating…" : "Creating…") : (editId ? "Update Job" : "Create Job")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}