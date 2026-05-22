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
import { Building2, Plus, Users, Eye, X } from "lucide-react";

interface Branch {
  _id: string;
  branchName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  managerName: string;
  hrName: string;
  totalEmployees: number;
  active: boolean;
}

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [managerName, setManagerName] = useState("");
  const [hrName, setHrName] = useState("");

  async function fetchBranches() {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      if (data.success) return data.data as Branch[];
    } catch (e) { console.log(e); }
    return [] as Branch[];
  }

  useEffect(() => {
    void fetchBranches().then(setBranches);
  }, []);

  async function createBranch() {
    try {
      if (!branchName || !address) return alert("Fill all required fields");
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchName, address, phone, email, password, managerName, hrName }),
      });
      const data = await res.json();
      if (!data.success) return alert("Create failed");
      alert("Branch Created");
      setShowModal(false);
      setBranchName(""); setAddress(""); setPhone("");
      setEmail(""); setPassword(""); setManagerName(""); setHrName("");
      void fetchBranches().then(setBranches);
    } catch (e) { console.log(e); }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bp-root {
          padding: 32px;
          background: #fff;
          min-height: 100vh;
          color: #000;
          font-family: 'Outfit', sans-serif;
        }

        /* HEADER */
        .bp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .bp-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .bp-subtitle {
          color: #888;
          font-size: 13px;
        }

        .bp-create-btn {
          background: #d4841a;
          border: none;
          color: #fff;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          transition: background 0.15s, transform 0.1s;
        }

        .bp-create-btn:hover { background: #e8951f; transform: translateY(-1px); }
        .bp-create-btn:active { transform: translateY(0); }

        /* TABLE WRAPPER */
        .bp-table-wrap {
          border: 1px solid #e5e5e5;
          border-radius: 18px;
          overflow: hidden;
        }

        .bp-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bp-table thead tr {
          background: #f8f8f8;
        }

        .bp-table th {
          padding: 14px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .bp-table tbody tr {
          border-top: 1px solid #f0f0f0;
          transition: background 0.1s;
        }

        .bp-table tbody tr:hover { background: #fafafa; }

        .bp-table td {
          padding: 16px 20px;
          color: #000;
          font-size: 14px;
          vertical-align: middle;
        }

        /* Branch cell */
        .bp-branch-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bp-branch-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #d4841a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .bp-branch-name {
          font-weight: 600;
          color: #000;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .bp-branch-addr {
          font-size: 12px;
          color: #999;
        }

        .bp-employees {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #555;
          font-size: 14px;
        }

        .bp-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .bp-status-badge.active {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .bp-status-badge.inactive {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .bp-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .bp-status-dot.active { background: #16a34a; }

        .bp-status-dot.inactive { background: #dc2626; }

        .bp-view-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #e5e5e5;
          background: #fff;
          color: #2563eb;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.12s, border-color 0.12s;
        }

        .bp-view-btn:hover { background: #eff6ff; border-color: #bfdbfe; }

        /* MODAL */
        .bp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        .bp-modal {
          width: 480px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 22px;
          padding: 30px;
          animation: modalIn 0.18s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .bp-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .bp-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #000;
          letter-spacing: -0.3px;
        }

        .bp-modal-close {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          background: #fff;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.12s;
        }

        .bp-modal-close:hover { background: #f5f5f5; color: #000; }

        .bp-form-grid { display: flex; flex-direction: column; gap: 12px; }

        .bp-password-field { margin-top: 12px; }

        .bp-field-label {
          font-size: 11px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
          display: block;
        }

        .bp-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #e5e5e5;
          background: #fafafa;
          color: #000;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }

        .bp-input::placeholder { color: #bbb; }
        .bp-input:focus { border-color: #d4841a88; background: #fff; }

        .bp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .bp-submit-btn {
          width: 100%;
          background: #d4841a;
          border: none;
          padding: 13px;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          margin-top: 4px;
          transition: background 0.15s;
        }

        .bp-submit-btn:hover { background: #e8951f; }

        .bp-empty {
          padding: 60px;
          text-align: center;
          color: #ccc;
          font-size: 14px;
        }
      `}</style>

      <div className="bp-root">
        {/* HEADER */}
        <div className="bp-header">
          <div>
            <div className="bp-title">Branch Management</div>
            <div className="bp-subtitle">Manage all restaurant branches</div>
          </div>
          <button className="bp-create-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Create Branch
          </button>
        </div>

        {/* TABLE */}
        <div className="bp-table-wrap">
          <table className="bp-table">
            <thead>
              <tr>
                {["Branch", "Manager", "HR", "Phone", "Employees", "Status", "Action"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="bp-empty">No branches yet. Create your first one.</div>
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch._id}>
                    <td>
                      <div className="bp-branch-cell">
                        <div className="bp-branch-icon">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div className="bp-branch-name">{branch.branchName}</div>
                          <div className="bp-branch-addr">{branch.address}</div>
                        </div>
                      </div>
                    </td>
                    <td>{branch.managerName || "—"}</td>
                    <td>{branch.hrName || "—"}</td>
                    <td>{branch.phone || "—"}</td>
                    <td>
                      <div className="bp-employees">
                        <Users size={14} />
                        {branch.totalEmployees ?? 0}
                      </div>
                    </td>
                    <td>
                      <span className={`bp-status-badge ${branch.active ? "active" : "inactive"}`}>
                        <span className={`bp-status-dot ${branch.active ? "active" : "inactive"}`} />
                        {branch.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="bp-view-btn"
                        title="View branch"
                        onClick={() =>
                          (window.location.href = `/admin/hr-profile?branchName=${branch.branchName}`)
                        }
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="bp-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="bp-modal">
              <div className="bp-modal-head">
                <div className="bp-modal-title">Create New Branch</div>
                <button className="bp-modal-close" title="Close modal" onClick={() => setShowModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="bp-form-grid">
                <div>
                  <label className="bp-field-label">Branch Name *</label>
                  <input className="bp-input" placeholder="e.g. Downtown Branch" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
                </div>
                <div>
                  <label className="bp-field-label">Address *</label>
                  <input className="bp-input" placeholder="Full address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="bp-form-row">
                  <div>
                    <label className="bp-field-label">Phone</label>
                    <input className="bp-input" placeholder="+91 00000 00000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="bp-field-label">Email</label>
                    <input className="bp-input" placeholder="branch@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="bp-password-field">
                      <label className="bp-field-label">Password</label>
                      <input className="bp-input" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="bp-form-row">
                  <div>
                    <label className="bp-field-label">Manager Name</label>
                    <input className="bp-input" placeholder="Manager's name" value={managerName} onChange={(e) => setManagerName(e.target.value)} />
                  </div>
                  <div>
                    <label className="bp-field-label">HR Name</label>
                    <input className="bp-input" placeholder="HR's name" value={hrName} onChange={(e) => setHrName(e.target.value)} />
                  </div>
                </div>

                <button className="bp-submit-btn" onClick={createBranch}>
                  Create Branch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}