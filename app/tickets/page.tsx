"use client";

import {
  useEffect,
  useState,
} from "react";
import { supabase } from "../../lib/supabase";
import { uploadVideo } from "../../lib/uploadVideo";

export default function TicketLookupPage() {
  const [discordName, setDiscordName] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [ticket, setTicket] =
  useState<any>(null);
  const [
  messages,
  setMessages,
] = useState<any[]>([]);

const [
  newMessage,
  setNewMessage,
] = useState("");
const [
  messageFiles,
  setMessageFiles,
] = useState<File[]>([]);

const [
  displayName,
  setDisplayName,
] = useState("");
  const [myTickets, setMyTickets] =
  useState<any[]>([]);
  const [user, setUser] =
  useState<any>(null);

useEffect(() => {
  async function initialize() {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    setUser(user);

    if (user) {
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
            user.user_metadata
              ?.provider_id ||
            user.user_metadata
              ?.sub,
        }),
      }
    );

  const profile =
    await response.json();

  if (profile.success) {
    setDisplayName(
      profile.displayName
    );
  }
}

    loadMyTickets(user);
  }

  initialize();
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

async function loadMyTickets(
  currentUser?: any
) {
  const savedName =
    localStorage.getItem(
      "discordName"
    );

    if (
  currentUser?.id
) {
  const { data } =
    await supabase
      .from("tickets")
      .select("*")
      .eq(
  "discord_user_id",
  currentUser.id
)
.order(
  "created_at",
  {
    ascending: false,
  }
);

setMyTickets(
  data || []
);

return;
}

  if (!savedName) {
    return;
  }

  setDiscordName(
    savedName
  );

  const { data } =
    await supabase
      .from("tickets")
      .select("*")
      .eq(
        "discord_name",
        savedName
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  setMyTickets(
    data || []
  );
}

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
  await loadMessages(
    data.id
  );
}
}

async function loadMessages(
  ticketId: string
) {
  const response =
    await fetch(
      `/api/ticket-message?ticketId=${ticketId}`
    );

  const data =
    await response.json();

  setMessages(
    data.messages || []
  );
}

async function sendMessage() {
if (
  (!newMessage.trim() &&
    messageFiles.length === 0) ||
  !ticket
) {
  return;
}

  const uploadedFiles: any[] =
  [];

for (const file of messageFiles) {
  const uploadResult =
    await uploadVideo(file);

  uploadedFiles.push(
    uploadResult
  );
}
  await fetch(
    "/api/ticket-message",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        ticketId: ticket.id,
        authorName:
  displayName ||
  ticket.display_name ||
  discordName,
        authorType:
          "driver",
        message:
          newMessage,
          attachmentUrls:
  uploadedFiles,
      }),
    }
  );

  await loadMessages(
  ticket.id
);
setNewMessage("");

setMessageFiles([]);
}

  return (
    <main
  style={{
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "1rem",
    background: "#08111f",
    color: "white",
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
  {user
  ? "MY TICKETS"
  : "TICKET LOOKUP"}
</h1>
<p
  style={{
    color: "#c0c8d4",
    marginBottom: "1rem",
  }}
>
  AJRabbitGaming Race Control
</p>
{user && (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "2rem",
      padding: "12px",
      background: "#101b2e",
      border: "1px solid #24344f",
      borderRadius: "12px",
    }}
  >
    <img
      src={
        user.user_metadata
          ?.avatar_url ||
        user.user_metadata
          ?.picture
      }
      alt="Discord Avatar"
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "50%",
      }}
    />

    <div>
      <div
        style={{
          fontWeight: "bold",
        }}
      >
{displayName ||
 user.user_metadata
  ?.full_name ||
 user.user_metadata
  ?.global_name ||
 user.user_metadata
  ?.name}
      </div>

      <div
        style={{
          color: "#c0c8d4",
          fontSize: "0.9rem",
        }}
      >
        ✅ Connected to Discord
      </div>
    </div>
  </div>
)}
<div
  style={{
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
</div>
{user &&
  myTickets.length === 0 && (
    <div
      style={{
        background: "#101b2e",
        border:
          "1px solid #24344f",
        borderRadius:
          "16px",
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      <h2
  style={{
    color: "#ff4d67",
    marginBottom: "1rem",
  }}
>
  My Tickets
</h2>

      <p>
        No incidents have
        been submitted from
        this Discord account.
      </p>
    </div>
)}
{myTickets.length > 0 && (
  <div
    style={{
      background: "#101b2e",
      border: "1px solid #24344f",
      borderRadius: "16px",
      padding: "2rem",
      marginBottom: "2rem",
    }}
  >
    <h2
  style={{
    color: "#ff4d67",
    marginBottom: "1rem",
  }}
>
  My Tickets
</h2>

    {myTickets.map(
  (myTicket) => (
    <div
      key={myTicket.id}
      style={{
        marginBottom: "1rem",
      }}
    >
      <a
        href="#"
        onClick={async (e) => {
  e.preventDefault();

  if (
  ticket?.id ===
  myTicket.id
) {
  setTicket(null);
  return;
}

setTicket(myTicket);

setTicketCode(
  myTicket.ticket_code
);

setDiscordName(
  myTicket.discord_name?.replace(
    "#0",
    ""
  )
);

await loadMessages(
  myTicket.id
);

  setTimeout(() => {
    document
      .getElementById(
        "ticket-details"
      )
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, 100);
}}
        style={{
          color: "#ff4d67",
          fontWeight: "bold",
          textDecoration:
            "none",
          cursor: "pointer",
        }}
      >
        {myTicket.ticket_code}
      </a>

      <br />

      {myTicket.status ===
        "New" &&
        "🟢 New"}

      {myTicket.status ===
        "Under Review" &&
        "🟡 Under Review"}

      {myTicket.status ===
        "Decision Pending" &&
        "🔵 Decision Pending"}
    </div>
  )
)}
  </div>
)}

      {!user && (
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
      )}
  {ticket && (
  <div
    id="ticket-details"
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
  fontSize: "clamp(1.5rem, 4vw, 2rem)",
  marginBottom: "1rem"
}}
>
  {ticket.ticket_code}
</h2>

    <p>
      <strong>Reporter:</strong>{" "}
{(
  ticket.display_name ||
  ticket.discord_name
)?.replace(
  "#0",
  ""
)}
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
  {ticket.status === "New" &&
    "🟢 New"}

  {ticket.status ===
    "Under Review" &&
    "🟡 Under Review"}

  {ticket.status ===
    "Decision Pending" &&
    "🔵 Decision Pending"}
</p>

{ticket.status ===
  "Decision Pending" && (
  <div
    style={{
      marginTop: "2rem",
      color: "#c0c8d4",
    }}
  >
    This incident is awaiting
    a final ruling.

    The conversation has been 
    locked while Race Control
    finalizes the ruling.
  </div>
)}

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

{ticket.status !==
  "Decision Pending" && (
  <>
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
        padding:
          "12px",
      }}
    />

    <br />
<br />

<input
  type="file"
  multiple
  accept="video/*,image/*"
  onChange={(e) =>
    setMessageFiles(
      Array.from(
        e.target.files || []
      )
    )
  }
/>

    <br />
    <br />

    <button
      onClick={
        sendMessage
      }
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
      }}
    >
      Send Message
    </button>
  </>
)}

  </div>
)}
    </main>
  );
}