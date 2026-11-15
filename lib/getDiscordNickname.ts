export async function getDiscordNickname(
  discordUserId: string
) {
  const token =
    process.env.DISCORD_BOT_TOKEN;

  const guildId =
    process.env.DISCORD_GUILD_ID;

  if (
    !token ||
    !guildId ||
    !discordUserId
  ) {
    return null;
  }

  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
    {
      headers: {
        Authorization: `Bot ${token}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const member =
    await response.json();

  return (
    member.nick ||
    member.user?.global_name ||
    member.user?.username ||
    null
  );
}