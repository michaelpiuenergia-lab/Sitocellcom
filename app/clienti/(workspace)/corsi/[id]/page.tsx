import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCustomerSession } from "@/lib/auth/customer-guards";
import { getCustomerCourses, getCustomerCourseVideos } from "@/lib/crm-client";
import {
  COURSE_LEVEL_LABELS,
  type CourseVideo,
  type CustomerCourse,
} from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const { sessionToken } = await requireCustomerSession(`/clienti/corsi/${id}`);

  const courses = await getCustomerCourses(sessionToken).catch(() => ({
    items: [] as CustomerCourse[],
  }));
  const course = courses.items.find((c) => c.id === id);
  if (!course) notFound();

  // Solo gli approved possono vedere i video
  let videos: CourseVideo[] = [];
  let videoError: string | null = null;
  if (course.enrollment.approvalStatus === "approved") {
    try {
      const v = await getCustomerCourseVideos(sessionToken, id);
      videos = v.items;
    } catch (e) {
      videoError = e instanceof Error ? e.message : "Video non disponibili";
    }
  }

  return (
    <main className="pt-12 pb-16 px-6 lg:px-12 max-w-[1100px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link href="/clienti/corsi" style={{ fontSize: "13px", color: "#737373" }}>
          ← I tuoi corsi
        </Link>
        <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#dc2626" }}>
          {COURSE_LEVEL_LABELS[course.level]} · Cellcom Academy
        </span>
        <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
          {course.title}
        </h1>
        {course.description && (
          <p style={{ fontSize: "15px", color: "#525252", maxWidth: "720px", lineHeight: 1.6 }}>
            {course.description}
          </p>
        )}
      </div>

      {course.enrollment.approvalStatus === "pending" && (
        <PendingNotice />
      )}
      {course.enrollment.approvalStatus === "rejected" && (
        <RejectedNotice reason={course.enrollment.rejectedReason} />
      )}

      {course.enrollment.approvalStatus === "approved" && (
        <>
          {videoError && (
            <p
              className="rounded-xl px-4 py-3"
              style={{
                fontSize: "14px",
                color: "#b91c1c",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              {videoError}
            </p>
          )}
          {videos.length === 0 && !videoError ? (
            <p style={{ fontSize: "15px", color: "#737373", fontStyle: "italic" }}>
              I video di questo corso saranno disponibili a breve.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {videos
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

function VideoCard({ video }: { video: CourseVideo }) {
  const completed = video.watchedSec >= video.durationSec;
  const progressPct = Math.min(100, Math.round((video.watchedSec / video.durationSec) * 100));
  return (
    <article
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          className="font-sans tracking-[-0.01em]"
          style={{ fontSize: "18px", fontWeight: 700, color: "#0a0a0a" }}
        >
          {video.title}
        </h2>
        <span className="font-mono tabular-nums" style={{ fontSize: "12px", color: "#737373" }}>
          {fmtDuration(video.durationSec)}
        </span>
      </div>
      {video.description && (
        <p style={{ fontSize: "13px", color: "#525252", lineHeight: 1.5 }}>
          {video.description}
        </p>
      )}
      <video
        controls
        controlsList="nodownload"
        preload="metadata"
        className="w-full rounded-xl"
        style={{ backgroundColor: "#000", aspectRatio: "16/9" }}
      >
        <source src={video.videoUrl} />
        Il tuo browser non supporta video HTML5.
      </video>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#f4f3ee" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              backgroundColor: completed ? "#15803d" : "#dc2626",
            }}
          />
        </div>
        <span className="font-mono tabular-nums" style={{ fontSize: "11px", color: completed ? "#15803d" : "#525252", fontWeight: 600 }}>
          {completed ? "Completato" : `${progressPct}%`}
        </span>
      </div>
    </article>
  );
}

function PendingNotice() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-2"
      style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
    >
      <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#92400e" }}>
        Iscrizione in attesa
      </span>
      <p style={{ fontSize: "15px", color: "#92400e", lineHeight: 1.5 }}>
        Il tuo accesso ai video sarà attivo dopo l&apos;approvazione dello staff.
        Ti contattiamo entro 24h.
      </p>
    </div>
  );
}

function RejectedNotice({ reason }: { reason: string | null }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-2"
      style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
    >
      <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#b91c1c" }}>
        Iscrizione non approvata
      </span>
      <p style={{ fontSize: "15px", color: "#b91c1c", lineHeight: 1.5 }}>
        {reason ?? "Contatta b2b@cellcom.it per maggiori informazioni."}
      </p>
    </div>
  );
}
