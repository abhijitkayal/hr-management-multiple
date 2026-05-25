import { ChartAreaInteractive } from "@/app/hr/dashboard/components/chart-area-interactive"
import { DataTable } from "@/app/hr/dashboard/components/data-table"
import { SectionCards } from "@/app/hr/dashboard/components/section-cards"

export default function Page({
  branchName,
}: {
  branchName?: string
}) {
  return (
    <>
      {/* <SiteHeader /> */}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards branchName={branchName} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive branchName={branchName} />
            </div>
            <DataTable branchName={branchName} />
          </div>
        </div>
      </div>
    </>
  )
}
