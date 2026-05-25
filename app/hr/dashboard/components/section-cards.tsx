// import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

// import { Badge } from "@/components/ui/badge"
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// export function SectionCards() {
//   return (
//     <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Total Revenue</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             $1,25.00
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingUp />
//               +12.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Trending up this month <IconTrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">
//             Visitors for the last 6 months
//           </div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>New Customers</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             1,234
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingDown />
//               -20%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Down 20% this period <IconTrendingDown className="size-4" />
//           </div>
//           <div className="text-muted-foreground">
//             Acquisition needs attention
//           </div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Active Accounts</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             45,678
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingUp />
//               +12.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Strong user retention <IconTrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Engagement exceed targets</div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Growth Rate</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             4.5%
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingUp />
//               +4.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Steady performance increase <IconTrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Meets growth projections</div>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type BranchScopedRecord = {
  branchName?: string | null
}

type ExpenseRecord = BranchScopedRecord & {
  paidAmount?: number | string | null
}

type EmployeeRecord = BranchScopedRecord & {
  status?: string | null
}

type BranchRecord = BranchScopedRecord & {
  totalBudget?: number | string | null
}

export function SectionCards({
  branchName: branchNameProp,
}: {
  branchName?: string
}) {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)

  const normalizeStatus = (value: unknown) =>
    String(value ?? "")
      .trim()
      .toLowerCase()

  // =========================
  // Fetch Branch Revenue
  // =========================
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as {
          branchName?: string
        }

        const branchName = branchNameProp || storedUser.branchName

        const res = await fetch("/api/branches")
        const data = await res.json()

        if (!data.success) {
          return
        }

        const branch = ((data.data || []) as BranchRecord[]).find(
          (item) => item.branchName === branchName
        )

        setTotalRevenue(Number(branch?.totalBudget || 0))
      } catch (error) {
        console.error("Error fetching branch revenue:", error)
      }
    }

    void fetchBranches()
  }, [branchNameProp])

  // =========================
  // Fetch Expenses
  // =========================
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as {
          branchName?: string
        }

        const branchName = branchNameProp || storedUser.branchName

        const res = await fetch("/api/expense")
        const data = await res.json()

        if (data.success) {
          const filteredExpenses = ((data.expenses || []) as ExpenseRecord[]).filter(
            (expense) => expense.branchName === branchName
          )

          setExpenses(filteredExpenses)
        }
      } catch (error) {
        console.error("Error fetching expenses:", error)
      }
    }

    void fetchExpenses()
  }, [branchNameProp])

  // =========================
  // Fetch Employees
  // =========================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as {
          branchName?: string
        }

        const branchName = branchNameProp || storedUser.branchName

        const res = await fetch("/api/employee")
        const data = await res.json()

        if (!data.success) {
          return
        }

        const branchEmployees = ((data.employees || []) as EmployeeRecord[]).filter(
          (employee) => employee.branchName === branchName
        )

        setEmployees(branchEmployees)
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }

    void fetchEmployees()
  }, [branchNameProp])

  const internCount = employees.filter(
    (employee) => normalizeStatus(employee.status) === "intern"
  ).length

  const fullTimeCount = employees.filter(
    (employee) => normalizeStatus(employee.status) === "full time"
  ).length

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.paidAmount || 0),
    0
  )
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">

      {/* First Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalRevenue.toFixed(2)}
          </CardTitle>

          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1 size-4" />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Trending up this month
            <IconTrendingUp className="size-4" />
          </div>

          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      {/* Second Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Paid Expenses</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalExpenses.toFixed(2)}
          </CardTitle>

          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingDown className="mr-1 size-4" />
              Expenses
            </Badge>
          </CardAction> */}
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Paid expenses summary
            <IconTrendingDown className="size-4" />
          </div>

          <div className="text-muted-foreground">
            Updated from expenses data
          </div>
        </CardFooter>
      </Card>

      {/* Third Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription> Total Employees</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {internCount + fullTimeCount}
          </CardTitle>

          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1 size-4" />
              Staff
            </Badge>
          </CardAction> */}
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">
            Interns: {internCount}
          </div>

          <div className="text-muted-foreground">
            Full Time: {fullTimeCount}
          </div>
        </CardFooter>
      </Card>

      {/* Fourth Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1 size-4" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Steady performance increase
            <IconTrendingUp className="size-4" />
          </div>

          <div className="text-muted-foreground">
            Meets growth projections
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}