import { useSubscription } from "@/context/SubscriptionContext";
import { useCallback } from "react";

/**
 * Returns a wrapper function that checks subscription before executing.
 * Usage: const guarded = useGuardedAction(); guarded(() => doSomething());
 */
export function useGuardedAction() {
  const { guardAction } = useSubscription();
  return useCallback((callback?: () => void) => {
    return guardAction(callback);
  }, [guardAction]);
}
