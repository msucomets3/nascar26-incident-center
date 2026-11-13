import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { error } = await supabase
      .from("ticket_videos")
      .insert(
        body.videos.map((video: any) => ({
          ticket_id: body.ticketId,
          video_url: video.publicUrl,
          file_name: video.fileName,
        }))
      );

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

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