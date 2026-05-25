// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   Building2,
//   Plus,
//   Users,
//   Eye,
// } from "lucide-react";
// import { SiteHeader } from "../dashboard/components/site-header";
// import { AppSidebar } from "../dashboard/components/app-sidebar";

// interface Branch {
//   _id: string;

//   branchName: string;

//   address: string;

//   phone: string;

//   email: string;

//   managerName: string;

//   hrName: string;

//   totalEmployees: number;

//   active: boolean;
// }

// export default function BranchPage() {
//   const [branches, setBranches] =
//     useState<Branch[]>([]);

//   const [showModal, setShowModal] =
//     useState(false);

//   const [branchName, setBranchName] =
//     useState("");

//   const [address, setAddress] =
//     useState("");

//   const [phone, setPhone] =
//     useState("");

//   const [email, setEmail] =
//     useState("");

//   const [managerName, setManagerName] =
//     useState("");

//   const [hrName, setHrName] =
//     useState("");

//   async function loadBranches() {
//     try {
//       const response =
//         await fetch(
//           "/api/branches"
//         );

//       const data =
//         await response.json();

//       if (data.success) {
//         setBranches(data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     loadBranches();
//   }, []);

//   async function createBranch() {
//     try {
//       if (
//         !branchName ||
//         !address
//       ) {
//         return alert(
//           "Fill all required fields"
//         );
//       }

