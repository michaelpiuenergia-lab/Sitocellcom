"use client";

import { useEffect } from "react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Catalog error:", error);
  }, [error]);

  return (
    <div className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto flex items-center justify-center">
      <div className="text-center flex flex-col gap-6 max-w-md">
        <div className="text-5xl">📦</div>
        <h1 className="font-serif text-2xl text-foreground">
          Catalogo temporaneamente non disponibile
        </h1>
        <p className="text-muted-foreground">
          Riprova tra qualche minuto. Stiamo lavorando per ripristinare il servizio.
        </p>
        <button
          onClick={reset}
          className="mx-auto px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300"
        >
          Ricarica
        </button>
      </div>
    </div>
  );
}
