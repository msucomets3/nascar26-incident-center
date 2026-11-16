import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const { error } =
      await supabase
        .from("ticket_messages")
        .insert([
          {
            ticket_id:
              body.ticketId,
            author_name:
              body.authorName,
            author_type:
              body.authorType,
            message:
              body.message,
            attachment_urls:
              body.attachmentUrls || [],
          },
        ]);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Ticket message save failed:",
      error
    );

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

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const ticketId =
    searchParams.get(
      "ticketId"
    );

  if (!ticketId) {
    return NextResponse.json(
      {
        success: false,
        messages: [],
      },
      {
        status: 400,
      }
    );
  }

  const { data, error } =
    await supabase
      .from("ticket_messages")
      .select("*")
      .eq(
        "ticket_id",
        ticketId
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

  if (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
    messages:
      data || [],
  });
}