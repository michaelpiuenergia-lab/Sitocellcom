import { describe, expect, it, vi } from "vitest";
import { consumeRateLimit, extractIp } from "./rate-limit";

describe("rate-limit chatbot", () => {
  it("permette la prima richiesta", () => {
    const r = consumeRateLimit("unit-test-1");
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBeGreaterThanOrEqual(0);
    expect(r.resetInSec).toBeGreaterThan(0);
  });

  it("blocca dopo MAX richieste nella window", () => {
    const ip = "unit-test-flood";
    // Default: 50/5min. Esaurisci.
    for (let i = 0; i < 50; i++) {
      const r = consumeRateLimit(ip);
      expect(r.allowed).toBe(true);
    }
    const blocked = consumeRateLimit(ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.resetInSec).toBeGreaterThan(0);
  });

  it("isola i bucket per IP diversi", () => {
    const a = consumeRateLimit("unit-iso-a");
    const b = consumeRateLimit("unit-iso-b");
    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });

  it("estrae IP da x-forwarded-for (primo)", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(extractIp(h)).toBe("1.2.3.4");
  });

  it("estrae IP da x-real-ip se manca XFF", () => {
    const h = new Headers({ "x-real-ip": "9.9.9.9" });
    expect(extractIp(h)).toBe("9.9.9.9");
  });

  it("fallback unknown se entrambi mancano", () => {
    const h = new Headers();
    expect(extractIp(h)).toBe("unknown");
  });

  it("rispetta CHATBOT_RATE_LIMIT_PER_IP env override", () => {
    vi.stubEnv("CHATBOT_RATE_LIMIT_PER_IP", "3");
    // Cache module-level del rate-limit non resetta da env stub, ma
    // la prima call sotto questo env userà 3 come max.
    // (Nota: il file lo legge ad ogni call con envMax() — testabile)
    const ip = "unit-test-env-" + Math.random();
    expect(consumeRateLimit(ip).allowed).toBe(true);
    expect(consumeRateLimit(ip).allowed).toBe(true);
    expect(consumeRateLimit(ip).allowed).toBe(true);
    expect(consumeRateLimit(ip).allowed).toBe(false);
    vi.unstubAllEnvs();
  });
});
