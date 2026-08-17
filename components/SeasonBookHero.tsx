"use client";

import { useState } from "react";
import { event } from "../lib/event";

const swatches = [
  { number: "01", name: "Woven Ivory", className: "swatch-ivory" },
  { number: "02", name: "Peacock", className: "swatch-peacock" },
  { number: "03", name: "Madder", className: "swatch-madder" },
  { number: "04", name: "Natural Flax", className: "swatch-flax" },
  { number: "05", name: "Muted Clay", className: "swatch-clay" },
];

export function SeasonBookHero() {
  const [skipped, setSkipped] = useState(false);

  return (
    <section className={`season-hero${skipped ? " intro-skipped" : ""}`} aria-labelledby="event-title">
      <div className="hero-weave" aria-hidden="true" />
      <div className="hero-shell">
        <header className="host-lockup">
          <span className="eyebrow">A personal invitation from</span>
          <strong>Mukesh <i>&amp;</i> Company</strong>
        </header>

        <button className="skip-intro" type="button" onClick={() => setSkipped(true)}>
          Skip opening
        </button>

        <div className="hero-focus">
          <div className="swatch-stage" aria-hidden="true">
            <span className="swatch-pin" />
            {swatches.map((swatch) => (
              <div className={`swatch ${swatch.className}`} key={swatch.number}>
                <span className="selvedge" />
                <span className="swatch-id">HFR / {swatch.number}</span>
                <span className="swatch-name">{swatch.name}</span>
              </div>
            ))}
          </div>

          <div className="hero-copy">
            <p className="season-kicker">The season book · Patna</p>
            <h1 id="event-title">
              <span>Home Fashionista</span>
              <em>Rising 2026</em>
            </h1>
            <p className="hero-line">{event.headline}</p>
            <p className="event-line">{event.eventLine}</p>
          </div>
        </div>

        <dl className="event-ledger" aria-label="Event details">
          <div><dt>Date</dt><dd>{event.dateShort}<small>{event.day}</small></dd></div>
          <div><dt>Time</dt><dd>{event.time}<small>Lunch &amp; dinner</small></dd></div>
          <div><dt>Venue</dt><dd>{event.venue}<small>{event.city}</small></dd></div>
        </dl>

        <nav className="hero-actions" aria-label="Invitation actions">
          <a className="button button-primary" href="#rsvp">Confirm attendance</a>
          <a className="button button-quiet" href={event.mapsUrl} target="_blank" rel="noreferrer">
            Get directions <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <p className="brand-preview" aria-label="Featured brands">
          Florida <span>·</span> Boutique Living <span>·</span> Layers <span>·</span> Welspun <span>·</span> SPACES
        </p>
      </div>
    </section>
  );
}
