"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

const TNR = {
  fontFamily:
    "'Times New Roman', Times, serif",
} as React.CSSProperties;

function StatusBadge({
  status,
}: {
  status: string;
}) {

  if (
    status === "Present"
  ) {

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700">

        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

        Present

      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-red-200 bg-red-50 text-red-600">

      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />

      Absent

    </span>
  );
}

function ModeBadge({
  mode,
}: {
  mode: string;
}) {

  const isOffice =
    mode === "Office";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
        isOffice
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-purple-200 bg-purple-50 text-purple-700"
      }`}
    >

      {mode}

    </span>
  );
}

function formatDate(
  dateStr: string
) {

  return new Date(
    dateStr
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

export default function HRAllAttendancePage() {

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    attendances,
    setAttendances,
  ] = useState<any[]>([]);
  const [
  selectedDate,
  setSelectedDate,
] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState<
    "All" |
    "Present" |
    "Absent"
  >("All");

  // FETCH ATTENDANCE
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

        // ONLY SAME BRANCH
        const filtered =
          data.attendances.filter(
            (item: any) =>
              item.branchName ===
              user.branchName
          );

        setAttendances(
          filtered
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAttendance();
  }, []);

  // FILTERED DATA
  const filteredData =
  useMemo(() => {

    let data =
      [...attendances];

    // STATUS FILTER
    if (
      filter !== "All"
    ) {

      data =
        data.filter(
          (item) =>
            item.status ===
            filter
        );
    }

    // SEARCH FILTER
    if (search) {

      data =
        data.filter(
          (item) =>

            item.employeeName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            item.employeeEmail
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
    }

    // DATE FILTER
    if (selectedDate) {

      data =
        data.filter(
          (item) => {

            const itemDate =
              new Date(
                item.createdAt
              )
                .toISOString()
                .split("T")[0];

            return (
              itemDate ===
              selectedDate
            );
          }
        );
    }

    return data;

  }, [
    attendances,
    search,
    filter,
    selectedDate,
  ]);

  const presentCount =
    filteredData.filter(
      (a) =>
        a.status ===
        "Present"
    ).length;

  const absentCount =
    filteredData.filter(
      (a) =>
        a.status ===
        "Absent"
    ).length;

  return (

    <div
      className="min-h-screen bg-transparent p-8"
      style={TNR}
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-black">
            Employee Attendance
          </h1>

          <p className="text-gray-500 mt-2">
            HR can monitor all employee attendance
          </p>

        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <p className="text-sm text-gray-400 mb-2">
              Total Records
            </p>

            <h2 className="text-4xl font-bold">
              {
                filteredData.length
              }
            </h2>

          </div>

          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm p-6">

            <p className="text-sm text-emerald-500 mb-2">
              Present
            </p>

            <h2 className="text-4xl font-bold text-emerald-700">
              {
                presentCount
              }
            </h2>

          </div>

          <div className="bg-red-50 rounded-2xl border border-red-200 shadow-sm p-6">

            <p className="text-sm text-red-500 mb-2">
              Absent
            </p>

            <h2 className="text-4xl font-bold text-red-700">
              {
                absentCount
              }
            </h2>

          </div>

        </div>

        {/* FILTER */}
        {/* FILTER */}
<div className="bg-white rounded-2xl border shadow-sm p-5 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

          {/* SEARCH */}
         {/* LEFT SIDE */}
<div className="flex flex-col md:flex-row gap-4 w-full">

  {/* SEARCH */}
  <input
    type="text"

    placeholder="Search employee..."

    value={search}

    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }

    className="border rounded-xl px-4 py-3 w-full md:w-80"
  />

  {/* DATE FILTER */}
  <input
    type="date"

    value={selectedDate}

    onChange={(e) =>
      setSelectedDate(
        e.target.value
      )
    }

    className="border rounded-xl px-4 py-3"
  />

</div>

{/* FILTER BUTTONS */}
<div className="flex gap-3">

  {[
    "All",
    "Present",
    "Absent",
  ].map((item) => (

    <button
      key={item}

      onClick={() =>
        setFilter(
          item as any
        )
      }

      className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
        filter === item
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-600"
      }`}
    >

      {item}

    </button>
  ))}

</div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

          <table className="w-full">

            <thead className="bg-black text-white">

              <tr>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Employee
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Mode
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Address
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Current Location
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-20"
                  >
                    Loading...
                  </td>

                </tr>

              ) : filteredData.length ===
                0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-20 text-gray-400"
                  >
                    No attendance records found
                  </td>

                </tr>

              ) : (

                filteredData.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* EMPLOYEE */}
                      <td className="px-5 py-4">

                        <div>

                          <p className="font-semibold text-black">
                            {
                              item.employeeName
                            }
                          </p>

                          <p className="text-xs text-gray-400">
                            {
                              item.employeeEmail
                            }
                          </p>

                        </div>

                      </td>

                      {/* MODE */}
                      <td className="px-5 py-4">

                        <ModeBadge
                          mode={
                            item.mode
                          }
                        />

                      </td>

                      {/* ADDRESS */}
                      <td className="px-5 py-4 text-sm text-gray-600">

                        {
                          item.officeAddress
                        }

                      </td>

                      {/* CURRENT LOCATION */}
                      <td className="px-5 py-4 text-sm text-gray-600">

                        {
                          item.currentLocation
                        }

                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <StatusBadge
                          status={
                            item.status
                          }
                        />

                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4 text-sm text-gray-500">

                        {
                          formatDate(
                            item.createdAt
                          )
                        }

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}