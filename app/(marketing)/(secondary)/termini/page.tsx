import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { COMPANY } from "@/lib/stores";

export const metadata: Metadata = {
  alternates: { canonical: "/termini" },
  title: "Termini di utilizzo — Fast-Fix",
  description:
    "Condizioni d'uso del sito Fast-Fix: richieste, preventivi, area riservata, proprietà dei contenuti e legge applicabile.",
};

export default function TerminiPage() {
  return (
    <LegalPage
      title="Termini di utilizzo"
      updatedAt="31 luglio 2026"
      intro={
        <>
          Queste condizioni regolano l&apos;uso del sito di{" "}
          <strong>{COMPANY.legalName}</strong>. Riguardano il sito e i suoi moduli: le
          condizioni economiche di una riparazione, di una fornitura o di un corso sono
          quelle del preventivo o dell&apos;ordine che ti sottoponiamo e che accetti di
          volta in volta.
        </>
      }
    >
      <LegalSection n="01" title="Cosa puoi fare da qui">
        <p>
          Il sito è una vetrina e un canale di contatto: puoi consultare il catalogo,
          richiedere una riparazione, chiedere la valutazione del tuo usato, informarti
          sui corsi e domandare l&apos;attivazione di un account rivenditore.
        </p>
        <p>
          <strong>Il sito non conclude vendite online</strong>: non c&apos;è carrello né
          pagamento. Ogni richiesta inviata da qui è una manifestazione di interesse, non
          un ordine vincolante. Il contratto nasce solo quando accetti un nostro
          preventivo o confermi un ordine.
        </p>
      </LegalSection>

      <LegalSection n="02" title="Prezzi e disponibilità">
        <p>
          I prezzi e le giacenze mostrati provengono dal nostro gestionale e possono
          cambiare. Facciamo il possibile per tenerli allineati, ma un errore materiale o
          un disallineamento temporaneo non ci vincola: in quel caso ti avvisiamo prima
          di procedere e sei libero di rinunciare.
        </p>
        <p>
          Alcuni prezzi sono visibili solo dopo l&apos;accesso, e i prezzi riservati ai
          rivenditori valgono esclusivamente per i titolari di un account B2B attivo.
          Sono informazioni commerciali riservate: non vanno diffuse a terzi.
        </p>
        <p>
          Per alcuni articoli, tipicamente i ricambi, il prezzo è indicato come
          &quot;su richiesta&quot;: te lo comunichiamo rispondendo alla tua richiesta.
        </p>
      </LegalSection>

      <LegalSection n="03" title="Riparazioni">
        <p>
          La diagnosi è gratuita e il preventivo ti arriva entro 24 ore lavorative. Se
          lo rifiuti non ti addebitiamo nulla e ti restituiamo il dispositivo.
        </p>
        <p>
          Sugli interventi applichiamo 12 mesi di garanzia su manodopera e ricambi
          impiegati. La garanzia non copre danni successivi all&apos;intervento —
          cadute, liquidi, manomissioni o riparazioni fatte altrove — né difetti diversi
          da quello riparato.
        </p>
        <p>
          <strong>Fai un backup prima di consegnarci il dispositivo.</strong> Alcuni
          interventi comportano la perdita dei dati e non possiamo garantirne la
          conservazione. Rimuovi anche eventuali blocchi di attivazione o account che
          impediscano il collaudo.
        </p>
        <p>
          I dispositivi non ritirati entro sei mesi dalla comunicazione di lavoro
          ultimato potranno essere smaltiti o recuperati a copertura delle spese, previo
          nostro ulteriore avviso scritto.
        </p>
      </LegalSection>

      <LegalSection n="04" title="Valutazione e acquisto dell'usato">
        <p>
          La valutazione che ti comunichiamo si basa sulle informazioni e sulle
          fotografie che ci fornisci. È vincolante solo se il dispositivo, alla verifica,
          corrisponde a quanto dichiarato: se troviamo differenze rilevanti ti
          ricontattiamo prima di chiudere, e sei libero di rifiutare e riavere il
          dispositivo senza spese.
        </p>
        <p>
          Vendendoci un dispositivo dichiari di esserne il legittimo proprietario, che
          non provenga da furto o smarrimento e che sia libero da blocchi di attivazione
          o vincoli con operatori o finanziarie.
        </p>
      </LegalSection>

      <LegalSection n="05" title="Area riservata e account">
        <p>
          Gli account dell&apos;area clienti e dell&apos;area rivenditori sono personali.
          Sei responsabile della riservatezza delle tue credenziali e delle attività
          svolte con esse: se sospetti un accesso non autorizzato, avvisaci subito.
        </p>
        <p>
          L&apos;attivazione di un account rivenditore è soggetta a verifica: possiamo
          chiederti la visura camerale e un&apos;autocertificazione per il regime di
          reverse charge, e possiamo rifiutare o revocare l&apos;attivazione se i
          requisiti non risultano soddisfatti.
        </p>
      </LegalSection>

      <LegalSection n="06" title="Uso corretto del sito">
        <p>
          Ti chiediamo di non tentare accessi non autorizzati, di non estrarre
          massivamente i contenuti con strumenti automatici, di non sovraccaricare
          l&apos;infrastruttura e di non inviare tramite i moduli contenuti illeciti,
          offensivi o dati di altre persone senza il loro consenso.
        </p>
        <p>
          Possiamo sospendere l&apos;accesso a chi non rispetta queste regole.
        </p>
      </LegalSection>

      <LegalSection n="07" title="Contenuti del sito">
        <p>
          Testi, grafica, logo e struttura del sito sono di nostra proprietà o ci sono
          concessi in licenza; puoi consultarli e condividerne i link, ma non
          riprodurli per scopi commerciali senza autorizzazione scritta.
        </p>
        <p>
          I marchi dei produttori citati (Apple, Samsung e gli altri) appartengono ai
          rispettivi titolari e compaiono solo per identificare i dispositivi su cui
          interveniamo o gli articoli che trattiamo. Non siamo un centro di assistenza
          autorizzato di quei produttori, salvo dove diversamente e specificamente
          indicato.
        </p>
      </LegalSection>

      <LegalSection n="08" title="Disponibilità del servizio">
        <p>
          Ci impegniamo a mantenere il sito raggiungibile, ma può essere sospeso per
          manutenzione o per cause fuori dal nostro controllo. Non rispondiamo dei danni
          derivanti da interruzioni temporanee né dell&apos;affidabilità dei siti di
          terzi eventualmente collegati.
        </p>
      </LegalSection>

      <LegalSection n="09" title="Consumatori, legge applicabile e controversie">
        <p>
          Se agisci come consumatore restano impregiudicati i diritti che il Codice del
          Consumo ti riconosce, incluse le garanzie legali di conformità e, dove
          applicabile ai contratti conclusi a distanza, il diritto di recesso nei termini
          di legge.
        </p>
        <p>
          Questi termini sono regolati dalla legge italiana. Per il consumatore è
          competente il foro del suo luogo di residenza o domicilio; per i rapporti tra
          professionisti è competente in via esclusiva il foro di Ascoli Piceno.
        </p>
        <p>
          Puoi inoltre ricorrere alla piattaforma europea di risoluzione delle
          controversie online, raggiungibile dal sito della Commissione Europea.
        </p>
      </LegalSection>

      <LegalSection n="10" title="Trattamento dei dati">
        <p>
          Come trattiamo i dati personali è spiegato nell&apos;
          <a href="/privacy" className="text-brand-600 hover:underline">
            informativa privacy
          </a>{" "}
          e nella{" "}
          <a href="/cookie" className="text-brand-600 hover:underline">
            cookie policy
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
