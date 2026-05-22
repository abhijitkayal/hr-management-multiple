"use client";

import {
  useEffect,
} from "react";

import { useRouter } from "next/navigation";

export default function HRPage() {
  const router =
    useRouter();

  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (!storedUser) {
      router.push("/login");

      return;
    }

    const parsedUser =
      JSON.parse(storedUser);

    // ROLE CHECK
    if (
      parsedUser.role !==
      "hr"
    ) {
      router.push("/login");

      return;
    }

    const loginId = parsedUser.id || "";

    router.replace(`/hr/${loginId}`);
  }, [router]);

  return null;
}