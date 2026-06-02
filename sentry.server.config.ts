import * as Sentry from "@sentry/nextjs";

/**
 * Sentry server-side. Inerte se SENTRY_DSN non è settato.
 */

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    // Server è dove vivono i logger strutturati: non spammiamo Sentry
    // con log.info / log.debug, solo eccezioni vere.
  });
}
