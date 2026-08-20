import { useState } from "react";
import portrait from "../assets/portrait.jpg";

const FORM_ENDPOINT = "https://formspree.io/f/xljrpybz";

const REASONS = [
  { value: "lesson", label: "Book a lesson" },
  { value: "engagement", label: "Performance or engagement inquiry" },
  { value: "other", label: "Something else" },
];

const EMPTY_FORM = { name: "", email: "", reason: "", message: "" };

// how long the card takes to minimise away - matches the
// contact-form-close animation in App.css
const CLOSE_MS = 450;

function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  // "form" -> "closing" (card minimising) -> "done" (thank-you panel)
  const [phase, setPhase] = useState("form");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!FORM_ENDPOINT) {
      setStatus({
        state: "error",
        message: "This form isn't connected to an inbox yet.",
      });
      return;
    }

    setStatus({ state: "sending", message: "Sending..." });

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      setStatus({ state: "success", message: "" });
      setForm(EMPTY_FORM);

      // minimise the card, then swap it for the thank-you panel.
      // anyone who has asked for less motion skips straight to it
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setPhase("closing");
      setTimeout(() => setPhase("done"), reduced ? 0 : CLOSE_MS);
    } catch {
      setStatus({
        state: "error",
        message: "Something went wrong. Please try again in a moment.",
      });
    }
  }

  return (
    <div className="contact-parent-div">
      <h1 className="contacth1">Contact</h1>
      <span className="hairline" aria-hidden />

      {phase === "done" ? (
        <div className="contact-success" role="status">
          <svg
            className="contact-success-mark"
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <circle cx="32" cy="32" r="26" />
            <path d="M20.5 33.5 L28.5 41.5 L44 24.5" />
          </svg>
          <p className="contact-success-text">
            Thank you for your message! We will be in touch promptly.
          </p>
        </div>
      ) : (
        <form
          className={`contact-form deco-frame${phase === "closing" ? " is-closing" : ""}`}
          onSubmit={handleSubmit}
        >
          <span className="corner top left" aria-hidden />
          <span className="corner top right" aria-hidden />
          <span className="corner bottom left" aria-hidden />
          <span className="corner bottom right" aria-hidden />
          <p className="contact-intro">
            <span className="G">G</span>et in touch!
          </p>
          <div className="form-parent-grid">
            <img src={portrait} alt="" className="contact-portrait" />
            <div className="form-field">
              <label htmlFor="name">
                Name
                <span className="required" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">
                Email
                <span className="required" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="reason">
                Reason for contact
                <span className="required" aria-hidden>
                  *
                </span>
              </label>
              <select
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a reason
                </option>
                {REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Leave a message here..."
                rows="6"
              />
            </div>

            <button
              type="submit"
              className="contactbtn"
              disabled={status.state === "sending"}
            >
              <span>
                {status.state === "sending" ? "Sending..." : "Send message"}
              </span>
              <svg aria-hidden="true">
                <rect x="0" y="0" width="100%" height="100%" />
              </svg>
            </button>

            {status.state === "error" && (
              <p className={`contact-status ${status.state}`} role="status">
                {status.message}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default Contact;
