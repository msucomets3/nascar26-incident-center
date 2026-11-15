import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { sendDiscordDM } from "../../../lib/sendDiscordDM";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: ticket } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", body.ticketId)
      .single();

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket not found",
        },
        {
          status: 404,
        }
      );
    }

    const { error } = await supabase
      .from("tickets")
      .update({
        status: body.status,
      })
      .eq("id", body.ticketId);

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

    if (
      body.status ===
      "Under Review"
    ) {
      await sendDiscordDM(
        ticket.discord_provider_id,
        `🟡 Incident Under Review

Ticket: ${ticket.ticket_code}

A steward has begun reviewing your incident.`
      );
    }

    if (
      body.status ===
      "Decision Pending"
    ) {
      await sendDiscordDM(
        ticket.discord_provider_id,
        `🔵 Decision Pending

Ticket: ${ticket.ticket_code}

A final ruling is being prepared.`
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