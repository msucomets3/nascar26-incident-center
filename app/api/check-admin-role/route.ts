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
          isAdmin: false,
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
      return NextResponse.json({
        success: false,
        isAdmin: false,
      });
    }

    const member =
      await response.json();

    const isAdmin =
      member.roles?.includes(
        roleId
      );

    return NextResponse.json({
      success: true,
      isAdmin,
    });
  } catch (error) {
    console.error(
      "Admin role check failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        isAdmin: false,
      },
      {
        status: 500,
      }
    );
  }
}