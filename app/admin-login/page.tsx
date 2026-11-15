"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

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

  async function discordLogin() {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert(
        "Please sign in with Discord first."
      );

      return;
    }

    const discordProviderId =
      user.user_metadata
        ?.provider_id ||
      user.user_metadata?.sub;

    const response =
      await fetch(
        "/api/admin-discord-login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            discordProviderId,
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
        "You do not have the Penalty Admin role."
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
      <h1>
        Admin Portal
      </h1>

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
            background:
              "#13233d",
            color: "white",
            border:
              "1px solid #24344f",
            borderRadius:
              "12px",
            padding:
              "10px 16px",
            cursor: "pointer",
          }}
        >
          Home
        </button>
      </div>

      <h3>
        Discord Login
      </h3>

      <button
        onClick={discordLogin}
        style={{
          background:
            "#5865F2",
          color: "white",
          border: "none",
          borderRadius:
            "12px",
          padding:
            "10px 16px",
          cursor: "pointer",
          marginBottom:
            "2rem",
        }}
      >
        Access Dashboard with
        Discord
      </button>

      <hr />

      <h3>
        Legacy Access Code
      </h3>

      <input
        value={code}
        onChange={(e) =>
          setCode(
            e.target.value
          )
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