import { useSubscription } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CreditCard } from "lucide-react";

export function SubscriptionBanner() {
  const { isActive, loading, setShowUpgradeModal } = useSubscription();

  if (loading || isActive) return null;

  return (
    <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Kein aktives Abo. Funktionen sind eingeschränkt.</span>
      </div>
      <Button size="sm" variant="destructive" onClick={() => setShowUpgradeModal(true)}>
        <CreditCard className="h-3.5 w-3.5 mr-1.5" />
        Abo abschließen
      </Button>
    </div>
  );
}
