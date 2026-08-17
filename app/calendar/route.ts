import { event, escapeCalendarText } from "../../lib/event";

export function GET() {
  const description = `Join ${event.host} for ${event.name}. New collections, business opportunities, lunch and dinner.`;
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mukesh & Company//Home Fashionista Rising 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:home-fashionista-rising-2026-patna@mukeshandcompany`,
    `DTSTART;TZID=${event.timezone}:${event.calendarStart}`,
    `DURATION:${event.calendarDuration}`,
    `SUMMARY:${escapeCalendarText(event.name)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `LOCATION:${escapeCalendarText(`${event.venue}, ${event.address}`)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="home-fashionista-rising-2026-patna.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
