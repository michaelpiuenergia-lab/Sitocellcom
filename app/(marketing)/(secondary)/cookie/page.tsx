import type { Metadata } from "next";
import { LegalPage, LegalSection, LegalTable } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  alternates: { canonical: "/cookie" },
  title: "Cookie policy — Fast-Fix",
  description:
    "I cookie usati da Fast-Fix: solo tecnici e necessari, nessuna profilazione. Elenco completo, durata e come disattivarli.",
};

export default function CookiePage() {
  return (
    <LegalPage
      title="Cookie policy"
      updatedAt="31 luglio 2026"
      intro={
        <>
          Questo sito usa <strong>tre cookie, tutti tecnici</strong>. Non c&apos;è
          profilazione, non c&apos;è pubblicità comportamentale e non condividiamo
          identificatori con circuiti pubblicitari. Per i cookie strettamente necessari
          la legge non richiede il tuo consenso preventivo — è il motivo per cui non ti
          accoglie nessun banner.
        </>
      }
    >
      <LegalSection n="01" title="Cosa sono">
        <p>
          I cookie sono piccoli file che un sito salva nel browser per ricordare
          qualcosa tra una pagina e l&apos;altra: che hai fatto l&apos;accesso, in che
          lingua vuoi leggere. Senza di essi il sito non saprebbe chi sei a ogni clic.
        </p>
      </LegalSection>

      <LegalSection n="02" title="Quelli che usiamo, uno per uno">
        <LegalTable
          head={["Nome", "A cosa serve", "Durata", "Tipo"]}
          rows={[
            [
              <code key="c1">customer_session</code>,
              "Ti tiene autenticato nell'area clienti e permette di vedere lo stato delle tue riparazioni. È firmato crittograficamente e non leggibile da JavaScript.",
              "24 ore",
              "Tecnico necessario",
            ],
            [
              <code key="c2">b2b_session</code>,
              "Come il precedente, ma per l'area rivenditori: consente di vedere il listino riservato, ordini e fatture.",
              "24 ore, rinnovate a ogni utilizzo",
              "Tecnico necessario",
            ],
            [
              <code key="c3">cellcom_lang</code>,
              "Ricorda se preferisci il sito in italiano o in inglese, così non devi riselezionarlo ogni volta.",
              "1 anno",
              "Tecnico di preferenza",
            ],
          ]}
        />
        <p>
          I due cookie di sessione vengono creati <strong>solo dopo che accedi</strong>:
          se navighi senza autenticarti, il tuo browser conserva al massimo la
          preferenza di lingua.
        </p>
      </LegalSection>

      <LegalSection n="03" title="Cosa NON usiamo">
        <p>
          Per chiarezza, ecco cosa questo sito non fa: nessun cookie di profilazione,
          nessun pixel di tracciamento pubblicitario, nessun servizio di statistiche di
          terze parti, nessuna condivisione di dati con circuiti di advertising, nessun
          pulsante social che tracci la navigazione.
        </p>
        <p>
          I caratteri tipografici sono ospitati direttamente dal nostro dominio: aprendo
          il sito il tuo browser non contatta i server di Google Fonts.
        </p>
      </LegalSection>

      <LegalSection n="04" title="Contenuti esterni che caricano risorse">
        <p>
          Alcune pagine mostrano contenuti serviti da terzi. Non installano cookie di
          profilazione, ma per caricarsi ricevono il tuo indirizzo IP, come accade con
          qualsiasi risorsa presa da un altro dominio:
        </p>
        <LegalTable
          head={["Dove", "Fornitore", "Perché"]}
          rows={[
            [
              "Pagina negozi",
              "CARTO",
              "Fornisce le mattonelle grafiche della mappa delle sedi",
            ],
            [
              "Schede prodotto",
              "cellcom.it",
              "Ospita le fotografie dei prodotti a catalogo",
            ],
            [
              "Assistente virtuale",
              "Anthropic",
              "Elabora i messaggi della chat per generare le risposte",
            ],
          ]}
        />
      </LegalSection>

      <LegalSection n="05" title="Come disattivarli">
        <p>
          Puoi bloccare o cancellare i cookie dalle impostazioni del browser: cerca la
          voce &quot;Privacy e sicurezza&quot; in Chrome, Firefox, Safari o Edge.
        </p>
        <p>
          Tieni presente che bloccando i cookie tecnici <strong>non potrai più
          accedere</strong> all&apos;area clienti né all&apos;area rivenditori: sono
          proprio quelli che mantengono l&apos;accesso. La navigazione del catalogo
          pubblico invece continua a funzionare.
        </p>
      </LegalSection>

      <LegalSection n="06" title="Per saperne di più">
        <p>
          Il quadro completo dei trattamenti, delle basi giuridiche e dei tuoi diritti è
          nell&apos;
          <a href="/privacy" className="text-brand-600 hover:underline">
            informativa privacy
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
