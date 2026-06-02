"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

/**
 * Provider globale TanStack Query.
 *
 * Default sensati per un sito B2C/B2B medio:
 * - staleTime 30s → meno refetch su navigazione SPA
 * - retry: 1 → no thrash su errori transienti, ma comunque 1 tentativo
 * - refetchOnWindowFocus solo per mutazioni critiche (default off su query)
 *
 * Uso: avvolge i componenti client che usano useQuery/useMutation. Per
 * ora montato globalmente; i Server Components NON dipendono da React Query
 * (fanno fetch direttamente).
 */

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
};

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState evita ri-creazione del client su hot-reload / re-render
  const [client] = useState(() => new QueryClient({ defaultOptions }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
