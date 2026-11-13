"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [code, setCode] =
    useState("");

 async function login() {
  const response =
    await fetch(
      "/api/admin-login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      }
    );

  if (response.ok) {
    localStorage.setItem(
      "adminApproved",
      "true"
    );

    window.location.href =
      "/admin";
  } else {
    alert(
      "Access Denied"
    );
  }
}

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>Admin Portal</h1>
      <p>
  <a
    href="/"
    style={{
      color: "#ff4d67",
      textDecoration: "none",
      fontWeight: "bold",
    }}
  >
    ← Back to Home
  </a>
</p>

      <input
        value={code}
        onChange={(e) =>
          setCode(e.target.value)
        }
        placeholder="Access Code"
        style={{
          width: "100%",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button
        onClick={login}
      >
        Access Dashboard
      </button>
    </main>
  );
}