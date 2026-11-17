"use client";

import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";
import { supabase } from "../../../../lib/supabase";

export default function TicketPage(props: any) {
  const params = props.params;
  const [ticket, setTicket] = useState<any>(null);
  const [user, setUser] =
  useState<any>(null);

const [
  stewardName,
  setStewardName,
] = useState("");

  const [videos, setVideos] = useState<any[]>([]);
  const [
  messages,
  setMessages,
] = useState<any[]>([]);

const [
  newMessage,
  setNewMessage,
] = useState("");

  const [status, setStatus] =
  useState("");
  const [isClosing,
  setIsClosing] =
  useState(false);


  async function loadTicket() {
    const { data, error } =
  await supabase
    .from("tickets")
    .select("*")
    .eq("id", params.id)
    .single();

if (error) {
  console.error(
    "Failed to load ticket:",
    error
  );

  return;
}

    setTicket(data);
    const {
  data: authData,
} =
  await supabase.auth.getUser();

setUser(authData.user);

if (authData.user) {
  const response =
    await fetch(
      "/api/discord-display-name",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          discordProviderId:
            authData.user
              .user_metadata
              ?.provider_id ||
            authData.user
              .user_metadata
              ?.sub,
        }),
      }
    );

  const profile =
    await response.json();

  if (profile.success) {
    setStewardName(
      profile.displayName
    );
  }
}
    setStatus(
  data?.status || ""
);

    const { data: videoData } =
      await supabase
        .from("ticket_videos")
        .select("*")
        .eq("ticket_id", params.id);

    setVideos(videoData || []);

await loadMessages(
  params.id
);
}

async function loadMessages(
  ticketId: string
) {
  const response =
    await fetch(
      `/api/ticket-message?ticketId=${ticketId}`
    );

  if (!response.ok) {
    console.error(
      "Failed to load messages"
    );

    return;
  }

  const data =
    await response.json();

  setMessages(
    data.messages || []
  );
}

async function sendMessage() {
  if (!newMessage.trim()) {
    return;
  }

  const response =
  await fetch(
    "/api/ticket-message",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        ticketId: params.id,
        authorName:
  stewardName,
        authorType:
          "admin",
        message:
          newMessage,
      }),
    }
  );

  if (!response.ok) {
  console.error(
    "Failed to send message"
  );

  return;
}

setNewMessage("");

await loadMessages(
  params.id
);

}

async function updateStatus() {
  const response =
    await fetch(
      "/api/update-ticket-status",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ticketId: params.id,
          status,
        }),
      }
    );

  if (!response.ok) {
    console.error(
      "Failed to update status"
    );

    return;
  }

  loadTicket();
}

async function closeTicket() {
  setIsClosing(true);
  const response =
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
if (!response.ok) {
  console.error(
    "Failed to close ticket"
  );

  setIsClosing(false);

  return;
}

window.location.href =
  "/admin";

}

useEffect(() => {
  loadTicket();
}, []);

useEffect(() => {
  if (!ticket) {
    return;
  }

  const interval =
    setInterval(() => {
      loadMessages(
        ticket.id
      );
    }, 5000);

  return () =>
    clearInterval(
      interval
    );
}, [ticket]);

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
    fontSize: "clamp(1.75rem, 5vw, 3rem)",
    marginBottom: "0.5rem",
  }}
>
  {ticket.ticket_code}
</h1>
<p
  style={{
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginBottom: "1rem",
  }}
>
  {ticket.status === "New" &&
    "🟢 New"}

  {ticket.status ===
    "Under Review" &&
    "🟡 Under Review"}

  {ticket.status ===
    "Decision Pending" &&
    "🔵 Decision Pending"}
</p>
<p
  style={{
    color: "#c0c8d4",
    marginBottom: "1rem",
  }}
>
  AJRabbitGaming Incident Review
</p>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "1rem",
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

<h2
  style={{
    color: "#ff4d67",
    marginTop: "2rem",
    marginBottom: "1rem",
  }}
>
  TICKET DETAILS
</h2>      

<div
  style={{
    background: "#101b2e",
    border: "1px solid #24344f",
    borderRadius: "16px",
    padding: "1rem",
    marginBottom: "2rem",
  }}
>

      <p>
  <strong>Reporter:</strong>{" "}
  {ticket.display_name ||
    ticket.discord_name}
