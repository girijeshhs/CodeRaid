// Application constants

export const APP_NAME = "CodeRaid";
export const APP_DESCRIPTION = "Track LeetCode progress with snapshots, XP, streaks, and parties.";

// Time constants
export const WEEK_SIZE = 7;
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

// Rate limiting
export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
};

// Problem difficulty thresholds
export const DIFFICULTY_THRESHOLDS = {
  HIGH_VOLUME: 10,
  CONSISTENT_DAYS: 5,
  HARD_PROBLEMS: 2,
  LOW_VOLUME: 5,
  MIN_STREAK: 3,
};

// Trend detection
export const TREND_THRESHOLDS = {
  IMPROVING: 2,
  DECLINING: -2,
};

// OAuth
export const OAUTH_URLS = {
  TOKEN: "https://oauth2.googleapis.com/token",
  TOKENINFO: "https://oauth2.googleapis.com/tokeninfo",
};

// Cookie names
export const COOKIE_NAMES = {
  SESSION: "coderaid_uid",
  OAUTH_EMAIL: "oauth_email",
  OAUTH_STATE: "oauth_state",
};

// Error messages
export const ERROR_MESSAGES = {
  server: "Server error while finalizing sign-in. Check DATABASE_URL and try again.",
  oauth: "OAuth request was incomplete. Please try signing in again.",
  state: "OAuth state mismatch. Please retry sign-in.",
  token: "Could not exchange OAuth code. Please retry.",
  idtoken: "Missing ID token from Google. Please retry.",
  tokeninfo: "Could not validate Google token. Please retry.",
  email: "Google account email not verified.",
  unauthorized: "You must be signed in to access this page.",
  not_found: "The requested resource was not found.",
};
