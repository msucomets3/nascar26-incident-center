"use client";

import { useEffect, useState } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [approved, setApproved] =
    useState(false);

  useEffect(() => {
    const value =
      localStorage.getItem(
        "adminApproved"
      );

    if (value === "true") {
      setApproved(true);
    } else {
      window.location.href =
        "/admin-login";
    }
  }, []);

  if (!approved) {
    return null;
  }

  return <>{children}</>;
}
