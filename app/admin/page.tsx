"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import Page from "./dashboard/page";

export default function AdminPage() {
  const router =
    useRouter();

  const [user, setUser] =
    useState<any>(null);

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
      "admin"
    ) {
      router.push("/login");

      return;
    }

    setUser(parsedUser);
  }, []);

  return (
    <>
   
    <Page/>
    {/* <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        padding: "40px",
      }}
    >
      <h1>
        Admin Dashboard
      </h1>

      <br />

      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#d4841a",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          {user?.avatar}
        </div>

        <div>
          <h2>
            {user?.name}
          </h2>

          <p>
            {user?.email}
          </p>

          <p>
            Role:
            {user?.role}
          </p>
        </div>
      </div>

      <br />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          Total Employees
        </div>

        <div style={cardStyle}>
          Revenue
        </div>

        <div style={cardStyle}>
          Orders
        </div>
      </div>
    </div>
      */}
    </>
  );
}

const cardStyle = {
  background: "#1a1a1a",

  padding: "30px",

  borderRadius: "20px",
};