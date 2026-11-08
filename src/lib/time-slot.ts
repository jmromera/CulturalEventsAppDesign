import type { EventItem } from "../types/Event";

export const TIME_SLOTS = ["morning", "afternoon", "night"] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

/** Morning before 14:00, afternoon 14:00-19:59, night from 20:00. Null when the time is not a clock time. */
export function timeSlotOf(event: EventItem): TimeSlot | null {
  const match = event.time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  return hour < 14 ? "morning" : hour < 20 ? "afternoon" : "night";
}

/** Parses the `franja` URL parameter (e.g. "tarde,noche"). */
const URL_NAMES: Record<string, TimeSlot> = { manana: "morning", tarde: "afternoon", noche: "night" };
export const SLOT_URL_NAMES: Record<TimeSlot, string> = { morning: "manana", afternoon: "tarde", night: "noche" };
export function parseSlots(value: string | null): TimeSlot[] {
  return (value ?? "").split(",").map((item) => URL_NAMES[item]).filter((slot): slot is TimeSlot => Boolean(slot));
}

export function matchesSlots(event: EventItem, slots: TimeSlot[]): boolean {
  if (!slots.length) return true;
  const slot = timeSlotOf(event);
  return slot !== null && slots.includes(slot);
}
