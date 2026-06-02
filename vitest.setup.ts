import { vi } from "vitest";

// "server-only" è un pacchetto che throws su import client-side, usato per
// barrierare lib server. In vitest non c'è frontiera client/server, quindi
// lo mockiamo a noop per permettere ai test di importare quei moduli.
vi.mock("server-only", () => ({}));

// "next/headers" cookies() funziona solo in contesti server di Next; nei
// test puri non serve. Mockiamo a no-op.
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
    has: () => false,
    set: () => {},
    delete: () => {},
  }),
}));
