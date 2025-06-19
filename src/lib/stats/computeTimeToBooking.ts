import { conversations, db } from "@/db";
import { and, avg, countDistinct, eq, gte, lte, sql } from "drizzle-orm";


/**
 * Computes the time taken to reach a "booked" status for conversations within an optional date range.
 *
 * This function queries the conversations table for all conversations with a status of "booked".
 * Optionally, it filters by a provided start and/or end date (inclusive) based on the conversation's creation date.
 * For each matching conversation, it returns the id, createdAt, completedAt, and the computed time to booking
 * (difference between completedAt and createdAt).
 *
 * @param startDate - (Optional) The start date to filter conversations by their creation date (inclusive).
 * @param endDate - (Optional) The end date to filter conversations by their creation date (inclusive).
 * @returns A Promise that resolves to an array of objects, each containing:
 *   - id: string
 *   - createdAt: Date
 *   - completedAt: Date
 *   - timeToBooking: number (difference between completedAt and createdAt)
 *
 * Example return value:
 * [
 *   {
 *     id: "abc123",
 *     createdAt: 2024-06-01T10:00:00.000Z,
 *     completedAt: 2024-06-01T10:15:00.000Z,
 *     timeToBooking: 900000 // milliseconds
 *   },
 *   ...
 * ]
 */
export const computeTimeToBooking = async (startDate?: Date, endDate?: Date) => {
    // Prepare conditions array
    const conditions = [eq(conversations.status, "booked")];
    if (startDate) {
        conditions.push(gte(conversations.createdAt, startDate));
    }
    if (endDate) {
        conditions.push(lte(conversations.createdAt, endDate));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const timesToBooking = await db.select({
        count: countDistinct(conversations.id),
        timeToBooking: avg(sql<number>`${conversations.completedAt} - ${conversations.createdAt}`).mapWith(Number),
    }).from(conversations).where(whereClause).limit(1);

    return timesToBooking[0];
}