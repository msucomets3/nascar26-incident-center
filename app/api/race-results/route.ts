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

await sendDiscordMessage(
  `🏁 Race Results Test

Series: ${series}

Winner: ${winnerName}

${message}`,
  "1572462976311627877"
);

return NextResponse.json({
  ok: true,
});
}