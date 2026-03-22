import { Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Check, Car, Users, Route, Receipt, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Step {
  label: string;
  description: string;
  done: boolean;
  to: string;
  icon: React.ElementType;
}

export function OnboardingChecklist() {
  const { fahrzeuge, fahrer, fahrten, kosten } = useAppContext();

  const steps: Step[] = [
    {
      label: "Fahrzeug anlegen",
      description: "Legen Sie Ihr erstes Fahrzeug an, um Einnahmen und Kosten zuordnen zu können.",
      done: fahrzeuge.length > 0,
      to: "/fahrzeuge/neu",
      icon: Car,
    },
    {
      label: "Fahrer anlegen",
      description: "Erfassen Sie Ihre Fahrer, um Fahrten und Abrechnungen zuordnen zu können.",
      done: fahrer.length > 0,
      to: "/fahrer/neu",
      icon: Users,
    },
    {
      label: "Erste Fahrt erfassen",
      description: "Erstellen Sie Ihre erste Fahrt, damit Umsätze berechnet werden können.",
      done: fahrten.length > 0,
      to: "/fahrten/neu",
      icon: Route,
    },
    {
      label: "Kosten erfassen",
      description: "Hinterlegen Sie Fix- oder variable Kosten, damit das Ergebnis pro Fahrzeug berechnet werden kann.",
      done: kosten.length > 0,
      to: "/kosten/neu",
      icon: Receipt,
    },
  ];

  const doneCount = steps.filter(s => s.done).length;
  const allDone = doneCount === steps.length;
  const progress = (doneCount / steps.length) * 100;

  if (allDone) return null;

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h2 className="text-base font-semibold">Willkommen — richten Sie Ihren Betrieb ein</h2>
            <p className="text-sm text-muted-foreground mt-1">
              In wenigen Schritten sehen Sie, was pro Fahrzeug übrig bleibt. Legen Sie los.
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap mt-1">
            {doneCount} von {steps.length} erledigt
          </span>
        </div>
        <Progress value={progress} className="h-1.5 mt-3" />
      </div>

      <div className="px-6 pb-6 pt-2 space-y-2">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`flex items-center gap-4 p-3.5 rounded-lg border transition-colors ${
              step.done
                ? "bg-muted/30 border-border/50"
                : "bg-background border-border hover:border-primary/30"
            }`}
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
              step.done ? "bg-primary/10" : "bg-muted"
            }`}>
              {step.done ? (
                <Check className="h-4.5 w-4.5 text-primary" />
              ) : (
                <step.icon className="h-4.5 w-4.5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${step.done ? "text-muted-foreground line-through" : ""}`}>
                {step.label}
              </p>
              {!step.done && (
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              )}
            </div>
            {!step.done && (
              <Button asChild variant="outline" size="sm" className="shrink-0 text-xs h-8">
                <Link to={step.to}>
                  Anlegen <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
