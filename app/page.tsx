"use client";

import { useState } from "react";

export default function HomePage() {
  const [discordName, setDiscordName] = useState("");
  const [series, setSeries] = useState("Redline Cup Series");
  const [incidentAgainst, setIncidentAgainst] = useState("");
  const [description, setDescription] = useState("");

  async function submitTicket(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discordName,
        series,
        incidentAgainst,
        description,
      }),
    });

    const data = await response.json();

    alert(data.message);
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>NASCAR 26 Incident Center</h1>

      <p>
        Submit incidents for league officials to review.
      </p>

      <hr />
      <p>
  <a href="/tickets">
    View Existing Ticket
  </a>
</p>

      <h2>Submit New Incident</h2>

      <form onSubmit={submitTicket}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Discord Name</label>
          <br />
          <input
            value={discordName}
            onChange={(e) =>
              setDiscordName(e.target.value)
            }
            type="text"
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Series</label>
          <br />
          <select
            value={series}
            onChange={(e) =>
              setSeries(e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
            }}
          >
            <option>
              Redline Cup Series
            </option>
            <option>
              Grand National Series
            </option>
            <option>
              Rapid Response Truck Series
            </option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Incident Against</label>
          <br />
          <input
            value={incidentAgainst}
            onChange={(e) =>
              setIncidentAgainst(e.target.value)
            }
            type="text"
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={6}
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
            cursor: "pointer",
          }}
        >
          Submit Incident
        </button>
      </form>
    </main>
  );
}