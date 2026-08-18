/* eslint-disable @next/next/no-img-element -- local brand marks preserve their official source artwork */
import { RsvpForm } from "../components/RsvpForm";
import { SeasonBookHero } from "../components/SeasonBookHero";
import { event } from "../lib/event";

export default function Home() {
  return (
    <main id="top">
      <SeasonBookHero />

      <section className="collection-section" aria-labelledby="collection-title">
        <div className="section-rule"><span>The new collection</span><b>01</b></div>
        <div className="collection-heading">
          <p>One exclusive preview</p>
          <h2 id="collection-title">Five names.<br /><em>One new season.</em></h2>
        </div>
        <div className="logo-gallery" aria-label="Participating brands">
          {event.brands.map((brand, index) => (
            <div className={`logo-signature logo-signature-${index + 1}${brand.featured ? " logo-signature-featured" : ""}`} key={brand.name}>
              <img src={brand.logo} width={brand.width} height={brand.height} alt={`${brand.name} logo`} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </section>

      <section className="event-section" id="venue" aria-labelledby="venue-title">
        <div className="section-rule section-rule-light"><span>Date &amp; venue</span><b>02</b></div>
        <div className="date-display" aria-label={`${event.day}, ${event.dateDisplay}`}>
          <span>September</span><strong>08</strong><em>2026</em>
        </div>
        <div className="event-details">
          <p className="event-city">Tuesday · Patna · 11:00 AM onwards</p>
          <h2 id="venue-title">{event.venue}</h2>
          <address>{event.address}</address>
          <p className="hospitality-note"><span aria-hidden="true">✦</span> Lunch &amp; dinner will be served.</p>
          <div className="event-actions">
            <a className="luxe-button luxe-button-primary" href={event.mapsUrl} target="_blank" rel="noreferrer">Open in Maps <span aria-hidden="true">↗</span></a>
            <a className="luxe-button luxe-button-outline" href="/calendar">Add to Calendar <span aria-hidden="true">↓</span></a>
          </div>
          <div className="contact-row" aria-label="Contact the hosts">
            {event.contacts.map((contact) => <a href={contact.href} key={contact.name}><span>{contact.name}</span><strong>{contact.phone}</strong></a>)}
          </div>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp" aria-labelledby="rsvp-title">
        <div className="section-rule section-rule-light"><span>RSVP</span><b>03</b></div>
        <div className="rsvp-shell">
          <div className="rsvp-heading">
            <p>Simple. Direct. On WhatsApp.</p>
            <h2 id="rsvp-title">See you<br /><em>in Patna.</em></h2>
          </div>
          <RsvpForm />
        </div>
      </section>

      <footer className="site-footer">
        <p><span>Hosted by</span><strong>Mukesh <i>&amp;</i> Company</strong></p>
        <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
      </footer>
    </main>
  );
}
