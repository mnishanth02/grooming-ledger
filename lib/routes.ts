/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/welcome"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/reset-password",
  "/auth/forgot-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = ["/api"];

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_SIGNIN_REDIRECT = "/";
export const DEFAULT_SIGN_OUT_REDIRECT = "/auth/sign-in";
// export const DEFAULT_AUTH_ERROR_REDIRECT = "/auth-error";

/**
 * Admin route constants for clean navigation and path management
 */
export const ADMIN_ROUTES = {
  ADMIN_HOME: "/admin",
  TOPICS: (teamId: string) => `/admin/${teamId}/topics`,
  CANDIDATES: (teamId: string) => `/admin/${teamId}/candidates`,
  REPORTS: (teamId: string) => `/admin/${teamId}/reports`,
  SETTINGS: (teamId: string) => `/admin/${teamId}/settings`,
  ASSOCIATES: (teamId: string) => `/admin/${teamId}/associates`,
};
