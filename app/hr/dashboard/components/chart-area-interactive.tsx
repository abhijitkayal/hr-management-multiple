"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type ExpenseChart = {
  date: string
  total: number
}

type ExpenseRecord = {
  date?: string
  paymentDate?: string
  createdAt?: string
  paidAmount?: number | string
  amount?: number | string
  branchName?: string
}

export function ChartAreaInteractive({
  branchName: branchNameProp,
}: {
  branchName?: string
}) {
  const [data, setData] = React.useState<ExpenseChart[]>([])
  const [timeRange] = React.useState("30d")

  React.useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as {
          branchName?: string
        }

        const branchName = branchNameProp || storedUser.branchName || ""

        const res = await fetch("/api/expense")
        const json = await res.json()

        const expenses = (json.expenses || json.data || []) as ExpenseRecord[]
        const filteredExpenses = expenses.filter(
          (expense) => expense.branchName === branchName
        )

        // STEP 1: group by date
        const map = new Map<string, number>()

        filteredExpenses.forEach((expense) => {
          const rawDate = expense.date || expense.paymentDate || expense.createdAt

          if (!rawDate) return

          const date = new Date(rawDate).toISOString().split("T")[0]

          const amount = Number(expense.paidAmount || expense.amount || 0)

          map.set(date, (map.get(date) || 0) + amount)
        })

        // STEP 2: convert to array
        const chartData = Array.from(map.entries()).map(
          ([date, total]) => ({
            date,
            total,
          })
        )

        // STEP 3: sort by date
        chartData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        setData(chartData)
      } catch (err) {
        console.log("Expense chart error:", err)
      }
    }

    void fetchExpenses()
  }, [branchNameProp])

  // filter by range
  const filteredData = React.useMemo(() => {
    const now = new Date()
    let days = 30

    if (timeRange === "7d") days = 7
    if (timeRange === "90d") days = 90

    const start = new Date()
    start.setDate(now.getDate() - days)

    return data.filter((d) => new Date(d.date) >= start)
  }, [data, timeRange])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses Overview</CardTitle>
        <CardDescription>Daily expense trend</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={{}} className="h-62.5 w-full">
          <AreaChart data={filteredData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Area
              type="natural"
              dataKey="total"
              stroke="#000"
              fill="rgba(0,0,0,0.1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}