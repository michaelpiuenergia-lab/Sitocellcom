import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RequestTrigger } from "@/components/forms/request-trigger";
import { getCourses } from "@/lib/crm-client";
import { COURSE_LEVEL_LABELS, type CoursePublic } from "@/lib/crm-client/types";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/structured-data";
import { getT } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata: Metadata = {
  title: "Corsi — Cellcom Group",
  description:
    "Corsi di riparazione smartphone per professionisti e hobbisti. Formazione pratica su tutti i modelli.",
};

export const revalidate = 300;

const TOOL_KEYS: (keyof Dict)[] = [
  "cou.tools.t1",
  "cou.tools.t2",
  "cou.tools.t3",
  "cou.tools.t4",
  "cou.tools.t5",
  "cou.tools.t6",
];

const eur = (cents: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);

export default async function CorsiPage() {
  // Source-of-truth: CRM Cellcom Academy. Fallback su lista vuota se CRM giù.
  const [data, t] = await Promise.all([
    getCourses().catch(() => ({ items: [] as CoursePublic[], total: 0 })),
    getT(),
  ]);
  const courses = data.items;

  return (
    <>
      <Breadcrumb items={[{ label: t("bc.home"), href: "/" }, { label: t("bc.courses") }]} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Corsi", url: "/corsi" },
        ]}
      />
      {courses.map((c) => (
        <CourseJsonLd
          key={c.id}
          id={c.id}
          name={c.title}
          description={c.description}
          durationLabel={c.durationLabel}
          priceEur={
            c.priceCents != null
              ? new Intl.NumberFormat("it-IT", {
                  style: "currency",
                  currency: "EUR",
                }).format(c.priceCents / 100)
              : null
          }
        />
      ))}

      {/* HERO bianco */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-20">
          <div className="max-w-3xl flex flex-col gap-5">
            <span
              className="font-mono uppercase inline-flex items-center gap-3"
              style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
            >
              <span
                aria-hidden
                className="inline-block h-px w-9"
                style={{ backgroundColor: "#dc2626" }}
              />
              {t("cou.hero.eyebrow")}
            </span>
            <h1
              className="font-sans tracking-[-0.025em]"
              style={{
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 1.02,
                color: "#0a0a0a",
                fontWeight: 700,
              }}
            >
              {t("cou.hero.titleA")}{" "}
              <span style={{ color: "#dc2626" }}>{t("cou.hero.accent")}</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{ fontSize: "19px", color: "#525252", maxWidth: "640px" }}
            >
              {t("cou.hero.description")}
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <RequestTrigger
                kind="info"
                product={{
                  id: null,
                  slug: null,
                  name: t("cou.hero.reqName"),
                  variantId: null,
                  variantLabel: null,
                }}
                label={t("cou.hero.cta1")}
                className="px-7 py-3.5 rounded-full"
              />
              <Link
                href="#livelli"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5"
                style={{
                  border: "1px solid #e5e5e5",
                  color: "#0a0a0a",
                  fontSize: "15px",
                  fontWeight: 500,
                  backgroundColor: "#ffffff",
                }}
              >
                {t("cou.hero.cta2")}
              </Link>
            </div>
            <p
              className="font-mono uppercase mt-2"
              style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
            >
              {t("cou.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* LIVELLI dinamici dal CRM (nero) */}
      <section id="livelli" aria-label="Livelli del corso" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-20 items-end mb-14">
            <div className="flex flex-col gap-5">
              <span
                className="font-mono uppercase inline-flex items-center gap-3"
                style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
              >
                <span
                  aria-hidden
                  className="inline-block h-px w-9"
                  style={{ backgroundColor: "#dc2626" }}
                />
                {t("cou.levels.eyebrow")}
              </span>
              <h2
                className="font-sans tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(32px, 4.2vw, 56px)",
                  lineHeight: 1.05,
                  color: "#fafafa",
                  fontWeight: 700,
                }}
              >
                {t("cou.levels.titleA")}{" "}
                <span style={{ color: "#dc2626" }}>{t("cou.levels.accent")}</span>
              </h2>
            </div>
            <p
              className="leading-relaxed"
              style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "520px" }}
            >
              {t("cou.levels.intro")}
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
              {courses.map((c, i) => (
                <CourseCard key={c.id} course={c} index={i + 1} t={t} />
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "15px", color: "#737373" }}>
              {t("cou.levels.empty")}
            </p>
          )}
        </div>
      </section>

      {/* STRUMENTAZIONE (bianco) */}
      <section aria-label="Strumentazione e laboratorio" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1fr,1.1fr] gap-10 lg:gap-20 items-start">
            <div className="flex flex-col gap-5">
              <span
                className="font-mono uppercase inline-flex items-center gap-3"
                style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
              >
                <span
                  aria-hidden
                  className="inline-block h-px w-9"
                  style={{ backgroundColor: "#dc2626" }}
                />
                {t("cou.tools.eyebrow")}
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
                {t("cou.tools.titleA")}{" "}
                <span style={{ color: "#dc2626" }}>{t("cou.tools.accent")}</span>
              </h2>
              <p
                className="leading-relaxed"
                style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
              >
                {t("cou.tools.intro")}
              </p>
            </div>

            <ul className="grid sm:grid-cols-2 gap-3">
              {TOOL_KEYS.map((toolKey) => (
                <li
                  key={toolKey}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ backgroundColor: "#fafaf8", border: "1px solid #ececec" }}
                >
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: "#dc2626" }}
                  />
                  <span
                    className="font-sans"
                    style={{ fontSize: "14px", color: "#0a0a0a", fontWeight: 500, lineHeight: 1.45 }}
                  >
                    {t(toolKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA finale (nero) */}
      <section aria-label="Iscrizioni" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-24 lg:py-28 text-center">
          <h2
            className="font-sans tracking-[-0.025em]"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: 1.05,
              color: "#fafafa",
              fontWeight: 700,
            }}
          >
            {t("cou.cta.titleA")}{" "}
            <span style={{ color: "#dc2626" }}>{t("cou.cta.accent")}</span>
          </h2>
          <p
            className="mx-auto mt-6 leading-relaxed"
            style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "560px" }}
          >
            {t("cou.cta.intro")}
          </p>
          <div className="flex justify-center mt-8">
            <RequestTrigger
              kind="info"
              product={{
                id: null,
                slug: null,
                name: t("cou.cta.reqName"),
                variantId: null,
                variantLabel: null,
              }}
              label={t("cou.cta.cta")}
              className="px-7 py-3.5 rounded-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}

