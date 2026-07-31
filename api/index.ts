/**
 * Vercel Serverless entry point.
 *
 * This is the ONLY adapter Vercel needs. It imports the existing Express app
 * unchanged and re-exports it as the default export.
 *
 * @vercel/node accepts an Express app instance as a serverless handler —
 * it wraps the Node.js IncomingMessage / ServerResponse cycle that Express
 * already uses. No Express code changes are required.
 *
 * Request flow:
 *   Vercel edge → @vercel/node runtime → this file → Express app (app.ts)
 *   → pinoHttp middleware → cors → express.json → router (/api/*)
 */
import app from "../artifacts/api-server/src/app.js";

export default app;
