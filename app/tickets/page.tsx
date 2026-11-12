"use client";

import { useState } from "react";

export default function TicketLookupPage() {
  const [discordName, setDiscordName] = useState("");
  const [ticketCode, setTicketCode] = useState("");

  async function lookupTicket(
    event: React.FormEvent
  ) {
    event.preventDefault();

    alert(
      `Looking up ${ticketCode} for ${discordName}`
    );
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
    </main>
  );
}