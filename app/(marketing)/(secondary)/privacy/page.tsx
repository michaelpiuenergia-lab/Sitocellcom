import type { Metadata } from "next";
import { LegalPage, LegalSection, LegalTable } from "@/components/legal/legal-page";
import { COMPANY } from "@/lib/stores";

export const metadata: Metadata = {
  title: "Informativa privacy — Fast-Fix",
  description:
    "Come Fast-Fix tratta i dati personali raccolti dal sito: finalità, basi giuridiche, destinatari, conservazione e diritti dell'interessato.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Informativa privacy"
      updatedAt="31 luglio 2026"
      intro={
        <>
          Questa informativa descrive come <strong>{COMPANY.legalName}</strong> tratta i
          dati personali raccolti attraverso questo sito, ai sensi degli articoli 13 e 14
          del Regolamento UE 2016/679 (GDPR). È scritta sui trattamenti che il sito
          esegue realmente: ogni modulo, cookie e servizio esterno elencato qui sotto
          corrisponde a una funzione effettivamente attiva.
        </>
      }
    >
      <LegalSection n="01" title="Chi tratta i tuoi dati">
        <p>
          Il titolare del trattamento è <strong>{COMPANY.legalName}</strong>, P.IVA{" "}
          {COMPANY.vatNumber}, codice fiscale {COMPANY.taxCode}, con sede in{" "}
          {COMPANY.registeredAddress}.
        </p>
        <p>
          Puoi contattarci per qualsiasi questione relativa ai tuoi dati scrivendo a{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-brand-600 hover:underline">
            {COMPANY.email}
          </a>{" "}
          o via PEC a{" "}
          <a href={`mailto:${COMPANY.pec}`} className="text-brand-600 hover:underline">
            {COMPANY.pec}
          </a>
          .
        </p>
        <p>
          Non abbiamo nominato un Responsabile della protezione dei dati (DPO): non
          ricorrono i presupposti dell&apos;articolo 37 del GDPR, non svolgendo
          monitoraggio sistematico su larga scala né trattando categorie particolari di
          dati come attività principale.
        </p>
      </LegalSection>

      <LegalSection n="02" title="Quali dati raccogliamo e perché">
        <p>
          Raccogliamo solo i dati che ci fornisci compilando un modulo o usando
          l&apos;area riservata. Non acquistiamo liste di contatti e non facciamo
          profilazione pubblicitaria.
        </p>
        <LegalTable
          head={["Trattamento", "Dati", "Base giuridica", "Conservazione"]}
          rows={[
            [
              "Registrazione rivenditore B2B",
              "Nome e cognome del referente, email, cellulare, ragione sociale, P.IVA, codice fiscale, codice SDI, PEC, sito web, indirizzo della sede, tipologia di attività, note",
              "Esecuzione di misure precontrattuali su tua richiesta (art. 6.1.b) e obblighi fiscali per i dati di fatturazione (art. 6.1.c)",
              "Fino a revoca dell'account; i dati fiscali per 10 anni come impone la normativa tributaria",
            ],
            [
              "Richieste di informazioni, preventivi, ricambi, riparazioni e valutazione usato",
              "Nome, email, telefono, azienda se indicata, messaggio, prodotto di riferimento",
              "Tuo consenso esplicito (art. 6.1.a), raccolto con la spunta sul modulo",
              "24 mesi dall'ultimo contatto, poi cancellazione",
            ],
            [
              "Area clienti e area rivenditori",
              "Email, password (conservata in forma cifrata dal gestionale), dati delle riparazioni e degli ordini associati al tuo account",
              "Esecuzione del contratto (art. 6.1.b)",
              "Per tutta la durata del rapporto, poi secondo i termini fiscali applicabili",
            ],
            [
              "Assistente virtuale (chat)",
              "Il contenuto dei messaggi che scrivi in chat e i dati che decidi di inserirci",
              "Legittimo interesse a fornire assistenza immediata (art. 6.1.f)",
              "Il tempo tecnico della conversazione; non creiamo un archivio delle chat",
            ],
            [
              "Sicurezza e diagnostica",
              "Indirizzo IP, tipo di browser, pagina di provenienza, lingua — dati che ogni server web registra",
              "Legittimo interesse a proteggere il sito da abusi e a farlo funzionare (art. 6.1.f)",
              "Log tecnici conservati per il tempo strettamente necessario alla diagnosi",
            ],
          ]}
        />
        <p>
          Il conferimento è sempre facoltativo, ma senza i dati contrassegnati come
          obbligatori nei moduli non possiamo evadere la richiesta: senza P.IVA, per
          esempio, non è possibile attivare un account rivenditore.
        </p>
      </LegalSection>

      <LegalSection n="03" title="A chi comunichiamo i dati">
        <p>
          Non vendiamo e non cediamo i tuoi dati a terzi per finalità commerciali. Li
          comunichiamo soltanto ai soggetti che ci permettono di erogare il servizio,
          nominati responsabili del trattamento ai sensi dell&apos;articolo 28 del GDPR
          dove previsto:
        </p>
        <LegalTable
          head={["Destinatario", "Ruolo", "Dove"]}
          rows={[
            [
              "Vercel Inc.",
              "Hosting del sito e log del server",
              "Unione Europea e Stati Uniti",
            ],
            [
              "Il nostro gestionale aziendale (CRM)",
              "Archivio di richieste, account, ordini e riparazioni",
              "Unione Europea",
            ],
            [
              "Anthropic PBC",
              "Elabora i messaggi dell'assistente virtuale per generare le risposte",
              "Stati Uniti",
            ],
            [
              "CARTO (basemaps)",
              "Fornisce le mappe della pagina negozi: caricandole, il tuo indirizzo IP raggiunge i loro server",
              "Unione Europea e Stati Uniti",
            ],
            [
              "Corrieri e spedizionieri",
              "Consegna di prodotti e dispositivi in riparazione",
              "Italia",
            ],
            [
              "Consulente fiscale e istituti bancari",
              "Obblighi contabili e pagamenti",
              "Italia",
            ],
          ]}
        />
        <p>
          Per i trasferimenti verso gli Stati Uniti ci appoggiamo alle Clausole
          Contrattuali Standard approvate dalla Commissione Europea e, dove applicabile,
          alla certificazione dei fornitori nell&apos;ambito del Data Privacy Framework.
        </p>
        <p>
          I dati possono inoltre essere comunicati ad autorità pubbliche quando la legge
          lo impone.
        </p>
      </LegalSection>

      <LegalSection n="04" title="Assistente virtuale: cosa sapere prima di scrivere">
        <p>
          La chat del sito è gestita da un modello di intelligenza artificiale fornito da
          Anthropic. I messaggi che scrivi vengono inviati ai loro server per generare la
          risposta.
        </p>
        <p>
          Per questo <strong>non inserire in chat dati che non vuoi trasmettere</strong>:
          password, coordinate bancarie complete, documenti d&apos;identità o dati
          sanitari. Se devi comunicarci qualcosa di riservato, usa il modulo di richiesta
          o il telefono.
        </p>
        <p>
          L&apos;assistente non prende decisioni automatizzate che producano effetti
          giuridici su di te: prepara richieste e fornisce informazioni, ma preventivi,
          approvazioni e attivazioni sono sempre valutati da una persona.
        </p>
      </LegalSection>

      <LegalSection n="05" title="Cookie">
        <p>
          Questo sito usa esclusivamente cookie tecnici, necessari a farlo funzionare.
          Non usiamo cookie di profilazione, non tracciamo la tua navigazione a fini
          pubblicitari e non condividiamo identificatori con circuiti pubblicitari — per
          questo non trovi un banner di consenso.
        </p>
        <p>
          Il dettaglio dei singoli cookie è nella{" "}
          <a href="/cookie" className="text-brand-600 hover:underline">
            cookie policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection n="06" title="Come proteggiamo i dati">
        <p>
          Il sito è servito esclusivamente su connessione cifrata (HTTPS). I cookie di
          sessione sono firmati crittograficamente e non leggibili da JavaScript, così da
          ridurre il rischio di furto di sessione. L&apos;accesso al gestionale è
          riservato al personale autorizzato.
        </p>
        <p>
          Nessun sistema è sicuro in assoluto: se dovesse verificarsi una violazione con
          rischio per i tuoi diritti, ti informeremo secondo l&apos;articolo 34 del GDPR e
          notificheremo il Garante entro 72 ore.
        </p>
      </LegalSection>

      <LegalSection n="07" title="I tuoi diritti">
        <p>Puoi chiederci in qualsiasi momento di:</p>
        <ul className="flex flex-col gap-2 pl-5" style={{ listStyle: "disc" }}>
          <li>accedere ai dati che ti riguardano e riceverne copia (art. 15);</li>
          <li>correggerli se sono inesatti o incompleti (art. 16);</li>
          <li>cancellarli, quando non abbiamo obblighi di legge a conservarli (art. 17);</li>
          <li>limitarne il trattamento o opporti al medesimo (artt. 18 e 21);</li>
          <li>
            riceverli in formato leggibile da un computer per trasferirli altrove (art.
            20);
          </li>
          <li>
            revocare il consenso prestato, senza che ciò tocchi la liceità di quanto
            fatto prima della revoca.
          </li>
        </ul>
        <p>
          Scrivi a{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-brand-600 hover:underline">
            {COMPANY.email}
          </a>
          : rispondiamo entro un mese. Se ritieni che il trattamento violi il GDPR puoi
          rivolgerti al Garante per la protezione dei dati personali (
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            garanteprivacy.it
          </a>
          ) o all&apos;autorità dello Stato in cui risiedi.
        </p>
      </LegalSection>

      <LegalSection n="08" title="Minori">
        <p>
          I servizi del sito si rivolgono a maggiorenni e ad aziende. Non raccogliamo
          consapevolmente dati di minori di 14 anni; se ci accorgiamo di averlo fatto, li
          cancelliamo.
        </p>
      </LegalSection>

      <LegalSection n="09" title="Modifiche">
        <p>
          Possiamo aggiornare questa informativa se cambiano i servizi o la normativa. La
          data in cima indica sempre l&apos;ultima revisione; se le modifiche saranno
          sostanziali te lo segnaleremo sul sito.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
