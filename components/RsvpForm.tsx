"use client";

import { useMemo, useState } from "react";
import { event } from "../lib/event";

export function RsvpForm() {
  const [name, setName] = useState("");
  const [store, setStore] = useState("");
  const [city, setCity] = useState("");
  const [attendees, setAttendees] = useState("1");
  const [arrival, setArrival] = useState("");

  const complete = Boolean(name.trim() && store.trim() && city.trim());
  const whatsappUrl = useMemo(() => {
    const arrivalLine = arrival ? ` Expected arrival: ${arrival}.` : "";
    const message = `Namaste, I am ${name || "[name]"} from ${store || "[business]"}, ${city || "[city]"}. I would like to confirm our attendance at ${event.name} in Patna on ${event.dateDisplay}. Total attendees: ${attendees}.${arrivalLine}`;
    return `https://wa.me/${event.rsvpPhone}?text=${encodeURIComponent(message)}`;
  }, [arrival, attendees, city, name, store]);

  return (
    <form className="rsvp-form" onSubmit={(eventObject) => eventObject.preventDefault()}>
      <div className="field field-wide">
        <label htmlFor="guest-name">Your name</label>
        <input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required placeholder="Enter your name" />
      </div>
      <div className="field">
        <label htmlFor="store-name">Store / business</label>
        <input id="store-name" value={store} onChange={(e) => setStore(e.target.value)} required placeholder="Your business name" />
      </div>
      <div className="field">
        <label htmlFor="guest-city">Town / city</label>
        <input id="guest-city" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" required placeholder="Where you’re joining from" />
      </div>
      <div className="field">
        <label htmlFor="attendees">Number attending</label>
        <select id="attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)}>
          {["1", "2", "3", "4", "5 or more"].map((count) => <option value={count} key={count}>{count}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="arrival">Expected arrival <span>Optional</span></label>
        <select id="arrival" value={arrival} onChange={(e) => setArrival(e.target.value)}>
          <option value="">Not sure yet</option>
          <option>Before 12:00 PM</option>
          <option>12:00–2:00 PM</option>
          <option>2:00–4:00 PM</option>
          <option>After 4:00 PM</option>
        </select>
      </div>
      <a
        className={`button rsvp-submit${complete ? "" : " is-disabled"}`}
        href={complete ? whatsappUrl : undefined}
        aria-disabled={!complete}
        tabIndex={complete ? undefined : -1}
        target="_blank"
        rel="noreferrer"
      >
        Review &amp; send on WhatsApp <span aria-hidden="true">↗</span>
      </a>
      <p className="privacy-note">Your details stay on this device. Nothing is stored by this invitation.</p>
    </form>
  );
}
