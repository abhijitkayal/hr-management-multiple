"use client";

import {
  useState,
} from "react";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router =
    useRouter();

    const [role, setRole] =
  useState("hr");
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  async function register() {
    const response =
      await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

        body: JSON.stringify({
  name,
  email,
  password,
  role,
}),
        }
      );

    const data =
      await response.json();

    if (!data.success) {
      return alert(
        data.message
      );
    }

    alert(
      "Registration Success"
    );

    router.push("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
      }}
    >
      <div
        style={{
          width: "350px",
          background: "#1a1a1a",
          padding: "30px",
          borderRadius: "20px",
          display: "grid",
          gap: "16px",
        }}
      >
        <h1
          style={{
            color: "#fff",
          }}
        >
          Register
        </h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={inputStyle}
        />
        <select
  value={role}
  onChange={(e) =>
    setRole(
      e.target.value
    )
  }
  style={inputStyle}
>
  <option value="hr">
    HR
  </option>

  <option value="admin">
    Admin
  </option>
</select>

        <button
          onClick={register}
          style={buttonStyle}
        >
          Register
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px",

  borderRadius: "12px",

  border: "1px solid #333",

  background: "#000",

  color: "#fff",
};

const buttonStyle = {
  background: "#d4841a",

  border: "none",

  padding: "14px",

  borderRadius: "12px",

  color: "#fff",

  cursor: "pointer",
};