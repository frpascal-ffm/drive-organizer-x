import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Kontakt() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" /> Zurück zur Startseite
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-4">Kontakt</h1>
        <p className="text-muted-foreground mb-10">
          Sie haben Fragen zu MietFleet oder benötigen Unterstützung? Wir helfen Ihnen gerne weiter.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">E-Mail</p>
                  <p className="text-sm text-muted-foreground">Allgemeine Anfragen</p>
                </div>
              </div>
              <a
                href="mailto:info@mietfleet.de"
                className="text-primary hover:underline font-medium"
              >
                info@mietfleet.de
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                Wir antworten in der Regel innerhalb von 24 Stunden.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Support</p>
                  <p className="text-sm text-muted-foreground">Technische Hilfe</p>
                </div>
              </div>
              <a
                href="mailto:info@mietfleet.de?subject=Support-Anfrage"
                className="text-primary hover:underline font-medium"
              >
                Support anfragen
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                Bitte beschreiben Sie Ihr Anliegen möglichst genau.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
          <h2 className="text-lg font-semibold mb-2">Häufige Fragen</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Wie kann ich mein Abo verwalten?</p>
              <p className="text-muted-foreground">
                Nach dem Login finden Sie in den Einstellungen den Bereich „Abonnement", wo Sie Ihr Abo einsehen und verwalten können.
              </p>
            </div>
            <div>
              <p className="font-medium">Kann ich MietFleet kostenlos testen?</p>
              <p className="text-muted-foreground">
                Ja, MietFleet ist für ein Fahrzeug dauerhaft kostenlos nutzbar. Für mehr Fahrzeuge können Sie jederzeit ein Abo abschließen.
              </p>
            </div>
            <div>
              <p className="font-medium">Wie lösche ich mein Konto?</p>
              <p className="text-muted-foreground">
                Senden Sie uns eine E-Mail an info@mietfleet.de mit dem Betreff „Konto löschen" und wir kümmern uns darum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
