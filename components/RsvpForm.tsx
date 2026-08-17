"use client";

import { useMemo, useState } from "react";
import { event } from "../lib/event";

export function RsvpForm() {
  const [name, setName] = useState("");
  const [store, setStore] = useState("");
  const [city, setCity] = useState("");
  const [attendees, setAttendees] = useState("1");
  const complete = Boolean(name.trim() && store.trim() && city.trim());

  const whatsappUrl = useMemo(() => {
    const message = `Namaste, I am ${name || "[name]"} from ${store || "[business]"}, ${city || "[city]"}. Please confirm our RSVP for ${event.name}, Patna on ${event.dateDisplay}. Guests: ${attendees}.`;
    return `https://wa.me/${event.rsvpPhone}?text=${encodeURIComponent(message)}`;
  }, [attendees, city, name, store]);

  return (
    <form className="rsvp-form" onSubmit={(eventObject) => eventObject.preventDefault()}>
      <label className="field field-wide" htmlFor="guest-name"><span>Name</span><input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required placeholder="Your name" /></label>
      <label className="field" htmlFor="store-name"><span>Shop / Business</span><input id="store-name" value={store} onChange={(e) => setStore(e.target.value)} required placeholder="Business name" /></label>
      <label className="field" htmlFor="guest-city"><span>City</span><input id="guest-city" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" required placeholder="Your city" /></label>
      <label className="field field-wide" htmlFor="attendees"><span>Guests</span><select id="attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)}>{["1", "2", "3", "4", "5 or more"].map((count) => <option value={count} key={count}>{count}</option>)}</select></label>
      <a className={`luxe-button rsvp-submit${complete ? "" : " is-disabled"}`} href={complete ? whatsappUrl : undefined} aria-disabled={!complete} tabIndex={complete ? undefined : -1} target="_blank" rel="noreferrer">Send RSVP on WhatsApp <span aria-hidden="true">↗</span></a>
      <p className="privacy-note">Nothing is stored. WhatsApp opens only after you tap.</p>
    </form>
  );
}
