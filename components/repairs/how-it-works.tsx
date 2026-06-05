"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";
import { useLang } from "@/lib/i18n/lang-context";
import type { Dict } from "@/lib/i18n/dict";

const STEPS: { n: string; titleKey: keyof Dict; textKey: keyof Dict }[] = [
  { n: "01", titleKey: "rep.how.s1.title", textKey: "rep.how.s1.text" },
  { n: "02", titleKey: "rep.how.s2.title", textKey: "rep.how.s2.text" },
  { n: "03", titleKey: "rep.how.s3.title", textKey: "rep.how.s3.text" },
  { n: "04", titleKey: "rep.how.s4.title", textKey: "rep.how.s4.text" },
];

export function HowItWorks() {
  const { t } = useLang();
  const shouldReduce = useReducedMotion();
  return (
    <section
      aria-label={t("rep.how.eyebrow")}
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-20 items-end mb-14">
          <div className="flex flex-col gap-5">
            <span
              className="font-mono uppercase inline-flex items-center gap-3"
              style={{
                fontSize: "11px",
                letterSpacing: "0.32em",
                color: "#dc2626",
              }}
            >
              <span
                aria-hidden
                className="inline-block h-px w-9"
                style={{ backgroundColor: "#dc2626" }}
              />
              {t("rep.how.eyebrow")}
            </span>
            <h2
              className="font-sans tracking-[-0.025em]"
              style={{
                fontSize: "clamp(32px, 4.2vw, 56px)",
                lineHeight: 1.05,
                color: "#0a0a0a",
                fontWeight: 700,
              }}
            >
              {t("rep.how.titleA")}{" "}
              <span style={{ color: "#dc2626" }}>{t("rep.how.accent")}</span>
            </h2>
          </div>
          <p
            className="leading-relaxed"
            style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
          >
            {t("rep.how.intro")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: DURATION.normal,
                ease: EASE.smooth,
                delay: i * 0.08,
              }}
              className="rounded-2xl p-7 lg:p-8 flex gap-6 transition-colors duration-300 hover:border-[#dc2626]"
              style={{
                backgroundColor: "#fafaf8",
                border: "1px solid #ececec",
              }}
            >
              <span
                className="font-sans tabular-nums shrink-0 leading-none"
                style={{
                  fontSize: "clamp(34px, 3.4vw, 48px)",
                  letterSpacing: "-0.02em",
                  color: "#dc2626",
                  fontWeight: 700,
                }}
              >
                {step.n}
              </span>
              <div className="flex flex-col gap-3">
                <h3
                  className="font-sans"
                  style={{
                    fontSize: "19px",
                    letterSpacing: "-0.015em",
                    color: "#0a0a0a",
                    fontWeight: 600,
                  }}
                >
                  {t(step.titleKey)}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "14px", color: "#525252" }}
                >
                  {t(step.textKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
