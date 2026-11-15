import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token =
      process.env.DISCORD_BOT_TOKEN;

    const discordUserId =
      "437131454321917971";

    const dmChannelResponse =
      await fetch(
        "https://discord.com/api/v10/users/@me/channels",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bot ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            recipient_id:
              discordUserId,
          }),
        }
      );

    const dmChannel =
      await dmChannelResponse.json();

    const messageResponse =
      await fetch(
        `https://discord.com/api/v10/channels/${dmChannel.id}/messages`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bot ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            content:
              "✅ Penalty Bot DM test successful.",
          }),
        }
      );

    const data =
      await messageResponse.json();

    return NextResponse.json({
      success:
        messageResponse.ok,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to send Discord DM.",
      },
      {
        status: 500,
      }
    );
  }
}