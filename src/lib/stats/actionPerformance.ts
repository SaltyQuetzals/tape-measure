import { actions, db } from "@/db";
import { and, gte, lte, sql } from "drizzle-orm";

/**
 * Computes the count of actions grouped by type and success/failure status within an optional date range.
 *
 * @param startDate - (Optional) The start date to filter actions by their creation date (inclusive).
 * @param endDate - (Optional) The end date to filter actions by their creation date (inclusive).
 * @returns A Promise that resolves to an object mapping each action type to its success and failure counts.
 *
 * Example return value:
 * {
 *   "book_appointment": {
 *     "success": 45,
 *     "failure": 12
 *   },
 *   "cancel_appointment": {
 *     "success": 8,
 *     "failure": 3
 *   },
 *   ...
 * }
 */
export const actionPerformance = async (startDate?: Date, endDate?: Date) => {
    // Prepare conditions array
    const conditions = [];
    if (startDate) {
        conditions.push(gte(actions.createdAt, startDate));
    }
    if (endDate) {
        conditions.push(lte(actions.createdAt, endDate));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const actionCounts = await db
        .selectDistinct({
            type: actions.type,
            result: actions.result,
            count: sql<number>`cast(count(${actions.id}) as int)`,
        })
        .from(actions)
        .where(whereClause)
        .groupBy(actions.type, actions.result);

    // Transform the results into the desired format
    const actionMap = actionCounts.reduce((acc: Record<string, { success: number; failure: number }>, curr: { type: string; result: string; count: number }) => {
        if (!acc[curr.type]) {
            acc[curr.type] = { success: 0, failure: 0 };
        }
        
        if (curr.result === "success") {
            acc[curr.type].success = curr.count;
        } else {
            acc[curr.type].failure = curr.count;
        }
        
        return acc;
    }, {} as Record<string, { success: number; failure: number }>);
    return actionMap;
}
