export async function sendDiscordDM(
  discordUserId: string,
  content: string
) {
  const token =
    process.env.DISCORD_BOT_TOKEN;

  if (!token || !discordUserId) {
    return;
  }

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

  if (!dmChannelResponse.ok) {
    console.error(
      "Failed to create DM channel:",
      await dmChannelResponse.text()
    );
    return;
  }

  const dmChannel =
    await dmChannelResponse.json();

  if (!dmChannel?.id) {
    return;
  }

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
          content,
        }),
      }
    );

  if (!messageResponse.ok) {
    console.error(
      "Failed to send DM:",
      await messageResponse.text()
    );
  }
}