//       const response =
//         await fetch(
//           "/api/branches",
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({
//               branchName,
//               address,
//               phone,
//               email,
//               managerName,
//               hrName,
//             }),
//           }
         
//         );
//          console.log("hi");
//       const data =
//         await response.json();
//         console.log(data);

//       if (!data.success) {
//         console.log(data);
//         return alert(
//           "Create failed"
//         );
//       }

//       alert(
//         "Branch Created"
//       );

//       setShowModal(false);

//       setBranchName("");
//       setAddress("");
//       setPhone("");
//       setEmail("");
//       setManagerName("");
//       setHrName("");

//       loadBranches();
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <>
    
//     <div
//       style={{
//         padding: "30px",
//         color: "#fff",
//       }}
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent:
//             "space-between",
//           alignItems: "center",
//           marginBottom: "30px",
//         }}
//       >
//         <div>
//           <h1
//             style={{
//               fontSize: "34px",
//             }}
//           >
//             Branch Management
//           </h1>

//           <p
//             style={{
//               color: "#777",
//             }}
//           >
//             Manage all branches
//           </p>
//         </div>

//         <button
//           onClick={() =>
//             setShowModal(true)
//           }
//           style={{
//             background:
//               "#d4841a",
//             border: "none",
//             color: "#fff",
//             padding:
//               "14px 20px",
//             borderRadius:
//               "14px",
//             cursor: "pointer",
//             display: "flex",
//             alignItems:
//               "center",
//             gap: "10px",
//           }}
//         >
//           <Plus size={18} />
//           Create Branch
//         </button>
//       </div>

//       {/* TABLE */}

//       <div
//         style={{
//           overflowX: "auto",
//           border:
//             "1px solid #222",
//           borderRadius: "20px",
//         }}
//       >
//         <table
//           style={{
//             width: "100%",
//             borderCollapse:
//               "collapse",
//           }}
//         >
//           <thead>
//             <tr
//               style={{
//                 background:
//                   "#111",
//               }}
//             >
//               {[
//                 "Branch",
//                 "Manager",
//                 "HR",
//                 "Phone",
//                 "Employees",
//                 "Status",
//                 "Action",
//               ].map((item) => (
//                 <th
//                   key={item}
//                   style={{
//                     padding:
//                       "18px",
//                     textAlign:
//                       "left",
//                     color: "#888",
//                   }}
//                 >
//                   {item}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {branches.map(
//               (branch) => (
//                 <tr
//                   key={branch._id}
//                   style={{
//                     borderTop:
//                       "1px solid #222",
//                   }}
//                 >
//                   <td
//                     style={
//                       tableData
//                     }
//                   >
//                     <div
//                       style={{
//                         display:
//                           "flex",
//                         alignItems:
//                           "center",
//                         gap: "12px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width:
//                             "46px",
//                           height:
//                             "46px",
//                           borderRadius:
//                             "14px",
//                           background:
//                             "#d4841a",
//                           display:
//                             "flex",
//                           alignItems:
//                             "center",
//                           justifyContent:
//                             "center",
//                         }}
//                       >
//                         <Building2 />
//                       </div>

//                       <div>
//                         <h4>
//                           {
//                             branch.branchName
//                           }
//                         </h4>

//                         <p
//                           style={{
//                             color:
//                               "#777",
//                             fontSize:
//                               "13px",
//                           }}
//                         >
//                           {
//                             branch.address
//                           }
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td
//                     style={
//                       tableData
//                     }
//                   >
//                     {
//                       branch.managerName
//                     }
//                   </td>

//                   <td
//                     style={
//                       tableData
//                     }
//                   >
//                     {
//                       branch.hrName
//                     }
//                   </td>

//                   <td
//                     style={
//                       tableData
//                     }
//                   >
//                     {
//                       branch.phone
//                     }
//                   </td>

//                   <td
//                     style={
//                       tableData
//                     }
//                   >
//                     <div
//                       style={{
//                         display:
//                           "flex",
//                         alignItems:
//                           "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <Users
//                         size={16}
//                       />

//                       {
//                         branch.totalEmployees
//                       }
//                     </div>
//                   </td>

//                   <td
//                     style={
//                       tableData
//                     }
//                   >
//                     <span
//                       style={{
//                         background:
//                           branch.active
//                             ? "#052e16"
//                             : "#450a0a",

//                         color:
//                           branch.active
//                             ? "#22c55e"
//                             : "#ef4444",

//                         padding:
//                           "6px 12px",

//                         borderRadius:
//                           "999px",

//                         fontSize:
//                           "13px",
//                       }}
//                     >
//                       {branch.active
//                         ? "Active"
//                         : "Inactive"}
//                     </span>
//                   </td>

//                   <td
//                     style={
//                       tableData
//                     }
//                   >
//                     <button
//                       onClick={() =>
//                         window.location.href = `/admin/hr-profile?branchName=${branch.branchName}`
//                       }
//                       style={{
//                         width:
//                           "42px",
//                         height:
//                           "42px",
//                         borderRadius:
//                           "12px",
//                         border:
//                           "none",
//                         background:
//                           "#2563eb",
//                         color:
//                           "#fff",
//                         cursor:
//                           "pointer",
//                         display:
//                           "flex",
//                         alignItems:
//                           "center",
//                         justifyContent:
//                           "center",
//                       }}
//                     >
//                       <Eye
//                         size={18}
//                       />
//                     </button>
//                   </td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* MODAL */}

//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100vh",
//             background:
//               "rgba(0,0,0,0.7)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent:
//               "center",
//             zIndex: 999,
//           }}
//         >
//           <div
//             style={{
//               width: "500px",
//               background:
//                 "#111",
//               padding: "24px",
//               borderRadius:
//                 "24px",
//               display: "grid",
//               gap: "14px",
//             }}
//           >
//             <h2>
//               Create Branch
//             </h2>

//             <input
//               placeholder="Branch Name"
//               value={branchName}
//               onChange={(e) =>
//                 setBranchName(
//                   e.target.value
//                 )
//               }
//               style={inputStyle}
//             />

//             <input
//               placeholder="Address"
//               value={address}
//               onChange={(e) =>
//                 setAddress(
//                   e.target.value
//                 )
//               }
//               style={inputStyle}
//             />

//             <input
//               placeholder="Phone"
//               value={phone}
//               onChange={(e) =>
//                 setPhone(
//                   e.target.value
//                 )
//               }
//               style={inputStyle}
//             />

//             <input
//               placeholder="Email"
//               value={email}
//               onChange={(e) =>
//                 setEmail(
//                   e.target.value
//                 )
//               }
//               style={inputStyle}
//             />

//             <input
//               placeholder="Manager Name"
//               value={managerName}
//               onChange={(e) =>
//                 setManagerName(
//                   e.target.value
//                 )
//               }
//               style={inputStyle}
//             />

//             <input
//               placeholder="HR Name"
//               value={hrName}
//               onChange={(e) =>
//                 setHrName(
//                   e.target.value
//                 )
//               }
//               style={inputStyle}
//             />

//             <button
//               onClick={
//                 createBranch
//               }
//               style={{
//                 background:
//                   "#d4841a",
//                 border: "none",
//                 padding:
//                   "14px",
//                 borderRadius:
//                   "14px",
//                 color: "#fff",
//                 cursor:
//                   "pointer",
//               }}
//             >
//               Create Branch
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//     </>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "14px",
//   borderRadius: "14px",
//   border: "1px solid #333",
//   background: "#000",
//   color: "#fff",
// };

// const tableData = {
//   padding: "18px",
// };



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, Users, Eye, X, MapPin, Phone, Mail, Lock, User, Trash2, Pencil } from "lucide-react";

const TNR = { fontFamily: "'Times New Roman', Times, serif" } as React.CSSProperties;

interface Branch {
  _id: string;
  branchName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  // managerName: string;
  hrName: string;
  totalEmployees: number;
  active: boolean;
  totalBudget: number;
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700" style={TNR}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-red-200 bg-red-50 text-red-600" style={TNR}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Inactive
    </span>
  );
}

