"use client";

import { useId } from "react";

type Variant = 1 | 2 | 3 | 4 | 5 | 6;

export function PhoneSilhouette({ variant, className }: { variant: Variant; className?: string }) {
  const gradientId = useId();

  if (variant === 1) {
    return (
      <svg
        className={className ?? "w-[200px] h-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"}
        viewBox="0 0 200 420"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
        </defs>
        <rect x="8" y="4" width="184" height="412" rx="36" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
        <rect x="14" y="10" width="172" height="400" rx="30" fill={`url(#${gradientId})`} />
        <rect x="70" y="22" width="60" height="22" rx="11" fill="#050505" />
        <circle cx="118" cy="33" r="3" fill="#1a1a1a" />
        <rect x="30" y="60" width="140" height="2" rx="1" fill="#dc2626" opacity="0.4" />
      </svg>
    );
  }

  if (variant === 2) {
    return (
      <svg className={className ?? "w-[200px] h-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="188" height="412" rx="32" fill="#2c2c2c" stroke="#3a3a3a" strokeWidth="1" />
        <rect x="12" y="10" width="176" height="400" rx="26" fill="#0a0a0a" />
        <circle cx="100" cy="32" r="6" fill="#050505" />
        <rect x="40" y="380" width="120" height="3" rx="1.5" fill="#404040" />
      </svg>
    );
  }

  if (variant === 3) {
    return (
      <svg className={className ?? "w-[200px] h-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="4" width="184" height="412" rx="40" fill="#252525" stroke="#3a3a3a" strokeWidth="1" />
        <rect x="14" y="10" width="172" height="400" rx="34" fill="#080808" />
        <rect x="80" y="20" width="40" height="20" rx="10" fill="#050505" />
        <rect x="30" y="380" width="140" height="3" rx="1.5" fill="#dc2626" opacity="0.5" />
      </svg>
    );
  }

  if (variant === 4) {
    return (
      <svg className={className ?? "w-[200px] h-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="4" width="180" height="412" rx="28" fill="#303030" stroke="#3a3a3a" strokeWidth="1" />
        <rect x="16" y="38" width="168" height="340" rx="4" fill="#0a0a0a" />
        <circle cx="100" cy="395" r="14" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
        <rect x="80" y="20" width="40" height="4" rx="2" fill="#404040" />
      </svg>
    );
  }

  if (variant === 5) {
    return (
      <svg className={className ?? "w-[200px] h-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"} viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
        <path d="M 8,40 Q 8,4 44,4 L 156,4 Q 192,4 192,40 L 192,380 Q 192,416 156,416 L 44,416 Q 8,416 8,380 Z" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
        <path d="M 16,40 Q 16,12 44,12 L 156,12 Q 184,12 184,40 L 184,380 Q 184,408 156,408 L 44,408 Q 16,408 16,380 Z" fill="#0a0a0a" />
        <rect x="70" y="22" width="60" height="6" rx="3" fill="#050505" />
      </svg>
    );
  }

  // variant 6
  return (
    <svg className="w-[200px] h-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="184" height="412" rx="36" fill="#282828" stroke="#3a3a3a" strokeWidth="1" />
      <rect x="14" y="10" width="172" height="400" rx="30" fill="#080808" />
      <rect x="70" y="22" width="60" height="22" rx="11" fill="#050505" />
      <rect x="60" y="60" width="80" height="80" rx="8" fill="#1a1a1a" opacity="0.5" />
      <rect x="30" y="380" width="140" height="2" rx="1" fill="#dc2626" opacity="0.6" />
    </svg>
  );
}
