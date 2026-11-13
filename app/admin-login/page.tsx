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
      <div
  style={{
    marginBottom: "2rem",
  }}
>
  <button
    onClick={() => {
      window.location.href =
        "/";
    }}
    style={{
      background: "#13233d",
      color: "white",
      border: "1px solid #24344f",
      borderRadius: "12px",
      padding: "10px 16px",
      cursor: "pointer",
    }}
  >
    Home
  </button>
</div>

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