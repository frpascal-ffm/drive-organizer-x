import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" /> Zurück zur Startseite
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-medium mb-1">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
              passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
              persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Verantwortliche Stelle</h2>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              MietFleet<br />
              [Firmenname / Vor- und Nachname]<br />
              [Adresse]<br /><br />
              E-Mail: <a href="mailto:info@mietfleet.de" className="text-primary hover:underline">info@mietfleet.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-lg font-medium mb-1">Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät
              speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>
            <p>
              Einige Cookies sind „Session-Cookies" und werden nach Ende Ihrer Browser-Sitzung automatisch gelöscht.
              Andere Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen oder sie ablaufen.
            </p>

            <h3 className="text-lg font-medium mb-1 mt-4">Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten
              Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Browsertyp und Browserversion</li>
              <li>Verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Registrierung und Nutzerkonto</h2>
            <p>
              Sie können sich auf unserer Website registrieren, um zusätzliche Funktionen nutzen zu können.
              Dabei werden folgende Daten erhoben:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>E-Mail-Adresse</li>
              <li>Name (bei Google-Anmeldung)</li>
              <li>Profilbild (bei Google-Anmeldung)</li>
            </ul>
            <p>
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Zahlungsabwicklung</h2>
            <p>
              Für die Zahlungsabwicklung nutzen wir den Dienst <strong>Stripe</strong> (Stripe, Inc., 510 Townsend Street,
              San Francisco, CA 94103, USA). Stripe verarbeitet Zahlungsdaten in unserem Auftrag.
              Weitere Informationen finden Sie in der{" "}
              <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Datenschutzerklärung von Stripe
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Hosting</h2>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet. Die personenbezogenen Daten, die auf
              dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Die Nutzung erfolgt
              auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Auskunft über Ihre gespeicherten Daten zu erhalten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit zu verlangen (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO)</li>
            </ul>
            <p className="mt-2">
              Bei Fragen wenden Sie sich an:{" "}
              <a href="mailto:info@mietfleet.de" className="text-primary hover:underline">info@mietfleet.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Änderungen</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen
              rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Stand: März 2026</p>
          </section>
        </div>
      </div>
    </div>
  );
}
