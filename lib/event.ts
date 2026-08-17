export const event = {
  host: "Mukesh & Company",
  name: "Home Fashionista Rising 2026",
  eventLine: "Discover. Connect. Grow Together.",
  headline: "A new season rises.",
  dateDisplay: "08 September 2026",
  dateShort: "08 Sep",
  day: "Tuesday",
  time: "11:00 AM onwards",
  calendarStart: "20260908T110000",
  calendarDuration: "PT9H",
  timezone: "Asia/Kolkata",
  venue: "Crystal Hall (9 to 9)",
  city: "Patna",
  address: "Nutan Tower, Bandar Bagicha, Dakbanglow Road, Patna – 800001",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Crystal+Hall+9+to+9+Nutan+Tower+Bandar+Bagicha+Dakbanglow+Road+Patna+800001",
  rsvpPhone: "919431022128",
  contacts: [
    { name: "Mukesh Agarwal", phone: "+91 94310 22128", href: "tel:+919431022128" },
    { name: "Sanchit Agarwal", phone: "+91 70045 67907", href: "tel:+917004567907" },
  ],
  brands: [
    { name: "Florida", logo: "/brands/florida-ivory.png", width: 655, height: 218, note: "Dress Your Home" },
    { name: "Boutique Living", logo: "/brands/boutique-living-ivory.png", width: 480, height: 328, note: "Refined home fashion" },
    { name: "Layers", logo: "/brands/layers-ivory.png", width: 808, height: 239, note: "Dress Up Your Home" },
    { name: "Welspun", logo: "/brands/welspun-ivory.png", width: 118, height: 37, note: "Everyday innovation" },
    { name: "SPACES", logo: "/brands/spaces.svg", width: 938, height: 303, note: "Bed · Bath · Rugs" },
  ],
} as const;

export function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}
