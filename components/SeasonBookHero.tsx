"use client";

import { useCallback, useState } from "react";
import { event } from "../lib/event";
import { FabricScene, type FabricMotionState } from "./FabricScene";

export function SeasonBookHero() {
  const [motionState, setMotionState] = useState<FabricMotionState>("loading");
  const handleStateChange = useCallback((state: FabricMotionState) => setMotionState(state), []);

  return (
    <section className={`luxury-hero fabric-${motionState}`} aria-labelledby="event-title">
      <div className="fabric-fallback" aria-hidden="true" />
      <FabricScene onStateChange={handleStateChange} />
      <div className="hero-shade" aria-hidden="true" />

      <div className="opening-host" aria-hidden="true">
        <span>A private invitation from</span>
        <strong>Mukesh <i>&amp;</i> Company</strong>
        <em>Presents</em>
      </div>

      <header className="luxury-masthead">
        <p><span>Hosted by</span><strong>Mukesh <i>&amp;</i> Company</strong></p>
      </header>

      <div className="luxury-copy">
        <p className="invited-line">You are invited</p>
        <h1 id="event-title"><span>Home Fashionista</span><em>Rising</em><b>2026</b></h1>
        <p className="luxury-deck">An exclusive preview of the new season.</p>
      </div>

      <div className="hero-essential">
        <div className="essential-fact"><span>Tuesday</span><strong>08 September</strong><small>11:00 AM onwards</small></div>
        <div className="essential-fact"><span>Patna</span><strong>{event.venue}</strong><small>Nutan Tower · Dakbanglow Road</small></div>
        <nav className="luxury-actions" aria-label="Invitation actions">
          <a className="luxe-button luxe-button-primary" href="#rsvp">Confirm on WhatsApp</a>
          <a className="luxe-button luxe-button-quiet" href={event.mapsUrl} target="_blank" rel="noreferrer">Directions <span aria-hidden="true">↗</span></a>
        </nav>
      </div>

      <p className="scroll-note">Scroll to enter <span aria-hidden="true">↓</span></p>
    </section>
  );
}
