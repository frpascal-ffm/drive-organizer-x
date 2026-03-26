import { useSubscription } from "@/context/SubscriptionContext";
import { useAppContext } from "@/context/AppContext";
import { useCallback } from "react";

/**
 * Returns a function that checks if the user can add another vehicle.
 * Only blocks when the vehicle limit for the current plan is reached.
 */
export function useVehicleGuard() {
  const { guardVehicleLimit } = useSubscription();
  const { fahrzeuge } = useAppContext();

  return useCallback((callback?: () => void) => {
    return guardVehicleLimit(fahrzeuge.length, callback);
  }, [guardVehicleLimit, fahrzeuge.length]);
}
