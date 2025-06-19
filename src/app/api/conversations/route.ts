import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET(
) {
  const conversations = await db.query.conversations.findMany();

  return NextResponse.json(conversations);
}