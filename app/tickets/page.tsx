"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TicketLookupPage() {
  const [discordName, setDiscordName] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [ticket, setTicket] =
  useState<any>(null);
  const [videos, setVideos] =
  useState<any[]>([]);

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

  if (data) {
    const { data: videoData } =
      await supabase
        .from("ticket_videos")
        .select("*")
        .eq("ticket_id", data.id);

    setVideos(videoData || []);
  }
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
    <p>
  <strong>Status:</strong>{" "}
  {ticket.status}
</p>
<hr />

<h3>Uploaded Videos</h3>

{videos.map((video) => (
  <div key={video.id}>
    <a
      href={video.video_url}
      target="_blank"
    >
      Open Video
    </a>
  </div>
))}
  </div>
)}
    </main>
  );
}