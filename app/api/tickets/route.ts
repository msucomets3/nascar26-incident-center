import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Ticket received:", body);

    return NextResponse.json({
      success: true,
      message: "Ticket received"
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process ticket"
      },
      {
        status: 500
      }
    );
  }
}