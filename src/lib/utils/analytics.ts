import posthog from "posthog-js";
import { EventName } from "../interfaces";

declare global {
  var zaraz:
    | {
        track: (
          eventName: string,
          eventData?: Record<string, string | number | boolean>,
        ) => void;
      }
    | undefined;
}

export interface TrackingEvent {
  eventName: EventName;
  eventData?: Record<string, string | boolean | number>;
}

export const trackEvent = ({ eventName, eventData }: TrackingEvent) => {
  if (typeof window !== "undefined") {
    try {
      posthog.capture(eventName, eventData);
    } catch (err) {
      // ignore
    }
    try {
      const data = {
        ...eventData,
        eventSource: "web-click",
      };
      zaraz?.track(eventName, data);
    } catch (err) {
      // Ignore
    }
  }
};
