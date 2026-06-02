/**
 * Logger strutturato leggero, no-deps. Output:
 * - dev: pretty text colorato
 * - prod (Vercel): JSON single-line (Vercel parsa + indexa per livello)
 *
 * Niente winston/pino — non vogliamo bundle bloat per ~6 chiamate.
 */

type Level = "debug" | "info" | "warn" | "error";

const LEVEL_RANK: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function currentLevel(): Level {
  const raw = process.env.LOG_LEVEL?.toLowerCase();
  if (raw === "debug" || raw === "info" || raw === "warn" || raw === "error") return raw;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

const ACTIVE = LEVEL_RANK[currentLevel()];
const IS_PROD = process.env.NODE_ENV === "production";

function emit(level: Level, msg: string, ctx?: Record<string, unknown>) {
  if (LEVEL_RANK[level] < ACTIVE) return;
  if (IS_PROD) {
    const line = JSON.stringify({
      level,
      msg,
      ts: new Date().toISOString(),
      ...(ctx ?? {}),
    });
    // Stream a stderr per warn/error così Vercel li separa
    if (level === "warn" || level === "error") process.stderr.write(line + "\n");
    else process.stdout.write(line + "\n");
  } else {
    const tag =
      level === "error"
        ? "\x1b[31m[ERR]\x1b[0m"
        : level === "warn"
        ? "\x1b[33m[WRN]\x1b[0m"
        : level === "info"
        ? "\x1b[36m[INF]\x1b[0m"
        : "\x1b[90m[DBG]\x1b[0m";
    if (ctx) console.log(tag, msg, ctx);
    else console.log(tag, msg);
  }
}

export const log = {
  debug: (msg: string, ctx?: Record<string, unknown>) => emit("debug", msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => emit("info", msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => emit("warn", msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => emit("error", msg, ctx),
};
