export async function sendDiscordResults(
  content: string,
  channelId: string,
  files: File[]
) {
  const token =
    process.env.DISCORD_BOT_TOKEN;

  if (!token || !channelId) {
    throw new Error(
      "Missing Discord configuration"
    );
  }

  const formData =
    new FormData();

  formData.append(
    "content",
    content
  );

  formData.append(
    "allowed_mentions",
    JSON.stringify({
      parse: [
        "roles",
        "users",
      ],
    })
  );

  files.forEach(
    (file, index) => {
      formData.append(
        `files[${index}]`,
        file,
        file.name
      );
    }
  );

  const response =
    await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bot ${token}`,
        },
        body: formData,
      }
    );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      "Failed to send Discord results:",
      errorText
    );

    throw new Error(
      errorText
    );
  }
}