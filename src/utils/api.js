// Centralize the API base URL so we don't hard-code localhost across files.
// This reads from Vite env (VITE_API_BASE_URL) and falls back to local dev.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

