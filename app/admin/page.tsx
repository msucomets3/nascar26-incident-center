"use client";

import { useEffect, useState } from "react";
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
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>Admin Dashboard</h1>

      <p>
        Open Tickets: {tickets.length}
      </p>

      <hr />

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3>
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
  >
    Review Ticket
  </a>
</p>
        </div>
      ))}
    </main>
  );
}