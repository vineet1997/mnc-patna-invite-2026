/* eslint-disable @next/next/no-img-element -- local, verified brand assets stay small and preserve their exact source files */
import { RsvpForm } from "../components/RsvpForm";
import { SeasonBookHero } from "../components/SeasonBookHero";
import { event } from "../lib/event";

export default function Home() {
  return (
    <main id="top">
      <SeasonBookHero />

      <section className="welcome-section section-shell" aria-labelledby="welcome-title">
        <div className="section-index"><span>01</span><span>Welcome</span></div>
        <div className="welcome-copy">
          <p className="section-kicker">A note from your hosts</p>
          <h2 id="welcome-title">The finest seasons begin with the right conversations.</h2>
          <p className="lead-copy">Mukesh &amp; Company is delighted to welcome Bihar’s retail community to a day shaped around new ideas, considered collections and stronger business relationships.</p>
          <p>Join us for an exclusive presentation of the season’s newest home-fashion collections, with time to discover, discuss and book what comes next.</p>
          <div className="signature"><span>With warm regards</span><strong>Mukesh &amp; Company</strong></div>
        </div>
      </section>

      <section className="purpose-section" aria-labelledby="purpose-title">
        <div className="section-shell">
          <div className="section-index light"><span>02</span><span>The day</span></div>
          <div className="purpose-heading">
            <p className="section-kicker">New collections. Meaningful connections.</p>
            <h2 id="purpose-title">A season designed to move business forward.</h2>
          </div>
          <div className="purpose-grid">
            <article><span>01 / Discover</span><h3>A considered preview</h3><p>Explore the newest stories in bed, bath and home before the season gathers pace.</p></article>
            <article><span>02 / Connect</span><h3>Conversations that matter</h3><p>Meet the teams, exchange market insight and build on relationships across Bihar.</p></article>
            <article><span>03 / Grow</span><h3>Book the season ahead</h3><p>Identify the right opportunities and place advance bookings with confidence.</p></article>
          </div>
        </div>
      </section>

      <section className="brands-section section-shell" aria-labelledby="brands-title">
        <div className="section-index"><span>03</span><span>The collections</span></div>
        <div className="brands-heading">
          <p className="section-kicker">Five houses · one seasonal edit</p>
          <h2 id="brands-title">Meet the participating brands.</h2>
          <p>A multi-brand presentation curated for the retailers who shape homes across Bihar.</p>
        </div>
        <div className="brand-grid">
          {event.brands.map((brand, index) => (
            <article className={`brand-card brand-${index + 1}`} key={brand.name}>
              <span className="brand-number">HFR / 0{index + 1}</span>
              <div className="brand-logo-wrap">
                <img src={brand.logo} width={brand.width} height={brand.height} alt={`${brand.name} logo`} loading="lazy" decoding="async" />
              </div>
              <p>{brand.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hospitality-section" aria-labelledby="hospitality-title">
        <div className="hospitality-weave" aria-hidden="true" />
        <div className="hospitality-copy">
          <p className="section-kicker">Stay, share &amp; enjoy</p>
          <h2 id="hospitality-title">Hospitality throughout the day.</h2>
          <p>Come for the collections. Stay for the conversations. Lunch and dinner will be served for all invited guests.</p>
          <div className="hospitality-times"><span>Lunch</span><i /><span>Conversations</span><i /><span>Dinner</span></div>
        </div>
      </section>

      <section className="venue-section section-shell" id="venue" aria-labelledby="venue-title">
        <div className="section-index"><span>04</span><span>Plan your visit</span></div>
        <div className="venue-grid">
          <div className="date-tile" aria-label={`${event.day}, ${event.dateDisplay}`}>
            <span>{event.day}</span><strong>08</strong><em>September · 2026</em>
          </div>
          <div className="venue-copy">
            <p className="section-kicker">Patna · 11:00 AM onwards</p>
            <h2 id="venue-title">{event.venue}</h2>
            <address>{event.address}</address>
            <div className="venue-actions">
              <a className="button button-primary" href={event.mapsUrl} target="_blank" rel="noreferrer">Open in Maps <span aria-hidden="true">↗</span></a>
              <a className="button button-outline" href="/calendar">Add to calendar <span aria-hidden="true">↓</span></a>
            </div>
            <div className="contact-list">
              {event.contacts.map((contact) => <a href={contact.href} key={contact.name}><span>{contact.name}</span><strong>{contact.phone}</strong></a>)}
            </div>
          </div>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp" aria-labelledby="rsvp-title">
        <div className="rsvp-shell">
          <div className="rsvp-heading">
            <p className="section-kicker">Your invitation</p>
            <h2 id="rsvp-title">We look forward to welcoming you.</h2>
            <p>Share a few details and we’ll prepare a WhatsApp message for you to review before sending.</p>
          </div>
          <RsvpForm />
        </div>
      </section>

      <footer className="site-footer">
        <div><span>Hosted with warmth by</span><strong>Mukesh <i>&amp;</i> Company</strong></div>
        <p>Home Fashionista Rising 2026 · Patna</p>
        <a href="#top">Back to top ↑</a>
      </footer>

      <nav className="quick-actions" aria-label="Quick actions">
        <a href="#rsvp">Confirm</a>
        <span aria-hidden="true" />
        <a href={event.mapsUrl} target="_blank" rel="noreferrer">Directions</a>
      </nav>
    </main>
  );
}
