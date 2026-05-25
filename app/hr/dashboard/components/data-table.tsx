"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table"

import * as ReactTableUI from "@/components/ui/table"

// ---------------- TYPE ----------------
type Employee = {
  id: string | number
  name: string
  email: string
  phone: string
  department: string
  salary: string
  status: string
  branchName?: string
}

type EmployeeResponse = {
  _id: string
  name?: string
  email?: string
  phone?: string
  department?: string
  salary?: number | string
  status?: string
  branchName?: string
}

// ---------------- STATUS FIX ----------------
const formatStatus = (status?: string) => {
  const s = (status || "").trim().toLowerCase()

  if (s === "intern" || s === "internship") return "Intern"
  if (s === "leave") return "Leave"
  if (s === "full time" || s === "fulltime") return "Full Time"

  return status || "Unknown"
}

// ---------------- DRAG HANDLE ----------------
function DragHandle({ id }: { id: string | number }) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <button {...attributes} {...listeners} className="cursor-grab">
      ⠿
    </button>
  )
}

// ---------------- COLUMNS ----------------
const columns: ColumnDef<Employee>[] = [
  {
    id: "drag",
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "salary", header: "Salary" },
  { accessorKey: "status", header: "Status" },
]

// ---------------- ROW ----------------
function TableRowComponent({ row }: { row: Row<Employee> }) {
  const { setNodeRef, transform, transition } = useSortable({
    id: row.original.id,
  })

  return (
    <ReactTableUI.TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <ReactTableUI.TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </ReactTableUI.TableCell>
      ))}
    </ReactTableUI.TableRow>
  )
}

// ---------------- MAIN COMPONENT ----------------
export function DataTable({
  branchName: branchNameProp,
}: {
  branchName?: string
}) {
  const [data, setData] = React.useState<Employee[]>([])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  // ---------------- FETCH + FILTER ----------------
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as {
          branchName?: string
        }
        const userBranch = (branchNameProp || storedUser.branchName || "")
          .trim()
          .toLowerCase()

        const res = await fetch("/api/employee")
        const json = await res.json()

        const employees = (json.employees || []) as EmployeeResponse[]

        const filtered = employees.filter(
          (e) =>
            (e.branchName || "").trim().toLowerCase() === userBranch
        )

        const formatted = filtered.map((e) => ({
          id: e._id,
          name: e.name || "Unknown",
          email: e.email || "-",
          phone: e.phone || "-",
          department: e.department || "-",
          salary: `₹${e.salary || 0}`,
          status: formatStatus(e.status),
        }))

        setData(formatted)
      } catch (err) {
        console.log("Fetch error:", err)
      }
    }

    void fetchEmployees()
  }, [branchNameProp])

  // ---------------- TABLE ----------------
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          <ReactTableUI.Table>
            <ReactTableUI.TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <ReactTableUI.TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <ReactTableUI.TableHead key={h.id}>
                      {flexRender(
                        h.column.columnDef.header,
                        h.getContext()
                      )}
                    </ReactTableUI.TableHead>
                  ))}
                </ReactTableUI.TableRow>
              ))}
            </ReactTableUI.TableHeader>

            <ReactTableUI.TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <ReactTableUI.TableRow>
                  <ReactTableUI.TableCell colSpan={7}>
                    No Data Found
                  </ReactTableUI.TableCell>
                </ReactTableUI.TableRow>
              ) : (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <TableRowComponent key={row.id} row={row} />
                  ))
              )}
            </ReactTableUI.TableBody>
          </ReactTableUI.Table>
        </SortableContext>
      </DndContext>
    </div>
  )
}