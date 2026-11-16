import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const token =
      process.env.DISCORD_BOT_TOKEN;

    const guildId =
      process.env.DISCORD_GUILD_ID;

    const roleId =
      process.env
        .DISCORD_PENALTY_ADMIN_ROLE_ID;

    const discordUserId =
      body.discordProviderId;

    if (
      !token ||
      !guildId ||
      !roleId ||
      !discordUserId
    ) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const response =
      await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
        {
          headers: {
            Authorization:
              `Bot ${token}`,
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
      member.roles?.includes(
        roleId
      );

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
  } catch (error) {
    console.error(
      "Admin Discord login failed:",
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