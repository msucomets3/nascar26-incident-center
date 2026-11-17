import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { sendDiscordMessage } from "../../../lib/sendDiscordMessage";
import { sendDiscordDM } from "../../../lib/sendDiscordDM";
import { getDiscordNickname } from "../../../lib/getDiscordNickname";

function generateTicketCode() {
  return (
    "TKT-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const ticketCode =
      generateTicketCode();

    const displayName =
      body.discordProviderId
        ? await getDiscordNickname(
            body.discordProviderId
          )
        : null;

    const { data, error } =
      await supabase
        .from("tickets")
        .insert([
          {
            ticket_code:
              ticketCode,
            discord_name:
              body.discordName,
            discord_user_id:
              body.discordUserId,
            discord_provider_id:
              body.discordProviderId,
            display_name:
              displayName,
            series:
              body.series,
            incident_against:
              body.incidentAgainst,
            description:
              body.description,
            status: "New",
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(error);

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

    await sendDiscordMessage(
  `🚨 New Incident Submitted
Ticket: ${ticketCode}
Reporter: ${
    displayName ||
    body.discordName
  }
Series: ${body.series}
Review: https://nascar26-incident-center.vercel.app/admin/ticket/${data.id}`,
  process.env
    .DISCORD_PENALTY_CHANNEL_ID
);

    await sendDiscordDM(
      body.discordProviderId,
      `✅ Incident Submitted

Ticket: ${ticketCode}

Series: ${body.series}

Your incident report has been received by Race Control.

You can monitor the status of this incident through the Incident Center.`
    );

    return NextResponse.json({
      success: true,
      ticketId: data.id,
      ticketCode,
    });
  } catch (error) {
    console.error(
      "Ticket creation failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process ticket",
      },
      {
        status: 500,
      }
    );
  }
}