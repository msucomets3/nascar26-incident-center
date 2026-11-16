import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getDiscordNickname } from "../../../lib/getDiscordNickname";
import { sendDiscordDM } from "../../../lib/sendDiscordDM";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const displayName =
      await getDiscordNickname(
        body.discordProviderId
      );

    const { error } =
      await supabase
        .from("tickets")
        .update({
          discord_user_id:
            body.discordUserId,
          discord_provider_id:
            body.discordProviderId,
          display_name:
            displayName,
        })
        .eq(
          "id",
          body.ticketId
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

    await sendDiscordDM(
      body.discordProviderId,
      `✅ Discord account linked successfully.

Future steward messages and ticket updates will be sent through Discord.`
    );

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