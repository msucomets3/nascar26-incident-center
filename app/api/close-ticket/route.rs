import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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