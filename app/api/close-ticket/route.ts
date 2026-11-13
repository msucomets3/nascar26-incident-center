import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: videos } =
      await supabase
        .from("ticket_videos")
        .select("*")
        .eq("ticket_id", body.ticketId);

    if (videos) {
      for (const video of videos) {
        if (video.file_name) {
          await supabase.storage
            .from("incident-videos")
            .remove([
              video.file_name,
            ]);
        }
      }
    }

    await supabase
      .from("admin_notes")
      .delete()
      .eq("ticket_id", body.ticketId);

    await supabase
      .from("ticket_videos")
      .delete()
      .eq("ticket_id", body.ticketId);

    await supabase
      .from("tickets")
      .delete()
      .eq("id", body.ticketId);

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}