export default function BranchPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [managerName, setManagerName] = useState("");
  const [hrName, setHrName] = useState("");
  const [creating, setCreating] = useState(false);
  const [totalBudget, setTotalBudget] = useState("");
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const isEditing = editingBranchId !== null;

  function resetForm() {
    setShowModal(false);
    setEditingBranchId(null);
    setBranchName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setPassword("");
    setHrName("");
    setTotalBudget("");
  }

  function openCreateModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(branch: Branch) {
    setEditingBranchId(branch._id);
    setBranchName(branch.branchName);
    setAddress(branch.address);
    setPhone(branch.phone);
    setEmail(branch.email);
    setPassword(branch.password || "");
    setHrName(branch.hrName);
    setTotalBudget(String(branch.totalBudget || 0));
    setShowModal(true);
  }

  async function fetchBranches() {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      if (data.success) return data.data as Branch[];
    } catch (e) { console.log(e); }
    return [] as Branch[];
  }

  useEffect(() => { void fetchBranches().then(setBranches); }, []);

  async function saveBranch() {
    if (!branchName || !address) return alert("Fill all required fields");
    try {
      setCreating(true);
      const res = await fetch(
        isEditing ? `/api/branches/${editingBranchId}` : "/api/branches",
        {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchName,
          address,
          phone,
          email,
          password,
          hrName,
          totalBudget: Number(totalBudget || 0),
        }),
        }
      );
      const data = await res.json();
      if (!data.success) return alert(isEditing ? "Update failed" : "Create failed");
      alert(isEditing ? "Branch Updated" : "Branch Created");
      resetForm();
      void fetchBranches().then(setBranches);
    } catch (e) { console.log(e); }
    finally { setCreating(false); }
  }

  async function openHrDashboard(branchNameToFind: string) {
    try {
      const response = await fetch(
        `/api/hr-profile?branchName=${encodeURIComponent(branchNameToFind)}`
      );

      const data = await response.json();

      if (!data.success || !data.hrUserId) {
        alert(data.message || "HR profile not found");
        return;
      }

      router.push(`/hr/${data.hrUserId}`);
    } catch (error) {
      console.log(error);
      alert("Unable to open HR dashboard");
    }
  }

  const active   = branches.filter((b) => b.active).length;
  const inactive = branches.filter((b) => !b.active).length;

  return (
    <>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}@keyframes spin{to{transform:rotate(360deg)}}.anim-fadeUp{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}.anim-scaleIn{animation:scaleIn .25s cubic-bezier(.22,1,.36,1) both}.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}`}</style>

      <div className="min-h-screen bg-white px-6 py-8" style={TNR}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 anim-fadeUp">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1" style={TNR}>
              Admin Panel
            </p>
            <h1 className="text-4xl font-bold text-black leading-none mb-1" style={{ ...TNR, letterSpacing: "-0.02em" }}>
              Branch Management
            </h1>
            <p className="text-sm text-gray-400 mt-1" style={TNR}>
              {branches.length} total branch{branches.length !== 1 ? "es" : ""}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-gray-900 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200"
            style={TNR}
          >
            <Plus size={15} strokeWidth={2.5} />
            Create Branch
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-3 gap-4 mb-8 anim-fadeUp" style={{ animationDelay: "0.1s" }}>
          {[
            { label: "Total Branches",  value: branches.length, border: "border-gray-200",   bg: "bg-white",        num: "text-black"        },
            { label: "Active Branches", value: active,          border: "border-emerald-200", bg: "bg-emerald-50",   num: "text-emerald-700"  },
            { label: "Inactive",        value: inactive,        border: "border-red-200",     bg: "bg-red-50",       num: "text-red-700"      },
          ].map((c) => (
            <div key={c.label} className={`rounded-2xl border ${c.border} ${c.bg} px-6 py-5 shadow-sm`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2" style={TNR}>{c.label}</p>
              <p className={`text-4xl font-bold ${c.num}`} style={TNR}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm anim-fadeUp" style={{ animationDelay: "0.2s" }}>
          <table className="w-full text-sm" style={TNR}>
            <thead>
              <tr className="bg-black text-white">
                {["Branch", "HR", "Contact", "Employees", "Status", "Action"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em]" style={TNR}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <Building2 size={24} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-medium" style={TNR}>No branches yet</p>
                      <p className="text-gray-300 text-xs" style={TNR}>Click Create Branch to add your first one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                branches.map((branch, i) => (
                  <tr
                    key={branch._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {/* Branch name + address */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                          <Building2 size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-black text-sm" style={TNR}>{branch.branchName}</p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1" style={TNR}>
                            <MapPin size={10} />
                            {branch.address}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Manager */}
                    {/* <td className="px-5 py-4">
                      {branch.managerName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-blue-700" style={TNR}>
                              {branch.managerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-700 text-sm" style={TNR}>{branch.managerName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm" style={TNR}>—</span>
                      )}
                    </td> */}

                    {/* HR */}
                    <td className="px-5 py-4">
                      {branch.hrName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-purple-700" style={TNR}>
                              {branch.hrName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-700 text-sm" style={TNR}>{branch.hrName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm" style={TNR}>—</span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        {branch.phone && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-500" style={TNR}>
                            <Phone size={10} className="text-gray-400" />
                            {branch.phone}
                          </span>
                        )}
                        {branch.email && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-500" style={TNR}>
                            <Mail size={10} className="text-gray-400" />
                            {branch.email}
                          </span>
                        )}
                        {!branch.phone && !branch.email && (
                          <span className="text-gray-300 text-sm" style={TNR}>—</span>
                        )}
                      </div>
                    </td>

                    {/* Employees */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                          <Users size={13} className="text-amber-500" />
                        </div>
                        <span className="font-semibold text-gray-700 text-sm" style={TNR}>
                          {branch.totalEmployees ?? 0}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge active={branch.active} />
                    </td>

                    {/* Action */}
                    {/* <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          void openHrDashboard(branch.branchName);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-blue-600 text-xs font-semibold hover:bg-blue-50 hover:border-blue-200 transition-all duration-150"
                        style={TNR}
                      >
                        <Eye size={13} />
                        View
                      </button> */}
                      <td className="px-5 py-4">
  <div className="flex gap-2">
    
    {/* VIEW */}
    <button
      onClick={() => openHrDashboard(branch.branchName)}
      className="px-3 py-2 rounded-xl border text-blue-600 text-xs font-semibold hover:bg-blue-50"
    >
      <Eye size={13} />
    </button>

    {/* EDIT */}
    <button
      onClick={() => openEditModal(branch)}
      className="px-3 py-2 rounded-xl border text-green-600 text-xs font-semibold hover:bg-green-50"
    >
        <Pencil size={13} />
    </button>

    {/* DELETE */}
    <button
      onClick={async () => {
        if (!confirm("Are you sure you want to delete this branch?")) return;

        const res = await fetch(`/api/branches/${branch._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (data.success) {
          setBranches((prev) =>
            prev.filter((b) => b._id !== branch._id)
          );
        } else {
          await fetchBranches().then(setBranches);
          alert(data.message || "Delete failed");
        }
      }}
      className="px-3 py-2 rounded-xl border text-red-600 text-xs font-semibold hover:bg-red-50"
    >
      <Trash2 size={13} />
    </button>

  </div>
