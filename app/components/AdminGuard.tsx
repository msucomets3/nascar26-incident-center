"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [approved, setApproved] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
await supabase.auth.signInWithOAuth({
  provider: "discord",
  options: {
    redirectTo:
      `${window.location.origin}/admin`,
  },
});

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
        setApproved(true);
      } else {
        alert(
          "Penalty Admin role required."
        );

        window.location.href = "/";
      }

      setChecking(false);
    }

    verifyAdmin();
  }, []);

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          background: "#08111f",
          color: "white",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        Checking permissions...
      </div>
    );
  }

  if (!approved) {
    return null;
  }

  return <>{children}</>;
}