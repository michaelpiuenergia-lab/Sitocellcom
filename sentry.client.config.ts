import * as Sentry from "@sentry/nextjs";

/**
 * Sentry client-side. Inerte se SENTRY_DSN non è settato.
 * Per attivare in produzione: aggiungere SENTRY_DSN sul progetto Vercel HUB.
 */

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.5,
    integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
    beforeSend(event) {
      // Filter out noise: 4xx fetch errors lato client non sono actionable
      if (event.exception?.values?.[0]?.value?.includes("AbortError")) {
        return null;
      }
      return event;
    },
  });
}
