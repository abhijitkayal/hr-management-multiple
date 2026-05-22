"use client";

import { useEffect, useState } from "react";

const TNR: React.CSSProperties = {
  fontFamily: "'Times New Roman', Times, serif",
};

const emptyForm = {
  payrollId: "",
  employeeName: "",
  email: "",
  phone: "",
  paymentSalary: "",
  paymentDate: "",
  paymentStatus: "Pending",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Pencil / Edit icon
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);


// Trash / Delete icon
function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

// X close icon
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PayrollPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [formData, setFormData] = useState(emptyForm);

  // ── FETCH ──────────────────────────────────────────────
//   const fetchPayrolls = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       const res = await fetch("/api/payroll");
//       const data = await res.json();
//       if (data.success) {
//         const filtered = data.payrolls.filter(
//           (p: any) => p.branchName === user.branchName
//         );
//         setPayrolls(filtered);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };


const fetchPayrolls = async () => {
  try {
    // GET LOGIN USER
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    // GET LOGIN USER BRANCH
    const branchName =
      user.branchName;

    const res = await fetch(
      "/api/payroll"
    );

    const data = await res.json();

    if (data.success) {

      // SHOW ONLY SAME BRANCH PAYROLL
      const filteredPayrolls =
        data.payrolls.filter(
          (payroll: any) =>
            payroll.branchName ===
            branchName
        );

      setPayrolls(
        filteredPayrolls
      );
    }
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => { fetchPayrolls(); }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── EDIT ───────────────────────────────────────────────
  const handleEdit = (p: any) => {
    setEditId(p._id);
    setFormData({
      payrollId: p.payrollId,
      employeeName: p.employeeName,
      email: p.email,
      phone: p.phone,
      paymentSalary: p.paymentSalary,
      paymentDate: p.paymentDate?.split("T")[0] ?? "",
      paymentStatus: p.paymentStatus,
    });
    setOpen(true);
  };

  // ── DELETE ─────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payroll?")) return;
    try {
      const res = await fetch(`/api/payroll/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);
      fetchPayrolls();
    } catch (err) {
      console.error(err);
    }
  };

  // ── SUBMIT ─────────────────────────────────────────────
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(
        editId ? `/api/payroll/${editId}` : "/api/payroll",
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
        fetchPayrolls();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── SUMMARY ────────────────────────────────────────────
  const totalPayment = payrolls.reduce((s, p) => s + Number(p.paymentSalary || 0), 0);
  const paidPayment  = payrolls.filter(p => p.paymentStatus === "Paid").reduce((s, p) => s + Number(p.paymentSalary || 0), 0);
  const pendingPayment = payrolls.filter(p => p.paymentStatus === "Pending").reduce((s, p) => s + Number(p.paymentSalary || 0), 0);

  const inputClass =
    "border-2 border-black bg-white text-black p-3 rounded-xl w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <div className="min-h-screen bg-white p-8" style={TNR}>
      {/* ── PAGE HEADER ─────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-black" style={TNR}>
          Payroll
        </h1>
        <button
          onClick={() => { setOpen(true); setEditId(""); setFormData(emptyForm); }}
          className="bg-black text-white px-6 py-2.5 rounded-xl text-base font-semibold hover:bg-gray-800 transition-colors"
          style={TNR}
        >
          + Add Payroll
        </button>
      </div>

      {/* ── SUMMARY CARDS ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Total */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1" style={TNR}>
            Total Payroll
          </p>
          <p className="text-3xl font-bold text-black" style={TNR}>
            ₹{totalPayment.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-1" style={TNR}>
            {payrolls.length} employee{payrolls.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Paid */}
        <div className="bg-white border-2 border-green-500 rounded-2xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1" style={TNR}>
            Paid Payment
          </p>
          <p className="text-3xl font-bold text-green-600" style={TNR}>
            ₹{paidPayment.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-1" style={TNR}>
            {payrolls.filter(p => p.paymentStatus === "Paid").length} paid
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white border-2 border-amber-500 rounded-2xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1" style={TNR}>
            Pending Payment
          </p>
          <p className="text-3xl font-bold text-amber-600" style={TNR}>
            ₹{pendingPayment.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-1" style={TNR}>
            {payrolls.filter(p => p.paymentStatus === "Pending").length} pending
          </p>
        </div>
      </div>

      {/* ── TABLE ───────────────────────────────── */}
      <div className="overflow-x-auto bg-white rounded-2xl border-2 border-black shadow-sm">
        <table className="w-full" style={TNR}>
          <thead className="bg-black text-white">
            <tr>
              {["Payroll ID", "Employee", "Email", "Phone", "Salary", "Payment Date", "Status", "Actions"].map((h) => (
                <th key={h} className="p-4 text-left text-xs uppercase tracking-wider font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {payrolls.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-gray-400 italic" style={TNR}>
                  No payroll records found.
                </td>
              </tr>
            ) : (
              payrolls.map((p, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-sm text-black">{p.payrollId}</td>
                  <td className="p-4 font-semibold text-black whitespace-nowrap">{p.employeeName}</td>
                  <td className="p-4 text-black text-sm">{p.email}</td>
                  <td className="p-4 text-black text-sm">{p.phone}</td>
                  <td className="p-4 font-semibold text-black whitespace-nowrap">
                    ₹{Number(p.paymentSalary).toLocaleString("en-IN")}
                  </td>

                  {/* Date — indigo accent */}
                  <td className="p-4 whitespace-nowrap">
                    <span    className="
      px-3 py-1
      rounded-full
      border
      border-yellow-500
      bg-yellow-500/10
      text-yellow-700
      text-sm
      font-semibold
    " style={TNR}>
                      {formatDate(p.paymentDate)}
                    </span>
                  </td>
                  

                  {/* Status badge */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wide
                        ${p.paymentStatus === "Paid"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-red-500 bg-red-50 text-red-700"
                        }`}
                      style={TNR}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>

                  {/* Icon actions */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        title="Edit"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-blue-600 transition-all"
                        style={TNR}
                      >
                        <EditIcon />
                      
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        title="Delete"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-red-600 transition-all"
                        style={TNR}
                      >
                        <DeleteIcon />
                        
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
            className="bg-white w-full max-w-2xl rounded-2xl p-8 border-2 border-black shadow-2xl"
            style={TNR}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black" style={TNR}>
                {editId ? "Edit Payroll" : "Create Payroll"}
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
                name="payrollId"
                placeholder="Payroll ID"
                value={formData.payrollId}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="text"
                name="employeeName"
                placeholder="Employee Name"
                value={formData.employeeName}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="number"
                name="paymentSalary"
                placeholder="Payment Salary (₹)"
                value={formData.paymentSalary}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className={inputClass}
                style={TNR}
                required
              />

              {/* Status select — full width */}
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className={`${inputClass} col-span-2`}
                style={TNR}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white py-3 rounded-xl col-span-2 font-semibold text-base hover:bg-gray-800 transition-colors disabled:opacity-60"
                style={TNR}
              >
                {loading
                  ? editId ? "Updating..." : "Creating..."
                  : editId ? "Update Payroll" : "Create Payroll"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}