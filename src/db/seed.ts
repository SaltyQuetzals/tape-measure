import { db } from "./index";
import { conversations, messages, actions } from "./schema";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { CONVERSATION_STATUSES, ACTION_TYPES, ACTION_RESULTS } from "@/lib/constants";

const INCOMPLETE_STATUSES = [
    "blocked_needs_human",
    "active"
]

interface ConversationEntry {
    timestamp: string;
    phone: number;
    sender_type: "agent" | "customer" | "operator";
    content: string;
    actions: Array<{
        type: string;
        result: string;
        error: string | null;
    }>;
    status: string;
    reason: string | null;
    job_type: string | null;
    urgency: number;
    operator_id: string | null;
}

function isValidStatus(status: string): status is typeof CONVERSATION_STATUSES[number] {
    return CONVERSATION_STATUSES.includes(status as typeof CONVERSATION_STATUSES[number]);
}

function isValidActionType(actionType: string): actionType is typeof ACTION_TYPES[number] {
    return ACTION_TYPES.includes(actionType as typeof ACTION_TYPES[number]);
}

function isValidActionResult(result: string): result is typeof ACTION_RESULTS[number] {
    return ACTION_RESULTS.includes(result as typeof ACTION_RESULTS[number]);
}

export async function seedFromConversationFiles() {
    const conversationsDir = path.join(process.cwd(), "conversations");

    // Process calls directory
    const callsDir = path.join(conversationsDir, "calls");
    if (fs.existsSync(callsDir)) {
        await processConversationDirectory(callsDir, "call");
    }

    // Process texts directory
    const textsDir = path.join(conversationsDir, "texts");
    if (fs.existsSync(textsDir)) {
        await processConversationDirectory(textsDir, "text");
    }
}

async function processConversationDirectory(dirPath: string, type: "call" | "text") {
    const dateDirs = fs.readdirSync(dirPath);

    for (const dateDir of dateDirs) {
        const datePath = path.join(dirPath, dateDir);
        if (!fs.statSync(datePath).isDirectory()) continue;

        const files = fs.readdirSync(datePath).filter(file => file.endsWith('.jsonl'));

        for (const file of files) {
            const filePath = path.join(datePath, file);
            const phoneNumber = parseInt(file.replace('.jsonl', ''));

            await processConversationFile(filePath, phoneNumber, type);
        }
    }
}

async function processConversationFile(filePath: string, phoneNumber: number, type: "call" | "text") {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');

    if (lines.length === 0) return;

    // Parse all entries
    const entries: ConversationEntry[] = lines.map(line => JSON.parse(line));

    // Create conversation record
    const conversationId = randomUUID();
    const firstEntry = entries[0];
    const lastEntry = entries[entries.length - 1];

    // Validate status
    if (!isValidStatus(lastEntry.status)) {
        console.warn(`Invalid status: ${lastEntry.status} for phone ${phoneNumber}`);
        return;
    }

    const conversationData = {
        id: conversationId,
        phone: phoneNumber,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jobType: firstEntry.job_type as any,
        urgency: firstEntry.urgency,
        status: lastEntry.status,
        reason: lastEntry.reason,
        operatorId: lastEntry.operator_id,
        createdAt: new Date(firstEntry.timestamp),
        updatedAt: new Date(lastEntry.timestamp),
        completedAt: INCOMPLETE_STATUSES.includes(lastEntry.status) ? null : new Date(lastEntry.timestamp),
    };

    // Insert conversation
    await db.insert(conversations).values(conversationData);

    // Process messages and actions
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const messageId = randomUUID();

        // Insert message
        const messageData = {
            id: messageId,
            conversationId,
            timestamp: entry.timestamp,
            senderType: entry.sender_type,
            content: entry.content,
            messageOrder: i + 1,
            createdAt: new Date(entry.timestamp),
        };

        await db.insert(messages).values(messageData);

        // Insert actions if any
        if (entry.actions && entry.actions.length > 0) {
            for (const action of entry.actions) {
                // Validate action type and result
                if (!isValidActionType(action.type)) {
                    console.warn(`Invalid action type: ${action.type} for phone ${phoneNumber}`);
                    continue;
                }

                if (!isValidActionResult(action.result)) {
                    console.warn(`Invalid action result: ${action.result} for phone ${phoneNumber}`);
                    continue;
                }

                const actionData = {
                    id: randomUUID(),
                    messageId,
                    conversationId,
                    type: action.type,
                    result: action.result,
                    error: action.error,
                    metadata: null,
                    createdAt: entry.timestamp,
                };

                await db.insert(actions).values(actionData);
            }
        }
    }

    console.log(`Processed ${type} conversation for phone ${phoneNumber} with ${entries.length} messages`);
}

// Function to run the seeding
export async function runSeed() {
    try {
        console.log("Starting to seed database from conversation files...");
        await seedFromConversationFiles();
        console.log("Database seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
}

// Run if this file is executed directly
if (require.main === module) {
    runSeed().catch(console.error);
} 