export type EventPayload = Record<string, unknown>;

type TikTokAnalytics = {
  track: (event: string, params?: EventPayload) => void;
  page?: () => void;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: TikTokAnalytics;
  }
}

const TIKTOK_EVENT_MAP: Record<string, string> = {
  Purchase: "PlaceAnOrder",
  InitiateCheckout: "InitiateCheckout",
  AddToCart: "AddToCart",
  ViewContent: "ViewContent",
  Search: "Search",
};

export function trackEvent(event: string, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;

  try {
    window.fbq?.("track", event, payload);
  } catch {
    // pixel not loaded yet
  }

  const tiktokEvent = TIKTOK_EVENT_MAP[event];

  if (tiktokEvent) {
    try {
      window.ttq?.track(tiktokEvent, payload);
    } catch {
      // pixel not loaded yet
    }
  }
}

export function trackCustomEvent(event: string, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;

  try {
    window.fbq?.("trackCustom", event, payload);
  } catch {
    // pixel not loaded yet
  }
}
