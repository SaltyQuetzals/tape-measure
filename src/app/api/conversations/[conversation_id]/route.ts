import { db, conversations } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ conversation_id: string }> }
  ) {
    const { conversation_id } = await params; // 'a', 'b', or 'c'
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, parseInt(conversation_id)),
      with: {
        messages: true,
        actions: true,
      },
    });
    return NextResponse.json(conversation);
  }