import { sendDiscordMessage } from "../../../lib/sendDiscordMessage";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  const auth =
    request.headers.get(
      "authorization"
    );

  const expected =
    `Bearer ${process.env.RACE_RESULTS_API_SECRET}`;

  if (auth !== expected) {
    return NextResponse.json(
      {
        ok: false,
        reason:
          "unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const testMode =
    new URL(request.url)
      .searchParams.get(
        "test"
      ) === "1";

  const formData =
    await request.formData();

  const series =
    formData.get(
      "series"
    );

  const winnerName =
    formData.get(
      "winnerName"
    );

  const message =
    formData.get(
      "message"
    );

  const files =
  formData.getAll(
    "files"
  );

console.log(
  "FILES RECEIVED:",
  files.length
);

for (const file of files) {
  if (file instanceof File) {
    console.log(
      "FILE:",
      file.name,
      file.type,
      file.size
    );
  }
}  

  console.log(
    "TEST MODE:",
    testMode
  );

  console.log(
    "SERIES:",
    series
  );

  console.log(
    "WINNER:",
    winnerName
  );

  console.log(
  "MESSAGE:",
  message
);

let channelId = "";

if (testMode) {
  channelId =
    "1572462976311627877";
} else if (
  series ===
  "Redline Cup Series"
) {
  channelId =
    "1544427262370127893";
} else if (
  series ===
  "Grand National Series"
) {
  channelId =
    "1544428008750972958";
} else if (
  series ===
  "Rapid Response Truck Series"
) {
  channelId =
    "1540359548140003398";
} else {
  return NextResponse.json(
    {
      ok: false,
      reason:
        "unknown series",
    },
    {
      status: 400,
    }
  );
}

await sendDiscordMessage(
  `🏁 Race Results Test

Series: ${series}

Winner: ${winnerName}

${message}`,
  channelId
);

return NextResponse.json({
  ok: true,
});
}