import "server-only";

import type {
  CoursesPublicResponse,
  CustomerCoursesResponse,
  CourseVideosResponse,
  CoursePublic,
} from "./types";

/**
 * Mock corsi — usato finché il CRM non è raggiungibile dal HUB.
 * Tre livelli standard Cellcom Academy: base, intermedio, avanzato BGA.
 */

const MOCK_COURSES: CoursePublic[] = [
  {
    id: "crs-base",
    slug: "base",
    title: "Base — riparazione smartphone",
    level: "base",
    description:
      "Smontaggio/montaggio iPhone e Android, sostituzione schermo e batteria, gestione adesivi e guarnizioni. Pensato per chi parte da zero o vuole formalizzare le basi.",
    durationLabel: "2 giornate",
    priceCents: 49000,
    paymentLink: "https://example.com/pay/base",
    coverUrl: null,
  },
  {
    id: "crs-intermedio",
    slug: "intermedio",
    title: "Intermedio — calibrazione e sigillatura",
    level: "intermedio",
    description:
      "Riparazione scocca, vetro posteriore, fotocamera, connettore di ricarica. Calibrazione True Tone, sigillatura impermeabile. Uso del microscopio.",
    durationLabel: "3 giornate",
    priceCents: 79000,
    paymentLink: "https://example.com/pay/intermedio",
    coverUrl: null,
  },
  {
    id: "crs-avanzato",
    slug: "avanzato",
    title: "Avanzato BGA — microsaldatura",
    level: "avanzato",
    description:
      "Microsaldatura, riparazione scheda madre, gestione ball BGA, dump NAND, recupero dati. Postazioni ESD, stazione ad aria calda professionale.",
    durationLabel: "5 giornate",
    priceCents: 129000,
    paymentLink: "https://example.com/pay/avanzato",
    coverUrl: null,
  },
];

export async function getCourses(): Promise<CoursesPublicResponse> {
  return { items: MOCK_COURSES, total: MOCK_COURSES.length };
}

export async function getCustomerCourses(
  _sessionToken: string,
): Promise<CustomerCoursesResponse> {
  void _sessionToken;
  // Mock: 1 corso approvato, 1 pending. Vuoto per nuovi customer.
  return {
    items: [
      {
        ...MOCK_COURSES[0]!,
        enrollment: {
          approvalStatus: "approved",
          progressPct: 35,
          enrolledAt: "2026-05-20T09:00:00.000Z",
          approvedAt: "2026-05-20T14:00:00.000Z",
          rejectedReason: null,
        },
      },
      {
        ...MOCK_COURSES[1]!,
        enrollment: {
          approvalStatus: "pending",
          progressPct: 0,
          enrolledAt: "2026-05-28T11:00:00.000Z",
          approvedAt: null,
          rejectedReason: null,
        },
      },
    ],
  };
}

export async function getCustomerCourseVideos(
  _sessionToken: string,
  courseId: string,
): Promise<CourseVideosResponse> {
  void _sessionToken;
  if (courseId !== "crs-base") {
    const err = new Error("Accesso negato — corso non approvato");
    (err as Error & { code?: string }).code = "FORBIDDEN";
    throw err;
  }
  return {
    items: [
      {
        id: "vid-1",
        title: "Introduzione al laboratorio",
        description: "Strumenti, sicurezza, postazione ESD.",
        durationSec: 480,
        videoUrl: "/corsi/videos/intro.mp4",
        watchedSec: 480,
        order: 1,
      },
      {
        id: "vid-2",
        title: "Smontaggio iPhone — primo screen",
        description: "Apertura, viti pentalobe, gestione adesivo.",
        durationSec: 720,
        videoUrl: "/corsi/videos/iphone-screen.mp4",
        watchedSec: 360,
        order: 2,
      },
      {
        id: "vid-3",
        title: "Sostituzione batteria",
        description: "Rimozione adesivo, test capacità, riassemblaggio.",
        durationSec: 540,
        videoUrl: "/corsi/videos/battery.mp4",
        watchedSec: 0,
        order: 3,
      },
    ],
  };
}
