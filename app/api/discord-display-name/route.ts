import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token =
      process.env.DISCORD_BOT_TOKEN;

    const guildId =
      process.env.DISCORD_GUILD_ID;

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${body.discordProviderId}`,
      {
        headers: {
          Authorization: `Bot ${token}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    const member =
      await response.json();

    return NextResponse.json({
      success: true,
      displayName:
        member.nick ||
        member.user?.global_name ||
        member.user?.username ||
        null,
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