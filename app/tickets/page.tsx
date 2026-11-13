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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "2rem",
    background: "#08111f",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  }}
>
      <h1
  style={{
    color: "#ff4d67",
    fontSize: "3rem",
    marginBottom: "0.5rem",
  }}
>
  TICKET LOOKUP
</h1>
<p
  style={{
    color: "#c0c8d4",
    marginBottom: "2rem",
  }}
>
  AJRabbitGaming Race Control
</p>
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
</div>

      <form
  onSubmit={lookupTicket}
  style={{
    background: "#101b2e",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid #24344f",
  }}
>
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
    background: "#ff4d67",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
          Lookup Ticket
        </button>
      </form>
      {ticket && (
  <div
  style={{
    marginTop: "2rem",
    background: "#101b2e",
    border: "1px solid #24344f",
    borderRadius: "16px",
    padding: "2rem",
  }}
>
    <h2
  style={{
    color: "#ff4d67",
    fontSize: "2rem",
  }}
>
  {ticket.ticket_code}
</h2>

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
  <div
  key={video.id}
  style={{
    marginBottom: "0.75rem",
  }}
>
    <a
  href={video.video_url}
  target="_blank"
  style={{
    color: "#ff4d67",
    fontWeight: "bold",
    textDecoration: "none",
  }}
>
  ▶ Open Video
</a>
  </div>
))}
  </div>
)}
    </main>
  );
}