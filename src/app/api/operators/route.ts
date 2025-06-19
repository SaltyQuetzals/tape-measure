import { db } from "@/db";
import { conversations } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    // Query distinct operator IDs from the conversations table
    const rows = await db
        .selectDistinct({ operatorId: conversations.operatorId })
        .from(conversations);

    // Filter out null or empty operator IDs
    const operatorIds = rows
        .map(row => row.operatorId)
        .filter((id): id is string => !!id);

    return NextResponse.json({ operatorIds });
}
