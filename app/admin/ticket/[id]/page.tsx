"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function TicketPage({
  params,
}: {
  params: { id: string };
}) {
  const [ticket, setTicket] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);

  async function loadTicket() {
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", params.id)
      .single();

    setTicket(data);

    const { data: videoData } =
      await supabase
        .from("ticket_videos")
        .select("*")
        .eq("ticket_id", params.id);

    setVideos(videoData || []);
  }

  useEffect(() => {
    loadTicket();
  }, []);

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>{ticket.ticket_code}</h1>

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

      <hr />

      <h2>Videos</h2>

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
    </main>
  );
}
