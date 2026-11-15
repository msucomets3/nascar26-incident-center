import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token =
      process.env.DISCORD_BOT_TOKEN;

    const guildId =
      process.env.DISCORD_GUILD_ID;

    const roleId =
      process.env
        .DISCORD_PENALTY_ADMIN_ROLE_ID;

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
          status: 403,
        }
      );
    }

    const member =
      await response.json();

    const isAdmin =
      member.roles?.includes(roleId);

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 403,
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