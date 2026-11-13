"use client";

import { useState } from "react";
import { uploadVideo } from "../lib/uploadVideo";

export default function HomePage() {
  const [discordName, setDiscordName] = useState("");
  const [series, setSeries] = useState("Redline Cup Series");
  const [incidentAgainst, setIncidentAgainst] = useState("");
  const [description, setDescription] = useState("");
  const [videoFiles, setVideoFiles] =
  useState<File[]>([]);

  async function submitTicket(
  event: React.FormEvent
) {
  event.preventDefault();

  try {
    const uploadedVideos: any[] = [];

    for (const file of videoFiles) {
  const uploadResult =
    await uploadVideo(file);

  uploadedVideos.push(
    uploadResult
  );
}

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
        uploadedVideos,
      }),
    });

    const data = await response.json();

await fetch("/api/ticket-videos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  ticketId: data.ticketId,
  videos: uploadedVideos,
}),
});

alert(
  `Ticket Created: ${data.ticketCode}`
);
  } catch (error) {
    alert(
      "Video upload failed. Please try again."
    );
  }
}

  return (
   <main
  style={{
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    background: "#08111f",
    color: "white",
    minHeight: "100vh",
  }}
>
      <h1
  style={{
    color: "#ff4d67",
    fontSize: "3rem",
    marginBottom: "0.5rem",
  }}
>
  NASCAR 26 INCIDENT CENTER
</h1>

     <p
  style={{
    color: "#c0c8d4",
    marginBottom: "2rem",
  }}
>
  AJRabbitGaming Race Control
</p>

      <hr />
      <div
  style={{
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  }}
>
  <a href="/tickets">
  <button
    type="button"
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
    View Existing Ticket
  </button>
</a>

  <a href="/admin-login">
  <button
    type="button"
    style={{
      background: "#13233d",
      color: "white",
      border: "1px solid #ff4d67",
      borderRadius: "12px",
      padding: "12px 20px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Admin Portal
  </button>
</a>
</div>

      <h2>Submit New Incident</h2>

      <form
  onSubmit={submitTicket}
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
        <div style={{ marginBottom: "1rem" }}>
  <label>Video Clip</label>
  <br />
  <input
  type="file"
  accept="video/*"
  multiple
  onChange={(e) =>
    setVideoFiles(
      Array.from(e.target.files || [])
    )
  }
/>
<p>
  {videoFiles.length} file(s) selected
</p>
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
          Submit Incident
        </button>
      </form>
    </main>
  );
}