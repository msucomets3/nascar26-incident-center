import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

function generateTicketCode() {
  return (
    "TKT-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ticketCode = generateTicketCode();

    const { data, error } = await supabase
  .from("tickets")
  .insert([
    {
      ticket_code: ticketCode,
      discord_name: body.discordName,
      series: body.series,
      incident_against: body.incidentAgainst,
      description: body.description,
      status: "open",
    },
  ])
  .select()
  .single();

    if (error) {
      console.error(error);

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
  ticketId: data.id,
  ticketCode,
});
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process ticket",
      },
      {
        status: 500,
      }
    );
  }
}