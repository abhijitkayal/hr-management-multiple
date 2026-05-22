"use client";

import { useEffect, useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className={`flex-1 rounded-2xl border ${color} p-5`}>
      <p className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <p className="text-4xl font-bold">{count}</p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function EmployeePage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    phone: "",
    emergencyPhone: "",
    salary: "",
    department: "",
    status: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // ── Fetch ──
  const fetchEmployees = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch("/api/employee");
      const data = await res.json();
      if (data.success) {
        setEmployees(
          data.employees.filter((e: any) => e.branchName === user.branchName)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  // ── Counts ──
  const total = employees.length;
  const fullTime = employees.filter((e) => e.status === "Full Time").length;
  const intern = employees.filter((e) => e.status === "Intern").length;
  const onLeave = employees.filter((e) => e.status === "Leave").length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    const res = await fetch(`/api/employee/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message);
    fetchEmployees();
  };

  // ── Edit ──
  const handleEdit = (employee: any) => {
    setEditId(employee._id);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: employee.password,
      phone: employee.phone,
      emergencyPhone: employee.emergencyPhone,
      salary: employee.salary,
      department: employee.department,
      status: employee.status,
    });
    setOpen(true);
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const hrEmail = user.email;
      const branchName = user.branchName;

      const res = await fetch(
        editId ? `/api/employee/${editId}` : "/api/employee",
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, hrEmail, branchName }),
        }
      );
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setOpen(false);
        setEditId("");
        setFormData(emptyForm);
        fetchEmployees();
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = (status: string) => {
    if (status === "Leave") return "border-red-400 bg-red-50 text-red-600";
    if (status === "Full Time") return "border-green-400 bg-green-50 text-green-600";
    return "border-blue-400 bg-blue-50 text-blue-600";
  };

  return (
    <div className="min-h-screen bg-transparent p-8" style={{ fontFamily: '"Times New Roman", Times, serif' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Employees</h1>
          <p className="text-sm text-gray-400 mt-1">{total} total members</p>
        </div>
        <button
          onClick={() => { setOpen(true); setEditId(""); setFormData(emptyForm); }}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
        >
          <PlusIcon />
          Add Employee
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-4 mb-8">
        <StatCard label="Total" count={total} color="border-gray-200 bg-white text-gray-900" />
        <StatCard label="Full Time" count={fullTime} color="border-green-200 bg-green-50 text-green-800" />
        <StatCard label="Intern" count={intern} color="border-blue-200 bg-blue-50 text-blue-800" />
        <StatCard label="On Leave" count={onLeave} color="border-red-200 bg-red-50 text-red-800" />
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          <thead>
            <tr className="bg-gray-900 text-white">
              {["Name", "Email", "Phone", "Department", "Salary", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400 italic text-base">
                  No employees found. Add your first employee.
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-gray-900">{employee.name}</td>
                  <td className="px-5 py-4 text-gray-500">{employee.email}</td>
                  <td className="px-5 py-4 text-gray-500">{employee.phone}</td>
                  <td className="px-5 py-4 text-gray-700">{employee.department}</td>
                  <td className="px-5 py-4 font-medium text-gray-800">₹{employee.salary}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusStyle(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        title="Edit"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-blue-600 transition-all"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
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
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editId ? "Edit Employee" : "Create Employee"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editId ? "Update the employee details below" : "Fill in the details to add a new employee"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              {[
                { name: "name", placeholder: "Full Name", type: "text", span: "" },
                { name: "email", placeholder: "Email Address", type: "email", span: "" },
                { name: "password", placeholder: "Password", type: "password", span: "" },
                { name: "phone", placeholder: "Phone Number", type: "text", span: "" },
                { name: "emergencyPhone", placeholder: "Emergency Phone", type: "text", span: "" },
                { name: "salary", placeholder: "Salary (₹)", type: "number", span: "" },
                { name: "department", placeholder: "Department", type: "text", span: "col-span-2" },
              ].map(({ name, placeholder, type, span }) => (
                <input
                  key={name}
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className={`border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 placeholder-gray-400 text-sm ${span}`}
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                />
              ))}

              <select
                name="status"
                value={formData.status}
                onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900 text-sm col-span-2"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                <option value="">Select Status</option>
                <option value="Full Time">Full Time</option>
                <option value="Intern">Intern</option>
                <option value="Leave">Leave</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="col-span-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {editId ? "Updating..." : "Creating..."}
                  </>
                ) : editId ? (
                  "Update Employee"
                ) : (
                  "Create Employee"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}