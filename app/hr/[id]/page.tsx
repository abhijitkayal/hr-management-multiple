import { notFound } from "next/navigation";

import DashboardPage from "../dashboard/page";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export default async function HrIdPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  await connectDB();

  const user = await User.findById(id).select("branchName");

  if (!user) {
    notFound();
  }

  return <DashboardPage branchName={user.branchName || ""} />;
}