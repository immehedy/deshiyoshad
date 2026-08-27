'use client';

import { useEffect } from 'react';
import { trackEvent, type EventPayload } from '@/lib/marketing';

export function TrackEvent({
  event,
  payload,
}: {
  event: string;
  payload?: EventPayload;
}) {
  useEffect(() => {
    trackEvent(event, payload ?? {});
    // Fire once per mount; payload is stable JSON from the server.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}
