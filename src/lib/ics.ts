/** One event in an iCalendar file. `start`/`end` are already formatted (UTC timestamp or YYYYMMDD for all-day). */
export type CalendarEntry = {
  uid: string;
  start: string;
  end: string;
  allDay: boolean;
  title: string;
  description: string;
  location: string;
  /** Link to this event's own page (not the page the file was downloaded from). */
  url: string;
};

export function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Builds an iCalendar (RFC 5545) file with one VEVENT per entry. */
export function buildCalendar(entries: CalendarEntry[], now = new Date()): string {
  const events = entries.flatMap((entry) => [
    "BEGIN:VEVENT",
    `UID:${entry.uid}`,
    `DTSTAMP:${stamp(now)}`,
    ...(entry.allDay ? [`DTSTART;VALUE=DATE:${entry.start}`, `DTEND;VALUE=DATE:${entry.end}`] : [`DTSTART:${entry.start}`, `DTEND:${entry.end}`]),
    `SUMMARY:${escapeCalendarText(entry.title)}`,
    `DESCRIPTION:${escapeCalendarText(`${entry.description}\n\n${entry.url}`)}`,
    `LOCATION:${escapeCalendarText(entry.location)}`,
    `URL:${entry.url}`,
    "END:VEVENT",
  ]);
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Plan Cerca//Event Calendar//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", ...events, "END:VCALENDAR"].join("\r\n");
}

/** Saves a text file through a temporary download link. */
export function downloadTextFile(content: string, filename: string, type = "text/calendar;charset=utf-8") {
  const fileUrl = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
}
