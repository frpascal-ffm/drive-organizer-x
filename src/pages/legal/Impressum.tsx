import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" /> Zurück zur Startseite
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Impressum</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
            <p>
              MietFleet<br />
              [Firmenname / Vor- und Nachname des Betreibers]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:info@mietfleet.de" className="text-primary hover:underline">info@mietfleet.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Vertretungsberechtigte Person(en)</h2>
            <p>[Name der vertretungsberechtigten Person(en)]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Registereintrag</h2>
            <p>
              Eintragung im Handelsregister.<br />
              Registergericht: [Amtsgericht]<br />
              Registernummer: [HRB-Nummer]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Umsatzsteuer-Identifikationsnummer</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
              [DE XXXXXXXXX]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              [Name]<br />
              [Adresse]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
              zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>
        </div>

        <p className="text-xs text-muted-foreground mt-12">
          Hinweis: Bitte ergänzen Sie die Platzhalter [in eckigen Klammern] mit Ihren tatsächlichen Unternehmensdaten.
        </p>
      </div>
    </div>
  );
}
