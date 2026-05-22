"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function EmployeeDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "employee") {
      router.push("/login");
      return;
    }

    const loginId = parsedUser.id || "";
    router.replace(`/employee-dashboard/${loginId}`);
  }, [router]);

  return null;
}
