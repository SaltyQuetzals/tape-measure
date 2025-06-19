# Database Schema Documentation

This directory contains the Drizzle ORM schema for the Tape Measure application, designed to store and analyze conversation data from customer service interactions.

## Schema Overview

The database is built using Drizzle ORM with SQLite (LibSQL/Turso) and consists of the following main tables:

### Core Tables

#### `conversations`
Stores conversation sessions with customers.
- **Primary Key**: `id` (UUID)
- **Key Fields**: `phone`, `jobType`, `urgency`, `status`
- **Status Tracking**: Tracks conversation state (active, booked, declined, etc.)
- **Extracted Data**: Customer name, address, job description, estimated value

#### `messages`
Individual messages within conversations.
- **Primary Key**: `id` (UUID)
- **Foreign Key**: `conversationId` → `conversations.id`
- **Key Fields**: `timestamp`, `senderType`, `content`, `messageOrder`
- **Sender Types**: agent, customer, operator

#### `actions`
System actions taken during conversations.
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `messageId` → `messages.id`, `conversationId` → `conversations.id`
- **Key Fields**: `type`, `result`, `error`, `metadata`
- **Action Types**: update_name, update_address, schedule_appointment, etc.

### Management Tables

#### `operators`
Human operators who can take over conversations.
- **Primary Key**: `id` (operator ID)
- **Key Fields**: `name`, `email`, `isActive`

## Data Types and Enums

### Job Types
- `plumbing`
- `electrical`
- `hvac`
- `cleaning`
- `landscaping`
- `general`

### Conversation Statuses
- `active` - Conversation in progress
- `booked` - Service successfully scheduled
- `declined` - Customer declined service
- `blocked_needs_human` - Requires human intervention
- `completed` - Service completed
- `cancelled` - Service cancelled

### Sender Types
- `agent` - AI agent messages
- `customer` - Customer messages
- `operator` - Human operator messages

### Action Types
- `update_name` - Extract/update customer name
- `update_address` - Extract/update service address
- `update_job_description` - Extract/update job details
- `calculate_service_area` - Determine service coverage
- `request_human_help` - Escalate to human operator
- `schedule_appointment` - Book service appointment
- `send_quote` - Send price estimate

### Action Results
- `success` - Action completed successfully
- `failed` - Action failed
- `pending` - Action in progress

## Usage

### Database Connection

```typescript
import { db } from "./db/index";
import { conversations, messages, actions } from "./db/schema";
```

### Querying Conversations

```typescript
// Get all active conversations
const activeConversations = await db
  .select()
  .from(conversations)
  .where(eq(conversations.status, "active"));

// Get conversation with messages
const conversationWithMessages = await db
  .select()
  .from(conversations)
  .leftJoin(messages, eq(conversations.id, messages.conversationId))
  .where(eq(conversations.id, conversationId));
```

### Seeding Data

The `seed.ts` file provides utilities to import conversation data from JSONL files:

```typescript
import { runSeed } from "./db/seed";

// Seed the database from conversation files
await runSeed();
```

## Migration

To generate and run migrations:

```bash
# Generate migration
pnpm drizzle-kit generate

# Run migration
pnpm drizzle-kit migrate
```

## Environment Variables

- `DATABASE_URL` - Database connection URL (default: `file:./local.db`)

## Indexes

The schema includes optimized indexes for:
- Phone number lookups
- Status filtering
- Timestamp-based queries
- Foreign key relationships

## Data Import Process

1. **File Structure**: Conversation files are organized by date and type (calls/texts)
2. **Validation**: Type guards ensure data integrity during import
3. **Normalization**: Raw JSONL data is normalized into relational structure
4. **Metrics**: Aggregated metrics are calculated for analytics

## Performance Considerations

- Indexes on frequently queried fields
- Cascade deletes for data integrity
- JSON storage for flexible metadata
- Integer storage for boolean values (SQLite optimization) 