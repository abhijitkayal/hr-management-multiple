"use client";

import { use, useEffect, useState } from "react";

interface Job {
  _id: string;
  title: string;
  branchName: string;
  department: string;
  salary: string;
  type: string;
  status: string;
  jobType: string;
  description: string;
  skills: string;
  closingDate: string;
}

const TYPE_STYLES: Record<string, string> = {
  "full-time":  "bg-blue-100 text-blue-800 border border-blue-300",
  "part-time":  "bg-purple-100 text-purple-800 border border-purple-300",
  "contract":   "bg-amber-100 text-amber-800 border border-amber-300",
  "internship": "bg-pink-100 text-pink-800 border border-pink-300",
  "freelance":  "bg-teal-100 text-teal-800 border border-teal-300",
};

const STATUS_STYLES: Record<string, string> = {
  "open":   "bg-green-100 text-green-800 border border-green-300",
  "closed": "bg-red-100 text-red-800 border border-red-300",
  "paused": "bg-gray-100 text-gray-600 border border-gray-300",
  "draft":  "bg-yellow-100 text-yellow-800 border border-yellow-300",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getBadgeStyle(map: Record<string, string>, key: string): string {
  const normalized = (key ?? "").toLowerCase().trim();
  return (
    map[normalized] ??
    "bg-slate-100 text-slate-700 border border-slate-300"
  );
}

export default function JobPostingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const response = await fetch("/api/job");
      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <p className="text-gray-500 text-lg animate-pulse">Loading jobs…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Header */}
      <div className="mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-bold text-black tracking-tight">
          Job Postings
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Employee ID:{" "}
          <span className="text-gray-600 font-semibold">{id}</span>
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 italic">No job posts found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Title + badges row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <h2 className="text-2xl font-bold text-black leading-tight">
                  {job.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {/* Type badge */}
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${getBadgeStyle(
                      TYPE_STYLES,
                      job.type
                    )}`}
                  >
                    {job.type || "N/A"}
                  </span>
                  {/* Status badge */}
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${getBadgeStyle(
                      STATUS_STYLES,
                      job.status
                    )}`}
                  >
                    {job.status || "N/A"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed mb-5 italic">
                {job.description}
              </p>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-black">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-semibold w-24 shrink-0">
                    Location
                  </span>
                  <span>{job.branchName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-semibold w-24 shrink-0">
                    Department
                  </span>
                  <span>{job.department}</span>
                </div>

                {/* Salary — green */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-semibold w-24 shrink-0">
                    Salary
                  </span>
                  <span className="text-green-700 font-bold text-base">
                    {job.salary}
                  </span>
                </div>

                {/* Status — coloured inline */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-semibold w-24 shrink-0">
                    Status
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-xs ${getBadgeStyle(
                      STATUS_STYLES,
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Deadline — colourful */}
                <div className="flex items-center gap-2 sm:col-span-2">
                  <span className="text-gray-400 font-semibold w-24 shrink-0">
                    Deadline
                  </span>
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 rounded-md px-3 py-0.5 font-semibold text-sm">
                    📅 {formatDate(job.closingDate)}
                  </span>
                </div>
              </div>

              {/* Apply button */}
              {/* <button className="mt-6 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-150 cursor-pointer">
                Apply Now
              </button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}