"use client";

import { useEffect, useState } from "react";

const TNR = { fontFamily: "'Times New Roman', Times, serif" } as React.CSSProperties;

function StatusBadge({ status }: { status: string }) {
  if (status === "Present")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700" style={TNR}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Present
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-red-200 bg-red-50 text-red-600" style={TNR}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Absent
    </span>
  );
}

function ModeBadge({ mode }: { mode: string }) {
  const isOffice = mode === "Office";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
        isOffice
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-purple-200 bg-purple-50 text-purple-700"
      }`}
      style={TNR}
    >
      {isOffice ? (
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
      ) : (
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )}
      {mode}
    </span>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

export default function AttendancePage() {
  const [mode, setMode] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [attendanceProfile, setAttendanceProfile] = useState<any>(null);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [filter, setFilter] = useState<"All" | "Present" | "Absent">("All");

 async function fetchAttendance() {

  try {

    const user =
      JSON.parse(
        localStorage.getItem(
          "user"
        ) || "{}"
      );

    const res =
      await fetch(
        "/api/attendance"
      );

    const data =
      await res.json();

    if (data.success) {

      // FILTER ONLY LOGIN USER DATA
      const filtered =
        data.attendances.filter(
          (item: any) =>

            item.branchName ===
              user.branchName &&

            item.employeeEmail ===
              user.email
        );

      setAttendances(
        filtered
      );
    }

  } catch (e) {

    console.log(e);
  }
}

  async function fetchAttendanceProfile() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`/api/attendance/profile?email=${user.email}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setAttendanceProfile(data.profile);
        setProfileSaved(true);
        setMode(data.profile.mode);
        setOfficeAddress(data.profile.officeAddress);
      }
    } catch (e) { console.log(e); }
  }

  useEffect(() => { fetchAttendance(); fetchAttendanceProfile(); }, []);

  async function getNearbyPlaces(latitude: number, longitude: number) {
    try {
      const query = `[out:json];(node(around:3000,${latitude},${longitude})["place"];);out;`;
      const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
      const data = await res.json();
      return [...new Set(data.elements.map((item: any) => item.tags?.name).filter(Boolean))];
    } catch { return []; }
  }

  async function saveProfile() {
    if (!mode) return alert("Select work mode");
    if (!officeAddress) return alert("Enter address");
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch("/api/attendance/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeName: user.name, employeeEmail: user.email, branchName: user.branchName, mode, officeAddress }),
      });
      const data = await res.json();
      if (data.success) { alert("Profile Saved"); setProfileSaved(true); setAttendanceProfile(data.profile); }
    } catch (e) { console.log(e); }
  }

  async function markAttendance() {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const locationRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const locationData = await locationRes.json();
        const addr = locationData.address || {};
        const currentPlace = (addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.town || addr.city || addr.county || addr.state_district || addr.state || locationData.display_name?.split(",")[0]) || "Unknown";
        const nearbyPlaces = await getNearbyPlaces(latitude, longitude);
        const savedAddress = officeAddress.trim().toLowerCase();
        const current = currentPlace.trim().toLowerCase();
        const currentMatched = current.includes(savedAddress) || savedAddress.includes(current);
        const nearbyMatched = nearbyPlaces.some((place: any) => { const nearby = place?.trim()?.toLowerCase(); return nearby?.includes(savedAddress) || savedAddress.includes(nearby); });
        const status = (currentMatched || nearbyMatched) ? "Present" : "Absent";
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeName: user.name, employeeEmail: user.email, branchName: user.branchName, mode, officeAddress, currentLocation: currentPlace, status, latitude, longitude }),
        });
        const data = await res.json();
        if (data.success) { alert(`Attendance Marked: ${status}`); fetchAttendance(); }
        else alert(data.message);
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    });
  }

  const presentCount = attendances.filter((a) => a.status === "Present").length;
  const absentCount  = attendances.filter((a) => a.status === "Absent").length;
  const filtered     = filter === "All" ? attendances : attendances.filter((a) => a.status === filter);

  return (
    <>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .anim-fadeUp{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
      `}</style>

      <div className="min-h-screen bg-white px-6 py-8" style={TNR}>
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-8 anim-fadeUp border-b border-gray-100 pb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1" style={TNR}>
              Employee Portal
            </p>
            <div className="flex items-end justify-between">
              <h1 className="text-4xl font-bold text-black leading-none" style={{ ...TNR, letterSpacing: "-0.02em" }}>
                Attendance System
              </h1>
              <p className="text-sm text-gray-400" style={TNR}>
                {attendances.length} records total
              </p>
            </div>
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-3 gap-4 mb-8 anim-fadeUp" style={{ animationDelay: "0.1s" }}>
            {[
              { label: "Total Records", value: attendances.length, border: "border-gray-200",   bg: "bg-white",      num: "text-black"       },
              { label: "Present Days",  value: presentCount,       border: "border-emerald-200", bg: "bg-emerald-50", num: "text-emerald-700" },
              { label: "Absent Days",   value: absentCount,        border: "border-red-200",     bg: "bg-red-50",     num: "text-red-700"     },
            ].map((c) => (
              <div key={c.label} className={`rounded-2xl border ${c.border} ${c.bg} px-6 py-5 shadow-sm`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2" style={TNR}>{c.label}</p>
                <p className={`text-4xl font-bold ${c.num}`} style={TNR}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* ── Profile / Action Card ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-8 overflow-hidden anim-fadeUp" style={{ animationDelay: "0.15s" }}>
            <div className="h-1 w-full bg-black" />
            <div className="p-7">

              {!profileSaved ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-black" style={TNR}>Setup Attendance Profile</h2>
                      <p className="text-xs text-gray-400" style={TNR}>Configure your work mode and location</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-100 mb-6" />

                  <div className="grid md:grid-cols-2 gap-5 mb-6">
                    {/* Mode */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2" style={TNR}>
                        Work Mode
                      </label>
                      <div className="relative">
                        <select
                          value={mode}
                          onChange={(e) => setMode(e.target.value)}
                          className="w-full h-12 border border-gray-200 rounded-xl bg-gray-50 px-4 text-sm text-black outline-none appearance-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]"
                          style={TNR}
                        >
                          <option value="">Select Mode</option>
                          <option value="Office">Office</option>
                          <option value="Work From Home">Work From Home</option>
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                    </div>

                    {/* Address */}
                    {(mode === "Office" || mode === "Work From Home") && (
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2" style={TNR}>
                          {mode === "Office" ? "Office Address" : "Home Address"}
                        </label>
                        <div className="relative">
                          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                          </svg>
                          <input
                            type="text"
                            placeholder="e.g. Srichanda, Kolkata"
                            value={officeAddress}
                            onChange={(e) => setOfficeAddress(e.target.value)}
                            className="w-full h-12 border border-gray-200 rounded-xl bg-gray-50 pl-10 pr-4 text-sm text-black placeholder-gray-300 outline-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]"
                            style={TNR}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={saveProfile}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200"
                    style={TNR}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save Profile
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Profile info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center flex-shrink-0">
                      {attendanceProfile?.mode === "Office" ? (
                        <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400" style={TNR}>Work Mode</span>
                        <ModeBadge mode={attendanceProfile?.mode} />
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600" style={TNR}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        {attendanceProfile?.officeAddress}
                      </div>
                    </div>
                  </div>

                  {/* Mark button */}
                  <button
                    onClick={markAttendance}
                    disabled={loading}
                    className="flex items-center gap-2.5 bg-black text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-900 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={TNR}
                  >
                    {loading ? (
                      <><div className="spinner" /> Checking Location…</>
                    ) : (
                      <>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        Login Attendance
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Filter Tabs ── */}
          <div className="flex items-center gap-2 mb-4 anim-fadeUp" style={{ animationDelay: "0.2s" }}>
            {(["All", "Present", "Absent"] as const).map((f) => {
              const count = f === "All" ? attendances.length : f === "Present" ? presentCount : absentCount;
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black"
                  }`}
                  style={TNR}
                >
                  {f}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Table ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden anim-fadeUp" style={{ animationDelay: "0.25s" }}>
            <table className="w-full text-sm" style={TNR}>
              <thead>
                <tr className="bg-black text-white">
                  {["Employee", "Mode", "Office Address", "Current Location", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em]" style={TNR}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <svg width="22" height="22" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                        </div>
                        <p className="text-gray-400 font-medium" style={TNR}>No attendance records</p>
                        <p className="text-gray-300 text-xs" style={TNR}>Records will appear after marking attendance.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">

                      {/* Employee */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                            <span className="text-[11px] font-bold text-white" style={TNR}>
                              {item.employeeName?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-black text-sm" style={TNR}>{item.employeeName}</p>
                            <p className="text-[11px] text-gray-400" style={TNR}>{item.employeeEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Mode */}
                      <td className="px-5 py-4">
                        <ModeBadge mode={item.mode} />
                      </td>

                      {/* Office address */}
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-gray-600 text-xs" style={TNR}>
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="flex-shrink-0 text-gray-400">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                          </svg>
                          {item.officeAddress}
                        </span>
                      </td>

                      {/* Current location */}
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-gray-600 text-xs" style={TNR}>
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="flex-shrink-0 text-blue-400">
                            <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                          </svg>
                          {item.currentLocation}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg" style={TNR}>
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="text-gray-400">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {formatDate(item.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}