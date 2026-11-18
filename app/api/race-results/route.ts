import { sendDiscordMessage } from "../../../lib/sendDiscordMessage";
import { sendDiscordResults } from "../../../lib/sendDiscordResults";
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

    const type =
  formData.get(
    "type"
  );

console.log(
  "TYPE:",
  type
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

let roleId = "";
let channelId = "";

if (testMode) {
  channelId =
  "1572637024861683875";

  if (
    series ===
    "Redline Cup Series"
  ) {
    roleId =
      "1488331337428373614";
  } else if (
    series ===
    "Grand National Series"
  ) {
    roleId =
      "1488331424791793736";
  } else if (
    series ===
    "Rapid Response Truck Series"
  ) {
    roleId =
      "1493809179012366419";
  }
} else if (
  series ===
  "Redline Cup Series"
) {
  channelId =
    "1544427262370127893";

  roleId =
    "1488331337428373614";
} else if (
  series ===
  "Grand National Series"
) {
  channelId =
    "1544428008750972958";

  roleId =
    "1488331424791793736";
} else if (
  series ===
  "Rapid Response Truck Series"
) {
  channelId =
    "1540359548140003398";

  roleId =
    "1493809179012366419";
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

const validFiles =
  files.filter(
    (file): file is File =>
      file instanceof File
  );

await sendDiscordResults(
  `<@&${roleId}>

${message}`,
  channelId,
  validFiles
);

return NextResponse.json({
  ok: true,
});
}