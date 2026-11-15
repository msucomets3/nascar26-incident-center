"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminRoleTest() {
  const [result, setResult] =
    useState("Checking...");

  useEffect(() => {
    async function checkRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const discordProviderId =
        user?.user_metadata
          ?.provider_id ||
        user?.user_metadata?.sub;

      const response =
        await fetch(
          "/api/check-admin-role",
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

      const data =
        await response.json();

      setResult(
        data.isAdmin
          ? "✅ Penalty Admin"
          : "❌ Not Admin"
      );
    }

    checkRole();
  }, []);

  return (
    <main
      style={{
        padding: "2rem",
        color: "white",
        background: "#08111f",
        minHeight: "100vh",
      }}
    >
      <h1>{result}</h1>
    </main>
  );
}