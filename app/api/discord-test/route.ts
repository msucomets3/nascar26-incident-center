import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token =
      process.env.DISCORD_BOT_TOKEN;

    const channelId =
      process.env.DISCORD_CHANNEL_ID;

    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          content:
            "✅ Penalty Bot connection successful.",
        }),
      }
    );

    const data =
      await response.json();

    return NextResponse.json({
      success: response.ok,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to contact Discord.",
      },
      {
        status: 500,
      }
    );
  }
}