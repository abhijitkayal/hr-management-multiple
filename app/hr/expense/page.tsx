"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  department: "",
  totalAmount: "",
  paidAmount: "",
  paymentDate: "",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Pencil icon
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// Trash icon
function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

export default function ExpensePage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [formData, setFormData] = useState(emptyForm);

//   const fetchExpenses = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       const branchName = user.branchName;
//       const res = await fetch("/api/expense");
//       const data = await res.json();
//       if (data.success) {
//         const filtered = data.expenses.filter(
//           (expense: any) => expense.branchName === branchName
//         );
//         setExpenses(filtered);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };


const fetchExpenses = async () => {
  try {
    // GET LOGIN USER
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    // GET LOGIN USER BRANCH
    const branchName =
      user.branchName;

    const res = await fetch(
      "/api/expense"
    );

    const data = await res.json();

    if (data.success) {

      // SHOW ONLY SAME BRANCH DATA
      const filteredExpenses =
        data.expenses.filter(
          (expense: any) =>
            expense.branchName ===
            branchName
        );

      setExpenses(
        filteredExpenses
      );
    }
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (expense: any) => {
    setEditId(expense._id);
    setFormData({
      department: expense.department,
      totalAmount: expense.totalAmount,
      paidAmount: expense.paidAmount,
      paymentDate: expense.paymentDate?.split("T")[0],
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = confirm("Are you sure?");
      if (!confirmDelete) return;
      const res = await fetch(`/api/expense/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(editId ? `/api/expense/${editId}` : "/api/expense", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          branchName: user.branchName,
          createdBy: user.email,
        }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setOpen(false);
        setEditId("");
        setFormData(emptyForm);
        fetchExpenses();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Summary totals
  const totalPayment = expenses.reduce((sum, e) => sum + Number(e.totalAmount || 0), 0);
  const paidPayment = expenses.reduce((sum, e) => sum + Number(e.paidAmount || 0), 0);
  const duePayment = expenses.reduce((sum, e) => sum + Number(e.dueAmount || 0), 0);

  return (
    <div
      className="min-h-screen bg-white p-8"
      style={{ fontFamily: "'Times New Roman', Times, serif", color: "#000" }}
    >
      {/* TOP */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          Expenses
        </h1>
        <button
          onClick={() => { setOpen(true); setEditId(""); setFormData(emptyForm); }}
          className="bg-black text-white px-6 py-2.5 rounded-xl text-base font-semibold hover:bg-gray-800 transition-colors"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          + Add Expense
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Total */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            Total Payment
          </p>
          <p className="text-3xl font-bold text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            ₹{totalPayment.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Paid */}
        <div className="bg-white border-2 border-green-500 rounded-2xl p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            Paid Payment
          </p>
          <p className="text-3xl font-bold text-green-600" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            ₹{paidPayment.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Due */}
        <div className="bg-white border-2 border-red-500 rounded-2xl p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            Due Payment
          </p>
          <p className="text-3xl font-bold text-red-600" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            ₹{duePayment.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl border-2 shadow-sm">
        <table className="w-full" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <thead className="bg-black text-white">
            <tr>
              {["Department", "Total", "Paid", "Due", "Payment Date", "Status", "Actions"].map((h) => (
                <th key={h} className="p-4 text-left text-sm uppercase tracking-wider font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-black">{expense.department}</td>

                  <td className="p-4 font-semibold text-black">
                    ₹{Number(expense.totalAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 font-semibold text-green-600">
                    ₹{Number(expense.paidAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 font-semibold text-red-600">
                    ₹{Number(expense.dueAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">
  <span
    className="
      px-3 py-1
      rounded-full
      border
      border-yellow-500
      bg-yellow-500/10
      text-yellow-700
      text-sm
      font-semibold
    "
  >
    {formatDate(
      expense.paymentDate
    )}
  </span>
</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full border text-sm font-semibold
                        ${expense.status === "Paid"
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-red-500 bg-red-50 text-red-600"
                        }`}
                    >
                      {expense.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        title="Edit"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-blue-600 transition-all"
                      >
                        <EditIcon />
                       
                      </button>

                      <button
                        onClick={() => handleDelete(expense._id)}
                        title="Delete"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-red-600 transition-all"
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

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl p-8 border-2 border-black shadow-2xl"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">
                {editId ? "Edit Expense" : "Create Expense"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-black hover:text-gray-500 text-2xl leading-none font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black col-span-1"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              />

              <input
                type="number"
                name="totalAmount"
                placeholder="Total Amount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black col-span-1"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              />

              <input
                type="number"
                name="paidAmount"
                placeholder="Paid Amount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black col-span-1"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              />

              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-black col-span-1"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white py-3 rounded-xl col-span-2 font-semibold text-base hover:bg-gray-800 transition-colors disabled:opacity-60"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                {loading
                  ? editId ? "Updating..." : "Creating..."
                  : editId ? "Update Expense" : "Create Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}