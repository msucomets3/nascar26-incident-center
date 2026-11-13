"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TicketLookupPage() {
  const [discordName, setDiscordName] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [ticket, setTicket] =
  useState<any>(null);

  async function lookupTicket(
  event: React.FormEvent
) {
  event.preventDefault();

  const { data } = await supabase
    .from("tickets")
    .select("*")
    .eq("ticket_code", ticketCode)
    .eq("discord_name", discordName)
    .single();

  setTicket(data);
}

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>Ticket Lookup</h1>

      <form onSubmit={lookupTicket}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Discord Name</label>
          <br />
          <input
            value={discordName}
            onChange={(e) =>
              setDiscordName(e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Ticket Code</label>
          <br />
          <input
            value={ticketCode}
            onChange={(e) =>
              setTicketCode(e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
          }}
        >
          Lookup Ticket
        </button>
      </form>
      {ticket && (
  <div
    style={{
      marginTop: "2rem",
      border: "1px solid #ccc",
      padding: "1rem",
    }}
  >
    <h2>{ticket.ticket_code}</h2>

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
  </div>
)}
    </main>
  );
}