type TFn = <K extends keyof Dict>(
  key: K,
  ...args: Dict[K] extends (...a: infer A) => string ? A : []
) => string;

function CourseCard({ course, index, t }: { course: CoursePublic; index: number; t: TFn }) {
  return (
    <div
      className="rounded-2xl p-7 lg:p-8 flex flex-col gap-4 transition-colors duration-300 hover:border-[#dc2626]"
      style={{ backgroundColor: "#141414", border: "1px solid #1f1f1f" }}
    >
      <div className="flex items-baseline justify-between">
        <span
          className="font-sans tabular-nums leading-none"
          style={{
            fontSize: "32px",
            letterSpacing: "-0.02em",
            color: "#dc2626",
            fontWeight: 700,
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
        {course.durationLabel && (
          <span
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
          >
            {course.durationLabel}
          </span>
        )}
      </div>
      <h3
        className="font-sans"
        style={{ fontSize: "22px", letterSpacing: "-0.02em", color: "#fafafa", fontWeight: 700 }}
      >
        {course.title}
      </h3>
      <span
        className="font-mono uppercase self-start px-2 py-0.5 rounded-full"
        style={{
          fontSize: "10px",
          letterSpacing: "0.18em",
          backgroundColor: "rgba(220,38,38,0.12)",
          color: "#f87171",
        }}
      >
        {COURSE_LEVEL_LABELS[course.level]}
      </span>
      {course.description && (
        <p className="leading-relaxed" style={{ fontSize: "14px", color: "#a3a3a3" }}>
          {course.description}
        </p>
      )}
      <div className="mt-auto flex items-end justify-between gap-3">
        {course.priceCents != null ? (
          <span className="tabular-nums" style={{ fontSize: "20px", color: "#fafafa", fontWeight: 700 }}>
            {eur(course.priceCents)}
          </span>
        ) : (
          <span style={{ fontSize: "13px", color: "#737373" }}>{t("cou.card.priceOnReq")}</span>
        )}
        {course.paymentLink ? (
          <a
            href={course.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: 600 }}
          >
            {t("cou.card.enroll")} ↗
          </a>
        ) : (
          <RequestTrigger
            kind="info"
            product={{
              id: course.id,
              slug: course.slug ?? null,
              name: `Cellcom Academy — ${course.title}`,
              variantId: null,
              variantLabel: null,
            }}
            label={t("cou.card.enroll")}
            variant="outline"
            className="text-xs"
          />
        )}
      </div>
    </div>
  );
}
