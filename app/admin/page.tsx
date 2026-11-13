"use client";

import { useEffect, useState } from "react";
import AdminGuard from "../components/AdminGuard";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  async function loadTickets() {
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setTickets(data || []);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  return (
  <AdminGuard>
    <main
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    background: "#08111f",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  }}
>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  }}
>
  <h1
    style={{
      color: "#ff4d67",
      fontSize: "3rem",
      margin: 0,
    }}
  >
    RACE CONTROL
  </h1>

  <div
  style={{
    display: "flex",
    gap: "10px",
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

  <button
    onClick={() => {
      localStorage.removeItem(
        "adminApproved"
      );

      window.location.href =
        "/";
    }}
    style={{
      background: "#13233d",
      color: "white",
      border: "1px solid #ff4d67",
      borderRadius: "12px",
      padding: "10px 16px",
      cursor: "pointer",
    }}
  >
    Logout
  </button>
</div>
</div>

<p
  style={{
    color: "#c0c8d4",
    marginBottom: "2rem",
  }}
>
  AJRabbitGaming Steward Dashboard
</p>

      <p
  style={{
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#ff4d67",
  }}
>
  OPEN INCIDENTS: {tickets.length}
</p>

      <hr />

      {tickets.map((ticket) => (
        <div
  key={ticket.id}
  style={{
    background: "#101b2e",
    border: "1px solid #24344f",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1rem",
  }}
>
          <h3
  style={{
    color: "#ff4d67",
    fontSize: "1.5rem",
    marginTop: 0,
  }}
>
  {ticket.ticket_code}
</h3>

          <p>
            <strong>Reporter:</strong>{" "}
            {ticket.discord_name}
          </p>

          <p>
            <strong>Against:</strong>{" "}
            {ticket.incident_against}
          </p>

          <p>
            <strong>Series:</strong>{" "}
            {ticket.series}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {ticket.description}
          </p>
          
          <p>
  <a
  href={`/admin/ticket/${ticket.id}`}
  style={{
    color: "#ff4d67",
    fontWeight: "bold",
    textDecoration: "none",
  }}
>
  ▶ Review Ticket
</a>
</p>
        </div>
      ))}
       </main>
  </AdminGuard>
  );
}