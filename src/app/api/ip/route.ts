import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return NextResponse.json({ ip: data.ip });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Failed To Get Ip" });
  }
}
