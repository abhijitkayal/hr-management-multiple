"use client";

import { use, useEffect, useState } from "react";

interface Payroll {
  _id: string;
  employeeName: string;
  email: string;
  branchName: string;
  paymentSalary: number;
  paymentDate: string;
  paymentStatus: string;
}

const tnr = { fontFamily: "'Times New Roman', Times, serif" } as React.CSSProperties;

function formatDate(dateStr: string) {
  if (!dateStr) return { day: "—", month: "", year: "", full: "" };
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    year: d.toLocaleDateString("en-GB", { year: "numeric" }),
    full: d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
  };
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    Paid:     { cls: "border-emerald-400 bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
    Pending:  { cls: "border-orange-400 bg-orange-50 text-orange-600",   dot: "bg-orange-500"  },
    Failed:   { cls: "border-red-400 bg-red-50 text-red-600",             dot: "bg-red-500"     },
    Held:     { cls: "border-yellow-400 bg-yellow-50 text-yellow-600",   dot: "bg-yellow-500"  },
  };
  const { cls, dot } = map[status] ?? { cls: "border-gray-300 bg-gray-50 text-gray-500", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cls}`} style={tnr}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

const calColors = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-orange-500", "bg-pink-500", "bg-cyan-500",
  "bg-red-500",    "bg-amber-500",
];

// Icons
const EmailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
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

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function PayrollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayrolls(); }, []);

  async function fetchPayrolls() {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const response = await fetch("/api/payroll");
      const data = await response.json();
      const filtered = data.payrolls.filter(
        (p: Payroll) =>
          p.email === user.email &&
          p.branchName?.toLowerCase() === user.branchName?.toLowerCase()
      );
      setPayrolls(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Stats
  const totalSalary = payrolls.reduce((s, p) => s + (p.paymentSalary || 0), 0);
  const paidCount    = payrolls.filter(p => p.paymentStatus === "Paid").length;
  const pendingCount = payrolls.filter(p => p.paymentStatus === "Pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={tnr}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-base">Loading payroll...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6" style={tnr}>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black tracking-tight" style={tnr}>My Payroll</h1>
        <p className="text-gray-400 mt-1 text-sm" style={tnr}>
          Employee ID: <span className="text-gray-600 font-semibold">{id}</span>
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1" style={tnr}>Total Records</p>
          <p className="text-4xl font-bold text-black" style={tnr}>{payrolls.length}</p>
        </div>
        <div className="border border-violet-200 rounded-2xl p-5 bg-white shadow-sm col-span-1">
          <p className="text-xs uppercase tracking-widest text-violet-500 font-semibold mb-1" style={tnr}>Total Earned</p>
          <p className="text-3xl font-bold text-violet-600" style={tnr}>
            ₹{totalSalary.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="border border-emerald-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-emerald-500 font-semibold mb-1" style={tnr}>Paid</p>
          <p className="text-4xl font-bold text-emerald-600" style={tnr}>{paidCount}</p>
        </div>
        <div className="border border-orange-200 rounded-2xl p-5 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-1" style={tnr}>Pending</p>
          <p className="text-4xl font-bold text-orange-500" style={tnr}>{pendingCount}</p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {payrolls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-200 rounded-2xl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mb-4">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          <p className="text-gray-400 text-lg font-semibold" style={tnr}>No payroll records found</p>
          <p className="text-gray-300 text-sm mt-1" style={tnr}>Your salary slips will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {payrolls.map((payroll, index) => {
            const date = formatDate(payroll.paymentDate);
            const calColor = calColors[index % calColors.length];

            return (
              <div
                key={payroll._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
              >
                {/* Card Top: Calendar + Name */}
                <div className="flex items-stretch">
                  {/* Colorful date block */}
                  <div className={`${calColor} flex flex-col items-center justify-center px-5 py-4 min-w-[80px] shrink-0`}>
                    <span className="text-white text-xs font-bold uppercase tracking-widest opacity-80" style={tnr}>{date.month}</span>
                    <span className="text-white text-4xl font-bold leading-none mt-0.5" style={tnr}>{date.day}</span>
                    <span className="text-white text-xs opacity-70 mt-0.5" style={tnr}>{date.year}</span>
                  </div>

                  {/* Name + Status */}
                  <div className="flex flex-col justify-center gap-2 px-4 py-4 flex-1">
                    <h2 className="text-base font-bold text-black leading-snug" style={tnr}>
                      {payroll.employeeName}
                    </h2>
                    <StatusBadge status={payroll.paymentStatus} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col gap-3 px-5 py-4">

                  {/* Salary highlight */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold" style={tnr}>Salary</span>
                    <span className="text-xl font-bold text-black" style={tnr}>
                      ₹{Number(payroll.paymentSalary).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Meta */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <EmailIcon />
                      <span className="text-sm text-gray-600 truncate" style={tnr}>{payroll.email}</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-gray-400">
                      <BranchIcon />
                      <span className="text-sm text-gray-600" style={tnr}>{payroll.branchName}</span>
                    </div> */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarIcon />
                      <span className="text-sm text-gray-600" style={tnr}>{date.full}</span>
                    </div>
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