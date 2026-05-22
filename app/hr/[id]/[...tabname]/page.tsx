import { notFound } from "next/navigation";

import DashboardPage from "../../dashboard/page";
import EmployeePage from "../../employee/page";
import ExpensePage from "../../expense/page";
import EventMeetingPage from "../../eventmeeting/page";
import InterviewPage from "../../interview/page";
import JobPostingPage from "../../jobposting/page";
import PayrollPage from "../../payroll/page";
import TasksPage from "../../tasks/page";
import TrainingPage from "../../training/page";

const tabMap = {
  dashboard: DashboardPage,
  employee: EmployeePage,
  expense: ExpensePage,
  eventmeeting: EventMeetingPage,
  interview: InterviewPage,
  jobposting: JobPostingPage,
  payroll: PayrollPage,
  tasks: TasksPage,
  training: TrainingPage,
} as const;

export default function HrTabRoute({
  params,
}: {
  params: {
    id: string;
    tabname?: string[];
  };
}) {
  const tab = params.tabname?.[0] || "dashboard";
  const TabPage = tabMap[tab as keyof typeof tabMap];

  if (!TabPage) {
    notFound();
  }

  return <TabPage />;
}