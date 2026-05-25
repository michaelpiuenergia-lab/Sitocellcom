"use client";

import { useId } from "react";

type Variant = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Silhouette stilizzate dei telefoni — placeholder finché non arrivano foto vere.
 *
 * Palette schiarita per essere leggibile su card scure (#0a0a0a / #141414):
 * scocca #3c3c3c → stroke #525252, schermo #1a1a1a, accent rosso brand-600.
 * Drop-shadow rosso sottile per integrarsi col glow ambient del container.
 */
export function PhoneSilhouette({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  const gradientId = useId();
  const baseClass =
    className ??
    "w-[200px] h-[420px] drop-shadow-[0_20px_40px_rgba(220,38,38,0.18)]";

  if (variant === 1) {
    return (
      <svg className={baseClass} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#0e0e0e" />
          </linearGradient>
        </defs>
        <rect x="8" y="4" width="184" height="412" rx="36" fill="#3c3c3c" stroke="#525252" strokeWidth="1.2" />
        <rect x="14" y="10" width="172" height="400" rx="30" fill={`url(#${gradientId})`} />
        <rect x="70" y="22" width="60" height="22" rx="11" fill="#080808" />
        <circle cx="118" cy="33" r="3" fill="#262626" />
        <rect x="30" y="60" width="140" height="2.5" rx="1.25" fill="#dc2626" opacity="0.7" />
      </svg>
    );
  }

  if (variant === 2) {
    return (
      <svg className={baseClass} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="188" height="412" rx="32" fill="#404040" stroke="#525252" strokeWidth="1.2" />
        <rect x="12" y="10" width="176" height="400" rx="26" fill="#141414" />
        <circle cx="100" cy="32" r="6" fill="#080808" stroke="#262626" strokeWidth="0.5" />
        <rect x="40" y="380" width="120" height="3" rx="1.5" fill="#525252" />
        <rect x="20" y="100" width="160" height="0.5" fill="#dc2626" opacity="0.3" />
      </svg>
    );
  }

  if (variant === 3) {
    return (
      <svg className={baseClass} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="4" width="184" height="412" rx="40" fill="#383838" stroke="#525252" strokeWidth="1.2" />
        <rect x="14" y="10" width="172" height="400" rx="34" fill="#0f0f0f" />
        <rect x="80" y="20" width="40" height="20" rx="10" fill="#080808" />
        <rect x="30" y="380" width="140" height="3" rx="1.5" fill="#dc2626" opacity="0.75" />
      </svg>
    );
  }

  if (variant === 4) {
    return (
      <svg className={baseClass} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="4" width="180" height="412" rx="28" fill="#454545" stroke="#525252" strokeWidth="1.2" />
        <rect x="16" y="38" width="168" height="340" rx="4" fill="#141414" />
        <circle cx="100" cy="395" r="14" fill="#262626" stroke="#3a3a3a" strokeWidth="1" />
        <rect x="80" y="20" width="40" height="4" rx="2" fill="#525252" />
        <rect x="20" y="60" width="160" height="0.5" fill="#dc2626" opacity="0.25" />
      </svg>
    );
  }

  if (variant === 5) {
    return (
      <svg className={baseClass} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 8,40 Q 8,4 44,4 L 156,4 Q 192,4 192,40 L 192,380 Q 192,416 156,416 L 44,416 Q 8,416 8,380 Z"
          fill="#3c3c3c"
          stroke="#525252"
          strokeWidth="1.2"
        />
        <path
          d="M 16,40 Q 16,12 44,12 L 156,12 Q 184,12 184,40 L 184,380 Q 184,408 156,408 L 44,408 Q 16,408 16,380 Z"
          fill="#101010"
        />
        <rect x="70" y="22" width="60" height="6" rx="3" fill="#080808" />
        <rect x="20" y="200" width="160" height="0.5" fill="#dc2626" opacity="0.4" />
      </svg>
    );
  }

  // variant 6
  return (
    <svg className={baseClass} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="184" height="412" rx="36" fill="#3a3a3a" stroke="#525252" strokeWidth="1.2" />
      <rect x="14" y="10" width="172" height="400" rx="30" fill="#0e0e0e" />
      <rect x="70" y="22" width="60" height="22" rx="11" fill="#080808" />
      <rect x="60" y="60" width="80" height="80" rx="8" fill="#262626" opacity="0.6" stroke="#3a3a3a" strokeWidth="0.5" />
      <rect x="30" y="380" width="140" height="2.5" rx="1.25" fill="#dc2626" opacity="0.8" />
    </svg>
  );
}
