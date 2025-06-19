export const WINDOW_SIZE = 14; // days

// Enum-like values for sender types
export const SENDER_TYPES = [
    "agent",
    "customer",
    "operator"
] as const;

// Enum-like values for conversation statuses
export const CONVERSATION_STATUSES = [
    "active",
    "booked",
    "declined",
    "blocked_needs_human",
    "completed",
    "cancelled",
    "abandoned",
    "wrong_number",
    "do_not_contact",
    "spam"
] as const;

// Enum-like values for job types
export const JOB_TYPES = [
    "plumbing",
    "electrical",
    "hvac",
    "cleaning",
    "landscaping",
    "general",
] as const;

// Enum-like values for action types
export const ACTION_TYPES = [
    "update_name",
    "update_address",
    "update_job_description",
    "calculate_service_area",
    "request_human_help",
    "schedule_appointment",
    "send_quote",
    "check_calendar",
    "update_ideal_time",
    "book_appointment",
    "send_reminder",
    "get_price_estimate",
    "mark_wrong_number",
    "mark_spam",
    "mark_do_not_contact"
] as const;

// Enum-like values for action results
export const ACTION_RESULTS = [
    "success",
    "failure",
    "pending",
] as const;

export const RESOLVED_STATUSES = [
    "abandoned",
    "booked",
    "declined",
    "do_not_contact",
    "spam",
    "wrong_number"
];