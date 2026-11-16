import { NextResponse } from "next/server";
import { getDiscordNickname } from "../../../lib/getDiscordNickname";

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

    if (!displayName) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      displayName,
    });
  } catch (error) {
    console.error(
      "Discord display name lookup failed:",
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