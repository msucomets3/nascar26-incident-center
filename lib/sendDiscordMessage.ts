export async function sendDiscordMessage(
  content: string,
  channelId?: string
) {
  const token =
    process.env.DISCORD_BOT_TOKEN;

  const targetChannel =
    channelId ||
    process.env.DISCORD_CHANNEL_ID;

  if (!token || !targetChannel) {
    return;
  }

  await fetch(
    `https://discord.com/api/v10/channels/${targetChannel}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    }
  );
}