</p>

      <p>
        <strong>Against:</strong>{" "}
        {ticket.incident_against}
      </p>

      <p
  style={{
    marginBottom: "0",
  }}
>
  <strong>Description:</strong>{" "}
  {ticket.description}
</p>
</div>
      
<h2
  style={{
    color: "#ff4d67",
    marginTop: "2rem",
    marginBottom: "1rem",
  }}
>
  TICKET STATUS
</h2>
<div
  style={{
    background: "#101b2e",
    border: "1px solid #24344f",
    borderRadius: "16px",
    padding: "1rem",
    marginBottom: "2rem",
  }}
>   
      
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
  marginBottom: "0.5rem",
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
</div>

      <hr />

      <h2
  style={{
    color: "#ff4d67",
    marginTop: "2rem",
    marginBottom: "1rem",
  }}
>
  INCIDENT EVIDENCE
</h2>

<div
  style={{
    background: "#101b2e",
    border: "1px solid #24344f",
    borderRadius: "16px",
    padding: "1rem",
    marginBottom: "2rem",
  }}
>

{videos.map((video) => (
  <div
    key={video.id}
    style={{
      marginBottom: "1.5rem",
    }}
  >
    <video
      controls
      playsInline
      preload="metadata"
      style={{
        width: "100%",
        borderRadius: "12px",
        border: "1px solid #24344f",
      }}
    >
      <source
        src={video.video_url}
      />
    </video>
  </div>
))}
</div>
      <hr />

<h2
  style={{
    color: "#ff4d67",
    marginTop: "2rem",
    marginBottom: "1rem",
  }}
>
  CONVERSATION
</h2>

<div
  style={{
    marginBottom: "1rem",
  }}
>
  {messages.map(
    (message) => (
      <div
        key={message.id}
        style={{
          background:
            message.author_type ===
            "admin"
              ? "#13233d"
              : "#101b2e",
          border:
            "1px solid #24344f",
          borderRadius:
            "12px",
          padding:
            "12px",
          marginBottom:
            "10px",
        }}
      >
        <div
          style={{
            fontWeight:
              "bold",
            marginBottom:
              "6px",
          }}
        >
          {
            message.author_name
          }
        </div>

        <div>
          {
            message.message
          }
        </div>
        {message.attachment_urls?.map(
  (
    file: any,
    index: number
  ) => (
    <div
      key={index}
      style={{
        marginTop: "10px",
      }}
    >
      {(
        file.fileName
          ?.toLowerCase() || ""
      ).match(
        /\.(mp4|mov|webm|m4v)$/i
      ) ? (
        <video
          controls
          playsInline
          style={{
            width: "100%",
            borderRadius:
              "12px",
            border:
              "1px solid #24344f",
          }}
        >
          <source
            src={
              file.publicUrl
            }
          />
        </video>
      ) : (
        <img
          src={
            file.publicUrl
          }
          alt={
            file.fileName
          }
          style={{
            width: "100%",
            borderRadius:
              "12px",
            border:
              "1px solid #24344f",
          }}
        />
      )}
    </div>
  )
)}
      </div>
    )
  )}
</div>

<div
  style={{
    background: "#101b2e",
    border: "1px solid #24344f",
    borderRadius: "16px",
    padding: "1rem",
  }}
>
<textarea
  value={newMessage}
  onChange={(e) =>
    setNewMessage(
      e.target.value
    )
  }
  onKeyDown={(e) => {
    if (
      e.key ===
        "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      sendMessage();
    }
  }}
  placeholder="Type a message..."
  style={{
    width: "100%",
    minHeight:
      "100px",
    background:
      "#08111f",
    color: "white",
    border:
      "1px solid #24344f",
    borderRadius:
      "12px",
    padding:
      "12px",
  }}
/>

<button
  onClick={sendMessage}
  style={{
    background:
      "#ff4d67",
    color: "white",
    border: "none",
    borderRadius:
      "12px",
    padding:
      "10px 16px",
    cursor:
      "pointer",
    fontWeight:
      "bold",
    marginBottom:
      "1rem",  
  }}
>
  Send Message
</button>

</div>
<button
  onClick={closeTicket}
  disabled={isClosing}
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
  {isClosing
  ? "Closing Ticket..."
  : "Close Ticket"}
</button>
{isClosing && (
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
        Closing Ticket...
      </h2>

      <p>
        Please wait while the
        incident is being
        closed.
      </p>
    </div>
  </div>
)}
    </main>
</AdminGuard>
);
}