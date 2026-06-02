import Link from "next/link";
import { requireCustomerSession } from "@/lib/auth/customer-guards";
import { getCustomerCourses } from "@/lib/crm-client";
import {
  COURSE_ENROLLMENT_LABELS,
  COURSE_LEVEL_LABELS,
  type CustomerCourse,
} from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

export default async function ClientiCorsiPage() {
  const { sessionToken } = await requireCustomerSession("/clienti/corsi");
  const { items } = await getCustomerCourses(sessionToken).catch(() => ({
    items: [] as CustomerCourse[],
  }));

  return (
    <main className="pt-12 pb-16 px-6 lg:px-12 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#dc2626" }}>
          Cellcom Academy
        </span>
        <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
          I tuoi corsi
        </h1>
        <p style={{ fontSize: "14px", color: "#525252", maxWidth: "640px" }}>
          Qui trovi i corsi a cui ti sei iscritto. Le iscrizioni vanno approvate
          manualmente dallo staff — quando un corso è approvato puoi accedere
          ai video e seguire dall&apos;area riservata.
        </p>
      </div>

      {items.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}
        >
          <p style={{ fontSize: "16px", color: "#525252" }}>
            Non hai ancora corsi attivi.
          </p>
          <a
            href="/corsi"
            className="inline-block mt-4 px-5 py-2.5 rounded-full"
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Scopri Cellcom Academy →
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </main>
  );
}

function CourseCard({ course }: { course: CustomerCourse }) {
  const status = course.enrollment.approvalStatus;
  const statusColor =
    status === "approved" ? "#15803d" : status === "rejected" ? "#b91c1c" : "#92400e";
  const statusBg =
    status === "approved" ? "#ecfdf5" : status === "rejected" ? "#fef2f2" : "#fffbeb";
  const statusBorder =
    status === "approved" ? "#a7f3d0" : status === "rejected" ? "#fecaca" : "#fde68a";

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono uppercase px-2 py-0.5 rounded-full"
          style={{
            fontSize: "10px",
            letterSpacing: "0.18em",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          }}
        >
          {COURSE_LEVEL_LABELS[course.level]}
        </span>
        <span
          className="font-mono uppercase px-2.5 py-0.5 rounded-full"
          style={{
            fontSize: "10px",
            letterSpacing: "0.14em",
            color: statusColor,
            backgroundColor: statusBg,
            border: `1px solid ${statusBorder}`,
          }}
        >
          {COURSE_ENROLLMENT_LABELS[status]}
        </span>
      </div>

      <h3
        className="font-sans tracking-[-0.01em]"
        style={{ fontSize: "20px", fontWeight: 700, color: "#0a0a0a" }}
      >
        {course.title}
      </h3>
      {course.description && (
        <p style={{ fontSize: "13px", color: "#525252", lineHeight: 1.5 }}>
          {course.description}
        </p>
      )}

      {status === "approved" && (
        <>
          <ProgressBar value={course.enrollment.progressPct} />
          <Link
            href={`/clienti/corsi/${encodeURIComponent(course.id)}`}
            className="self-start rounded-full px-5 py-2"
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Continua il corso →
          </Link>
        </>
      )}
      {status === "pending" && (
        <p style={{ fontSize: "13px", color: "#92400e", fontStyle: "italic" }}>
          La tua iscrizione è in attesa di approvazione — ti contattiamo entro
          24h.
        </p>
      )}
      {status === "rejected" && course.enrollment.rejectedReason && (
        <p style={{ fontSize: "13px", color: "#b91c1c", fontStyle: "italic" }}>
          Motivo: {course.enrollment.rejectedReason}
        </p>
      )}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#737373" }}>
          Avanzamento
        </span>
        <span className="font-mono tabular-nums" style={{ fontSize: "11px", color: "#0a0a0a", fontWeight: 600 }}>
          {clamped}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "#f4f3ee" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${clamped}%`, backgroundColor: "#dc2626" }}
        />
      </div>
    </div>
  );
}
