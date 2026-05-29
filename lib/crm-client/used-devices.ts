import "server-only";

import { crmFetch } from "./client";
import type {
  UsedDevice,
  UsedDeviceListParams,
  UsedDeviceListResponse,
} from "./types";

/**
 * Le foto dell'usato arrivano come URL relativi al dominio CRM
 * (es. `/usato/cellcom/<id>/1.jpg`). Le rendiamo assolute prefissando
 * l'origin del CRM (derivato da CRM_API_URL). Gli URL già assoluti
 * (http/https) restano invariati.
 */
function crmOrigin(): string | null {
  const base = process.env.CRM_API_URL;
  if (!base) return null;
  try {
    return new URL(base).origin;
  } catch {
    return null;
  }
}

function absolutizePhoto(url: string, origin: string | null): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (!origin) return url;
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

function fixDevice(device: UsedDevice, origin: string | null): UsedDevice {
  return {
    ...device,
    photos: device.photos.map((p) => absolutizePhoto(p, origin)),
  };
}

export async function getUsedDevices(
  params: UsedDeviceListParams = {},
): Promise<UsedDeviceListResponse> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const query = qs.toString();
  const path = `/api/v1/public/used-devices${query ? `?${query}` : ""}`;

  const res = await crmFetch<UsedDeviceListResponse>(path, {
    revalidate: 60,
    tags: [
      "crm:used-devices",
      ...(params.channel ? [`crm:used-devices:${params.channel}`] : []),
    ],
  });

  const origin = crmOrigin();
  return { ...res, items: res.items.map((d) => fixDevice(d, origin)) };
}
