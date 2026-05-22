"use client";

import { use, useEffect, useState } from "react";

interface Meeting {
  _id: string;
  title: string;
  description: string;
  assign: string[];
  branchName: string;
  meetingLink: string;
  date: string;
}

const tnr = { fontFamily: "'Times New Roman', Times, serif" } as React.CSSProperties;

function formatDate(dateStr: string) {
  if (!dateStr) return { day: "—", month: "", year: "", time: "" };
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    year: d.toLocaleDateString("en-GB", { year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    full: d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
  };
}

function getMeetingStatus(dateStr: string) {
  if (!dateStr) return "upcoming";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  if (diff < 0) return "past";
  if (diff < 1000 * 60 * 60 * 24) return "today";
  return "upcoming";
}

const statusConfig = {
  past: { label: "Completed", cls: "border-gray-300 bg-gray-50 text-gray-500", dot: "bg-gray-400" },
  today: { label: "Today", cls: "border-emerald-400 bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  upcoming: { label: "Upcoming", cls: "border-blue-400 bg-blue-50 text-blue-600", dot: "bg-blue-500" },
};

const calendarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-amber-500",
];

// Icons
const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const BranchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"/>
    <circle cx="18" cy="6" r="3"/>
    <circle cx="6" cy="18" r="3"/>
    <path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
);

export default function MeetingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMeetings() {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const response = await fetch("/api/eventmeeting");
      const data = await response.json();
      const meetingsList = data.meetings ?? [];
      const filteredMeetings = meetingsList.filter(
        (meeting: Meeting) =>
          meeting.assign?.includes(user.email) &&
          meeting.branchName?.toLowerCase() === user.branchName?.toLowerCase()
      );
      setMeetings(filteredMeetings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMeetings();
  }, []);

  const total = meetings.length;
  const todayCount = meetings.filter((m) => getMeetingStatus(m.date) === "today").length;
  const upcomingCount = meetings.filter((m) => getMeetingStatus(m.date) === "upcoming").length;
  const pastCount = meetings.filter((m) => getMeetingStatus(m.date) === "past").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={tnr}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-base">Loading meetings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6" style={tnr}>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black tracking-tight" style={tnr}>
          Employee Meetings
        </h1>
        <p className="text-gray-400 mt-1 text-sm" style={tnr}>
          Employee ID:{" "}
          <span className="text-gray-600 font-semibold">{id}</span>
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1" style={tnr}>Total</p>
          <p className="text-4xl font-bold text-black" style={tnr}>{total}</p>
        </div>
        <div className="border border-emerald-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-emerald-500 font-semibold mb-1" style={tnr}>Today</p>
          <p className="text-4xl font-bold text-emerald-600" style={tnr}>{todayCount}</p>
        </div>
        <div className="border border-blue-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-1" style={tnr}>Upcoming</p>
          <p className="text-4xl font-bold text-blue-600" style={tnr}>{upcomingCount}</p>
        </div>
        <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1" style={tnr}>Past</p>
          <p className="text-4xl font-bold text-gray-500" style={tnr}>{pastCount}</p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-200 rounded-2xl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mb-4">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p className="text-gray-400 text-lg font-semibold" style={tnr}>No meetings found</p>
          <p className="text-gray-300 text-sm mt-1" style={tnr}>You have no meetings assigned yet</p>
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {meetings.map((meeting, index) => {
            const date = formatDate(meeting.date);
            const status = getMeetingStatus(meeting.date);
            const { label, cls, dot } = statusConfig[status];
            const calColor = calendarColors[index % calendarColors.length];

            return (
              <div
                key={meeting._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
              >
                {/* Card Top: Calendar Block + Status */}
                <div className="flex items-stretch gap-0">

                  {/* Calendar Date Block */}
                  <div className={`${calColor} flex flex-col items-center justify-center px-5 py-4 min-w-[80px]`}>
                    <span className="text-white text-xs font-bold uppercase tracking-widest opacity-80" style={tnr}>
                      {date.month}
                    </span>
                    <span className="text-white text-4xl font-bold leading-none mt-0.5" style={tnr}>
                      {date.day}
                    </span>
                    <span className="text-white text-xs opacity-70 mt-0.5" style={tnr}>
                      {date.year}
                    </span>
                  </div>

                  {/* Title + Status */}
                  <div className="flex flex-col justify-center gap-2 px-4 py-4 flex-1">
                    <h2 className="text-base font-bold text-black leading-snug" style={tnr}>
                      {meeting.title}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold w-fit ${cls}`}
                      style={tnr}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      {label}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col gap-4 px-5 py-4 flex-1">

                  {/* Description */}
                  {meeting.description && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2" style={tnr}>
                      {meeting.description}
                    </p>
                  )}

                  <div className="border-t border-gray-100" />

                  {/* Meta */}
                  <div className="flex flex-col gap-2">

                    {/* Time */}
                    {date.time && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <ClockIcon />
                        <span className="text-sm" style={tnr}>
                          {date.full} &middot; <span className="font-semibold text-black">{date.time}</span>
                        </span>
                      </div>
                    )}

                    {/* Branch */}
                    {meeting.branchName && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <BranchIcon />
                        <span className="text-sm" style={tnr}>{meeting.branchName}</span>
                      </div>
                    )}

                    {/* Attendees */}
                    {meeting.assign?.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <UsersIcon />
                        <span className="text-sm" style={tnr}>
                          {meeting.assign.length} attendee{meeting.assign.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* JOIN LINK */}
                  {meeting.meetingLink && (
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-black text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                      style={tnr}
                    >
                      <LinkIcon />
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}