import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieRichtlinie() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" /> Zurück zur Startseite
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Cookie-Richtlinie</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">Was sind Cookies?</h2>
            <p>
              Cookies sind kleine Textdateien, die von Websites auf Ihrem Gerät gespeichert werden.
              Sie dienen dazu, Ihr Nutzungserlebnis zu verbessern und bestimmte Funktionen zu ermöglichen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Welche Cookies verwenden wir?</h2>

            <h3 className="text-lg font-medium mb-1">Notwendige Cookies</h3>
            <p>
              Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht
              deaktiviert werden. Sie werden in der Regel als Reaktion auf Ihre Aktionen gesetzt,
              wie z. B. das Anmelden oder das Ausfüllen von Formularen.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Authentifizierung:</strong> Speicherung Ihrer Sitzungsdaten nach dem Login</li>
              <li><strong>Sicherheit:</strong> CSRF-Token und ähnliche Sicherheitsmechanismen</li>
              <li><strong>Einstellungen:</strong> Sprachauswahl und Theme-Präferenzen (z. B. Dark Mode)</li>
            </ul>

            <h3 className="text-lg font-medium mb-1 mt-4">Funktionale Cookies</h3>
            <p>
              Diese Cookies ermöglichen erweiterte Funktionalitäten und Personalisierung.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Benutzereinstellungen:</strong> Gespeicherte Präferenzen für die Anwendung</li>
              <li><strong>Formulardaten:</strong> Zwischenspeicherung von Eingaben</li>
            </ul>

            <h3 className="text-lg font-medium mb-1 mt-4">Drittanbieter-Cookies</h3>
            <p>Folgende Drittanbieter können Cookies setzen:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Stripe:</strong> Für die sichere Zahlungsabwicklung.{" "}
                <a href="https://stripe.com/de/cookie-settings" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Stripe Cookie-Richtlinie
                </a>
              </li>
              <li>
                <strong>Google (OAuth):</strong> Bei Anmeldung über Google.{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google Datenschutz
                </a>
              </li>
              <li>
                <strong>Supabase:</strong> Für Authentifizierung und Datenbankzugriff.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Wie können Sie Cookies verwalten?</h2>
            <p>
              Sie können Cookies über die Einstellungen Ihres Browsers verwalten oder löschen.
              Beachten Sie, dass das Deaktivieren bestimmter Cookies die Funktionalität der
              Website einschränken kann.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Chrome:</strong> Einstellungen → Datenschutz und Sicherheit → Cookies</li>
              <li><strong>Firefox:</strong> Einstellungen → Datenschutz &amp; Sicherheit → Cookies</li>
              <li><strong>Safari:</strong> Einstellungen → Datenschutz → Cookies verwalten</li>
              <li><strong>Edge:</strong> Einstellungen → Cookies und Websiteberechtigungen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
            <p>
              Bei Fragen zu unserer Cookie-Richtlinie wenden Sie sich an:{" "}
              <a href="mailto:info@mietfleet.de" className="text-primary hover:underline">info@mietfleet.de</a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">Stand: März 2026</p>
          </section>
        </div>
      </div>
    </div>
  );
}
