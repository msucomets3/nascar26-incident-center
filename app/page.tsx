"use client";

import {
  useEffect,
  useState,
} from "react";
import { uploadVideo } from "../lib/uploadVideo";

export default function HomePage() {
  const [discordName, setDiscordName] = useState("");
  const [series, setSeries] = useState("Redline Cup Series");
  const [incidentAgainst, setIncidentAgainst] = useState("");
  const [description, setDescription] = useState("");
  const [videoFiles, setVideoFiles] =
  useState<File[]>([]);
  const [
  isSubmitting,
  setIsSubmitting,
] = useState(false);
  useEffect(() => {
  const savedName =
    localStorage.getItem(
      "discordName"
    );

  if (savedName) {
    setDiscordName(
      savedName
    );
  }
}, []);


  async function submitTicket(
  event: React.FormEvent
) {
  event.preventDefault();
  setIsSubmitting(true);

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
    localStorage.setItem(
  "discordName",
  discordName
);

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

setIsSubmitting(false);
alert(
  `Ticket Created: ${data.ticketCode}`
);
  } catch (error) {
    setIsSubmitting(false);
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
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
    background: "#08111f",
    color: "white",
  }}
>
      <h1
  style={{
    color: "#ff4d67",
    fontSize: "clamp(1.75rem, 5vw, 3rem)",
    marginBottom: "0.5rem",
  }}
>
  NASCAR 26 INCIDENT CENTER
</h1>

     <p
  style={{
    color: "#c0c8d4",
    marginBottom: "1rem",
  }}
>
  AJRabbitGaming Race Control
</p>

      <hr />
      <div
  style={{
    display: "flex",
    gap: "1rem",
    marginTop: "0.5rem",
    marginBottom: "1rem",
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
      padding: "10px 16px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    View Existing Ticket
  </button>
</a>

  <a href="/admin">
  <button
    type="button"
    style={{
      background: "#13233d",
      color: "white",
      border: "1px solid #ff4d67",
      borderRadius: "12px",
      padding: "10px 16px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Admin Portal
  </button>
</a>
</div>

  <h2
  style={{
    fontSize: "1.25rem",
    marginTop: "0.5rem",
    marginBottom: "0.75rem",
  }}
>
  Submit New Incident
</h2>

      <form
  onSubmit={submitTicket}
  style={{
    background: "#101b2e",
    padding: "1rem",
    borderRadius: "16px",
    border: "1px solid #24344f",
  }}
>
        <div style={{ marginBottom: "0.5rem" }}>
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

        <div style={{ marginBottom: "0.5rem" }}>
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

        <div style={{ marginBottom: "0.5rem" }}>
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

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
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
<div
  style={{
    marginTop: "0.25rem",
    fontSize: "0.9rem",
    color: "#c0c8d4",
  }}
>
  {videoFiles.length} file(s) selected
</div>
</div>

        <button
          type="submit"
          disabled={isSubmitting}
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
          {isSubmitting
  ? "Creating Incident..."
  : "Submit Incident"}
        </button>
      </form>
            {isSubmitting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom:
                  "1rem",
              }}
            >
              ⏳
            </div>

            <h2>
              Creating Incident...
            </h2>

            <p>
              Please wait while
              your report is
              processed.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}