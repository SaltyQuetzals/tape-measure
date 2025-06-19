import { conversations, db } from "@/db";
import { and, gte, lte, sql } from "drizzle-orm";
/**
 * Computes the count of conversations for each status within an optional date range.
 *
 * @param startDate - (Optional) The start date to filter conversations by their creation date (inclusive).
 * @param endDate - (Optional) The end date to filter conversations by their creation date (inclusive).
 * @returns A Promise that resolves to an object mapping each conversation status to its count.
 *
 * Example return value:
 * {
 *   "completed": 12,
 *   "cancelled": 3,
 *   "active": 7,
 *   ...
 * }
 */
export const computeResolutionRates = async (startDate?: Date, endDate?: Date) => {
    // Prepare conditions array
    const conditions = [];
    if (startDate) {
        conditions.push(gte(conversations.createdAt, startDate));
    }
    if (endDate) {
        conditions.push(lte(conversations.createdAt, endDate));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const statusCounts = await db
        .selectDistinct({
            status: conversations.status,
            count: sql<number>`cast(count(${conversations.status}) as int)`,
        })
        .from(conversations)
        .where(whereClause)
        .groupBy(conversations.status);

    const statusMap = statusCounts.reduce((acc: Record<string, number>, curr: { status: string; count: number }) => {
        acc[curr.status] = curr.count;
        return acc;
    }, {} as Record<string, number>);

    return statusMap;
}