import "server-only";

import { crmFetch } from "./client";
import type {
  CoursesPublicResponse,
  CustomerCoursesResponse,
  CourseVideosResponse,
} from "./types";

/**
 * Endpoint Cellcom Academy esposti dal CRM (Brief §10).
 *
 * - public/courses: lista pubblicabile (titolo, livello, prezzo, link pagamento)
 * - customer/courses: corsi del cliente autenticato con enrollment nested
 * - customer/courses/{id}/videos: lista video accessibile solo se approved
 */

export async function getCourses(): Promise<CoursesPublicResponse> {
  return crmFetch<CoursesPublicResponse>("/api/v1/public/courses");
}

export async function getCustomerCourses(
  sessionToken: string,
): Promise<CustomerCoursesResponse> {
  return crmFetch<CustomerCoursesResponse>(
    "/api/v1/public/customer/courses",
    {
      cache: "no-store",
      extraHeaders: { "X-Customer-Session": sessionToken },
    },
  );
}

export async function getCustomerCourseVideos(
  sessionToken: string,
  courseId: string,
): Promise<CourseVideosResponse> {
  return crmFetch<CourseVideosResponse>(
    `/api/v1/public/customer/courses/${encodeURIComponent(courseId)}/videos`,
    {
      cache: "no-store",
      extraHeaders: { "X-Customer-Session": sessionToken },
    },
  );
}