</td>
                    {/* </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Create Branch Modal ── */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
          >
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden anim-scaleIn" style={TNR}>

              {/* Top accent */}
              <div className="h-1.5 w-full bg-black" />

              <div className="p-7">
                {/* Modal header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-black leading-tight" style={{ ...TNR, letterSpacing: "-0.02em" }}>
                        {isEditing ? "Edit Branch" : "Create Branch"}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5" style={TNR}>{isEditing ? "Update the branch details below" : "Fill in the details below"}</p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    aria-label="Close modal"
                    title="Close modal"
                    className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-black transition-all"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6" />

                {/* Form */}
                <div className="flex flex-col gap-4">

                  {/* Section: Identity */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400" style={TNR}>Branch Identity</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Branch Name *" icon={<Building2 size={13}/>}>
                      <input
                        className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50 px-4 pl-9 text-sm text-black placeholder-gray-300 outline-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                        placeholder="e.g. Downtown Branch"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        style={TNR}
                      />
                    </FormField>
                    <FormField label="Address *" icon={<MapPin size={13}/>}>
                      <input
                        className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50 px-4 pl-9 text-sm text-black placeholder-gray-300 outline-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                        placeholder="Full address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={TNR}
                      />
                    </FormField>
                  </div>

                  {/* Section: Contact */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 mt-1" style={TNR}>Contact & Access</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Phone" icon={<Phone size={13}/>}>
                      <input
                        className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50 px-4 pl-9 text-sm text-black placeholder-gray-300 outline-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                        placeholder="+91 00000 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={TNR}
                      />
                    </FormField>
                    <FormField label="Email" icon={<Mail size={13}/>}>
                      <input
                        className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50 px-4 pl-9 text-sm text-black placeholder-gray-300 outline-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                        placeholder="branch@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={TNR}
                      />
                    </FormField>
                  </div>
                  <FormField label="Password" icon={<Lock size={13}/>}>
                    <input
                      type="password"
                      className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50 px-4 pl-9 text-sm text-black placeholder-gray-300 outline-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={TNR}
                    />
                  </FormField>

                  {/* Section: People */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 mt-1" style={TNR}>People</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* <FormField label="Manager Name" icon={<User size={13}/>}>
                      <input
                        className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50 px-4 pl-9 text-sm text-black placeholder-gray-300 outline-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                        placeholder="Manager's full name"
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        style={TNR}
                      />
                    </FormField> */}
                    <FormField label="HR Name" icon={<User size={13}/>}>
                      <input
                        className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50 px-4 pl-9 text-sm text-black placeholder-gray-300 outline-none transition-all focus:border-black focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                        placeholder="HR's full name"
                        value={hrName}
                        onChange={(e) => setHrName(e.target.value)}
                        style={TNR}
                      />
                    </FormField>
                    <FormField label="Total Budget" icon={<Building2 size={13} />}>
  <input
    type="number"
    className="w-full h-11 border border-gray-200 rounded-xl bg-gray-50 px-4 pl-9 text-sm text-black"
    placeholder="Enter total budget"
    value={totalBudget}
    onChange={(e) => setTotalBudget(e.target.value)}
    style={TNR}
  />
</FormField>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={saveBranch}
                    disabled={creating}
                    className="w-full h-12 bg-black text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    style={TNR}
                  >
                    {creating ? (
                      <><div className="spinner" aria-hidden="true" /> {isEditing ? "Saving…" : "Creating…"}</>
                    ) : (
                      <>{isEditing ? <Pencil size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />} {isEditing ? "Update Branch" : "Create Branch"}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Reusable field wrapper ──────────────────────────────────────────────────────
function FormField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-1.5"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}