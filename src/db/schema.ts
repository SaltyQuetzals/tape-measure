import { JOB_TYPES, CONVERSATION_STATUSES, SENDER_TYPES, ACTION_TYPES, ACTION_RESULTS } from "@/lib/constants";
import { relations } from "drizzle-orm";
import {
    text,
    int,
    sqliteTable
} from "drizzle-orm/sqlite-core";

// Conversations table - represents a conversation session
export const conversations = sqliteTable("conversations", {
    id: text("id").primaryKey(), // UUID or phone number based
    phone: int("phone").notNull(),
    jobType: text("job_type", { enum: JOB_TYPES }),
    urgency: int("urgency").notNull(), // 1-5 scale
    status: text("status", { enum: CONVERSATION_STATUSES }).notNull(),
    reason: text("reason"), // Nullable reason for status change
    operatorId: text("operator_id"), // Nullable, assigned when human takes over
    createdAt: int("created_at", {mode: 'timestamp'}).notNull(),
    completedAt: int("completed_at", {mode: 'timestamp'}), // Nullable, set when conversation ends
    customerName: text("customer_name"), // Extracted from conversation
    customerAddress: text("customer_address"), // Extracted from conversation
    jobDescription: text("job_description"), // Extracted from conversation
    estimatedValue: int("estimated_value"), // In cents
    scheduledDate: text("scheduled_date"), // When service is scheduled
});

// Messages table - individual messages within conversations
export const messages = sqliteTable("messages", {
    id: text("id").primaryKey(), // UUID
    conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    timestamp: text("timestamp").notNull(),
    senderType: text("sender_type", { enum: SENDER_TYPES }).notNull(),
    content: text("content").notNull(),
    messageOrder: int("message_order").notNull(), // Order within conversation
    createdAt: int("created_at", {mode: 'timestamp'}).notNull(),
});

// Actions table - actions taken by the system during conversations
export const actions = sqliteTable("actions", {
    id: text("id").primaryKey(), // UUID
    messageId: text("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
    conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    type: text("type", { enum: ACTION_TYPES }).notNull(),
    result: text("result", { enum: ACTION_RESULTS }).notNull(),
    error: text("error"), // Nullable error message
    metadata: text("metadata"), // Additional action-specific data as JSON string
    createdAt: text("created_at").notNull(),
});

// Relations
export const conversationsRelations = relations(conversations, ({ many }) => ({
    messages: many(messages),
    actions: many(actions),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
    conversation: one(conversations, {
        fields: [messages.conversationId],
        references: [conversations.id],
    }),
    actions: many(actions),
}));

export const actionsRelations = relations(actions, ({ one }) => ({
    message: one(messages, {
        fields: [actions.messageId],
        references: [messages.id],
    }),
    conversation: one(conversations, {
        fields: [actions.conversationId],
        references: [conversations.id],
    }),
}));

// Export types for TypeScript
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Action = typeof actions.$inferSelect;
export type NewAction = typeof actions.$inferInsert;
