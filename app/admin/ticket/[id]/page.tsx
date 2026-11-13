"use client";

import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";
import { supabase } from "../../../../lib/supabase";

export default function TicketPage(props: any) {
  const params = props.params;
  const [ticket, setTicket] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [notes, setNotes] =
  useState<any[]>([]);

const [newNote, setNewNote] =
  useState("");
  const [status, setStatus] =
  useState("");


  async function loadTicket() {
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", params.id)
      .single();

    setTicket(data);
    setStatus(
  data?.status || ""
);

    const { data: videoData } =
      await supabase
        .from("ticket_videos")
        .select("*")
        .eq("ticket_id", params.id);

    setVideos(videoData || []);
    const { data: notesData } =
  await supabase
    .from("admin_notes")
    .select("*")
    .eq("ticket_id", params.id);

setNotes(notesData || []);
}

async function addNote() {
  await fetch("/api/admin-notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticketId: params.id,
      note: newNote,
    }),
  });

  setNewNote("");

  loadTicket();
}
async function updateStatus() {
  await supabase
    .from("tickets")
    .update({
      status,
    })
    .eq("id", params.id);

  loadTicket();
}

async function closeTicket() {
  await fetch(
  "/api/close-ticket",
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify({
      ticketId: params.id,
    }),
  }
);

window.location.href =
  "/admin";

}

useEffect(() => {
  loadTicket();
}, []);

  if (!ticket) {
    return <div>Loading...</div>;
  }

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
      <h1
  style={{
    color: "#ff4d67",
    fontSize: "3rem",
    marginBottom: "0.5rem",
  }}
>
  {ticket.ticket_code}
</h1>
<p
  style={{
    color: "#c0c8d4",
    marginBottom: "2rem",
  }}
>
  AJRabbitGaming Incident Review
</p>
<div
  style={{
    display: "flex",
    gap: "10px",
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

  <button
    onClick={() => {
      window.location.href =
        "/admin";
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
    Back to Dashboard
  </button>
</div>

      <p>
        <strong>Reporter:</strong>{" "}
        {ticket.discord_name}
      </p>

      <p>
        <strong>Against:</strong>{" "}
        {ticket.incident_against}
      </p>

      <p>
        <strong>Description:</strong>{" "}
        {ticket.description}
      </p>
      <p>
  <strong>Status:</strong>
</p>

<select
  value={status}
  onChange={(e) =>
    setStatus(e.target.value)
  }
  style={{
  padding: "10px",
  marginBottom: "1rem",
  background: "#101b2e",
  color: "white",
  border: "1px solid #24344f",
  borderRadius: "12px",
}}
>
  <option>
    New
  </option>

  <option>
    Under Review
  </option>

  <option>
    Decision Pending
  </option>
</select>

<br />

<button
  onClick={updateStatus}
  style={{
    background: "#13233d",
    color: "white",
    border: "1px solid #ff4d67",
    borderRadius: "12px",
    padding: "10px 16px",
    cursor: "pointer",
    marginBottom: "1rem",
  }}
>
  Update Status
</button>

      <hr />

      <h2
  style={{
    color: "#ff4d67",
  }}
>
  INCIDENT EVIDENCE
</h2>

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
      <hr />

<h2
  style={{
    color: "#ff4d67",
  }}
>
  STEWARD NOTES
</h2>

{notes.map((note) => (
  <div
    key={note.id}
    style={{
      background: "#101b2e",
      border: "1px solid #24344f",
      borderRadius: "12px",
      padding: "12px",
      marginBottom: "10px",
    }}
  >
    {note.note}
  </div>
))}

<textarea
  value={newNote}
  onChange={(e) =>
    setNewNote(e.target.value)
  }
  style={{
    width: "100%",
    minHeight: "120px",
    background: "#08111f",
    color: "white",
    border: "1px solid #24344f",
    borderRadius: "12px",
    padding: "12px",
  }}
/>

<br />

<button
  onClick={addNote}
  style={{
    background: "#ff4d67",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Add Note
</button>
<br />
<br />

<button
  onClick={closeTicket}
  style={{
  background: "#8b0000",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: "bold",
}}
>
  Close Ticket
</button>
    </main>
</AdminGuard>
);
}
