import { conversations, db } from "@/db";
import { and, gte, lte, sql } from "drizzle-orm";


export const computeResolutionRateOverTime = async (startDate?: Date, endDate?: Date) => {
    // Prepare conditions array
    const conditions = [];
    if (startDate) {
        conditions.push(gte(conversations.createdAt, startDate));
    }
    if (endDate) {
        conditions.push(lte(conversations.createdAt, endDate));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const statusCounts = await db.select({
        date: sql<string>`date(created_at, 'unixepoch')`,
        status: conversations.status,
        count: sql<number>`coalesce(count(*), 0)`
    }
    ).from(conversations)
        .where(whereClause)
        .groupBy(
            sql`date(created_at, 'unixepoch')`, conversations.status)
        .orderBy(sql`date(created_at, 'unixepoch')`, conversations.status)
    // Group by date
    type Entry = {
        date: string;
        active: number;
        booked: number;
        declined: number;
        blocked_needs_human: number;
        completed: number;
        cancelled: number;
        abandoned: number;
        wrong_number: number;
        do_not_contact: number;
        spam: number;
    }  
    const dateMap = new Map<string, Entry>();

    for (const row of statusCounts) {
        if (!dateMap.has(row.date)) {
            dateMap.set(row.date, { date: row.date, active: 0, booked: 0, declined: 0, blocked_needs_human: 0, completed: 0, cancelled: 0, abandoned: 0, wrong_number: 0, do_not_contact: 0, spam: 0 });
        }
        dateMap.get(row.date)![row.status] = row.count;
    }
    const reshaped = Array.from(dateMap.values());
    
    return reshaped;
}