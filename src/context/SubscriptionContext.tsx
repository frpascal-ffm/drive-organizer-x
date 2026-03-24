import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SubscriptionStatus, SubscriptionTier, isSubscriptionActive, getTierByProductId, STRIPE_PRODUCTS } from "@/lib/stripe-config";

interface SubscriptionContextType {
  status: SubscriptionStatus;
  isActive: boolean;
  tier: SubscriptionTier;
  productId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  startCheckout: (priceId?: string) => Promise<void>;
  openBillingPortal: () => Promise<void>;
  guardAction: (callback?: () => void) => boolean;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (v: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  status: null,
  isActive: false,
  tier: "free",
  productId: null,
  subscriptionEnd: null,
  loading: true,
  error: null,
  checkSubscription: async () => {},
  startCheckout: async () => {},
  openBillingPortal: async () => {},
  guardAction: () => true,
  showUpgradeModal: false,
  setShowUpgradeModal: () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, session } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isActive = isSubscriptionActive(status);
  const tier = getTierByProductId(productId);

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const { data, error: fnError } = await supabase.functions.invoke("check-subscription", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (fnError) throw fnError;
      setStatus(data.status ?? null);
      setProductId(data.product_id ?? null);
      setSubscriptionEnd(data.subscription_end ?? null);
    } catch (e: any) {
      console.error("Subscription check failed:", e);
      setError("Abo-Status konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (user && session) {
      checkSubscription();
      const interval = setInterval(checkSubscription, 60_000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
      setStatus(null);
    }
  }, [user, session, checkSubscription]);

  const startCheckout = useCallback(async (priceId?: string) => {
    const pid = priceId || STRIPE_PRODUCTS.starter.price_id;
    if (!pid) return;
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: pid },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (fnError) throw fnError;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      console.error("Checkout failed:", e);
    }
  }, [session?.access_token]);

  const openBillingPortal = useCallback(async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (fnError) throw fnError;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      console.error("Portal failed:", e);
    }
  }, [session?.access_token]);

  const guardAction = useCallback((callback?: () => void): boolean => {
    if (isActive) {
      callback?.();
      return true;
    }
    setShowUpgradeModal(true);
    return false;
  }, [isActive]);

  return (
    <SubscriptionContext.Provider value={{
      status, isActive, tier, productId, subscriptionEnd, loading, error,
      checkSubscription, startCheckout, openBillingPortal, guardAction,
      showUpgradeModal, setShowUpgradeModal,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
