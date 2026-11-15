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
  const [videos, setVideos] =
  useState<any[]>([]);
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
  const [
  additionalInformation,
  setAdditionalInformation,
] = useState("");

const [
  additionalVideos,
  setAdditionalVideos,
] = useState<File[]>([]);


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
  setAdditionalInformation(
  data?.additional_information || ""
);

if (data) {
  const { data: videoData } =
    await supabase
      .from("ticket_videos")
      .select("*")
      .eq("ticket_id", data.id);

  setVideos(videoData || []);

  await loadMessages(
  data.id
);
}
}

async function saveAdditionalInfo() {
  if (!ticket) {
    return;
  }

  await supabase
    .from("tickets")
    .update({
      additional_information:
        additionalInformation,
    })
    .eq("id", ticket.id);

  if (
    additionalVideos.length > 0
  ) {
    const uploadedVideos: any[] =
      [];

    for (const file of additionalVideos) {
      const uploadResult =
        await uploadVideo(file);

      uploadedVideos.push(
        uploadResult
      );
    }

    await fetch(
      "/api/ticket-videos",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ticketId: ticket.id,
          videos: uploadedVideos,
        }),
      }
    );
    const {
  data: refreshedVideos,
} = await supabase
  .from("ticket_videos")
  .select("*")
  .eq(
    "ticket_id",
    ticket.id
  );

setVideos(
  refreshedVideos || []
);
  }

  setTicket({
  ...ticket,
  additional_information:
    additionalInformation,
});

setAdditionalVideos([]);
alert(
  "Additional information saved"
);

loadMyTickets(user);
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
    !newMessage.trim() ||
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
  {user
  ? "MY TICKETS"
  : "TICKET LOOKUP"}
</h1>
<p
  style={{
    color: "#c0c8d4",
    marginBottom: "2rem",
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
      }}
    >
      My Tickets
    </h2>

    {myTickets.map(
  (ticket) => (
    <div
      key={ticket.id}
      style={{
        marginBottom: "1rem",
      }}
    >
      <a
        href="#"
        onClick={async (e) => {
          e.preventDefault();

          setTicket(ticket);
          setAdditionalInformation(
  ticket.additional_information || ""
);

          setTicketCode(
            ticket.ticket_code
          );

          setDiscordName(
  ticket.discord_name?.replace(
    "#0",
    ""
  )
);

          const {
            data: videoData,
          } = await supabase
            .from(
              "ticket_videos"
            )
            .select("*")
            .eq(
              "ticket_id",
              ticket.id
            );

          setVideos(
            videoData || []
          );
          await loadMessages(
  ticket.id
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
        {ticket.ticket_code}
      </a>

      <br />

      {ticket.status ===
        "New" &&
        "🟢 New"}

      {ticket.status ===
        "Under Review" &&
        "🟡 Under Review"}

      {ticket.status ===
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
    fontSize: "2rem",
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
  <strong>
    Additional Information:
  </strong>
</p>

<p>
  {ticket.additional_information ||
    "None"}
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

{ticket.status !==
  "Decision Pending" && (
  <div
    style={{
      marginTop: "2rem",
    }}
  >
    <h3>
      Additional Information
    </h3>

    <textarea
      value={
        additionalInformation
      }
      onChange={(e) =>
        setAdditionalInformation(
          e.target.value
        )
      }
      style={{
        width: "100%",
        minHeight: "120px",
        padding: "12px",
      }}
    />

    <br />
    <br />

    <label>
      Additional Evidence
    </label>

    <br />

    <input
      type="file"
      multiple
      accept="video/*"
      onChange={(e) =>
        setAdditionalVideos(
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
        saveAdditionalInfo
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
        cursor: "pointer",
      }}
    >
      Save Additional Information
    </button>
  </div>
)}

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

    Additional edits are
    locked.
  </div>
)}

<hr />

<h3>Conversation</h3>

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

<hr />

<h3>Uploaded Videos</h3>

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
)}
    </main>
  );
}