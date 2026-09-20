import { useState, useEffect, useRef } from "react";
import PageMeta from "../components/PageMeta.jsx";
import { metaFor } from "../routes.js";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// how many concerts a day cell previews before collapsing the rest into
// a "+n more" line. two fits a square cell at the widths the grid hits
// without the row growing taller than it is wide
const PREVIEW_LIMIT = 2;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// the public "Performances" calendar, decoded from its share link
const CALENDAR_ID =
  "cde8b1788511ae6b667f7f35c9ffb180f701c1346c1b4c9b199457619825923d@group.calendar.google.com";

// read-only browser key. it ships in the bundle - that is unavoidable
// for a static site and fine for a public calendar, but restrict it to
// this site's referrers and to the Calendar API in the Google console
const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;

// built by hand rather than with toISOString(), which converts to UTC
// and lands on the wrong day for anyone west of Greenwich
function isoDate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function daysInMonth(year, month) {
  // day 0 of the next month is the last day of this one
  return new Date(year, month + 1, 0).getDate();
}

// which calendar day a timestamp falls on, in the concert's own zone -
// not the viewer's, or a late show would slide onto the next day for
// anyone reading from further east
function dayKeyInZone(value, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
  return parts.replaceAll("/", "-");
}

function addDays(key, n) {
  const [y, m, d] = key.split("-").map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d) + n * 86400000);
  return isoDate(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
  );
}

function formatTime(value, timeZone) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

// only http(s) - a description could otherwise put javascript: or data:
// behind the RSVP button
function safeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(String(value).trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : "";
  } catch {
    return "";
  }
}

// a labelled line wins over a loose link, so a description can mention
// other URLs without one of them being promoted to the button
const LABELLED_LINK =
  /^[^\S\n]*(?:rsvp|tickets?|register|reserve|booking)[^\S\n]*[:\-\u2013\u2014][^\S\n]*(\S+)[^\S\n]*$/im;
const LINK_WORD = /rsvp|ticket|register|reserve|book/i;
const BARE_URL = /https?:\/\/[^\s<>"']+/i;

// Google returns the description as an HTML fragment. Parse it in an
// inert document rather than rendering it: it is Matt's own copy, but
// DOMParser neither runs scripts nor fetches resources, and the day
// popup wants plain text anyway.
function parseDescription(html) {
  if (!html) return { text: "", rsvpUrl: "" };

  const doc = new DOMParser().parseFromString(html, "text/html");

  const anchors = [...doc.querySelectorAll("a[href]")].map((a) => ({
    href: a.getAttribute("href"),
    label: a.textContent.trim(),
  }));

  // the line breaks the author typed, which textContent would swallow
  doc.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  doc.querySelectorAll("p, div, li").forEach((el) => el.append("\n"));

  let text = (doc.body.textContent || "").replace(/\u00a0/g, " ");

  const labelled = text.match(LABELLED_LINK);
  const rsvpUrl =
    safeUrl(labelled?.[1]) ||
    safeUrl(anchors.find((a) => LINK_WORD.test(a.label))?.href) ||
    safeUrl(anchors[0]?.href) ||
    safeUrl(text.match(BARE_URL)?.[0]);

  // the button now carries the link, so drop it from the prose
  if (labelled) text = text.replace(labelled[0], "");
  if (rsvpUrl) text = text.split(rsvpUrl).join("");

  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { text, rsvpUrl };
}

// every day an event covers, so a festival spanning a week shows on
// each of those days rather than only the first
function eventDayKeys(ev, calendarZone) {
  const zone = ev.start.timeZone || calendarZone;
  const allDay = Boolean(ev.start.date);

  let first;
  let last;
  if (allDay) {
    first = ev.start.date;
    // all-day end dates are exclusive
    last = ev.end?.date ? addDays(ev.end.date, -1) : first;
  } else {
    first = dayKeyInZone(ev.start.dateTime, zone);
    last = ev.end?.dateTime ? dayKeyInZone(ev.end.dateTime, zone) : first;
  }
  if (last < first) last = first;

  const keys = [];
  let cursor = first;
  // guard against a malformed range spinning forever
  for (let i = 0; i < 400 && cursor <= last; i++) {
    keys.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return keys;
}

function groupEvents(items, calendarZone) {
  const byDate = {};
  items.forEach((ev) => {
    if (ev.status === "cancelled") return;
    const zone = ev.start.timeZone || calendarZone;
    const allDay = Boolean(ev.start.date);
    const { text, rsvpUrl } = parseDescription(ev.description);
    const entry = {
      id: ev.id,
      title: ev.summary || "Untitled event",
      location: ev.location || "",
      description: text,
      rsvpUrl,
      allDay,
      start: allDay ? "" : formatTime(ev.start.dateTime, zone),
      end: allDay || !ev.end?.dateTime ? "" : formatTime(ev.end.dateTime, zone),
      // for ordering within a day. the API returns the month in start
      // order, but a multi-day event lands on days it did not start on,
      // where it would otherwise sort ahead of that day's own concerts
      sortKey: allDay ? 0 : Date.parse(ev.start.dateTime) || 0,
    };
    eventDayKeys(ev, calendarZone).forEach((key) => {
      byDate[key] = byDate[key] ? [...byDate[key], entry] : [entry];
    });
  });

  // all-day first, then chronological - the order the day reads in
  Object.values(byDate).forEach((list) =>
    list.sort((a, b) =>
      a.allDay === b.allDay ? a.sortKey - b.sortKey : a.allDay ? -1 : 1,
    ),
  );

  return byDate;
}

function Calendar() {
  // read on every mount, so a refresh always lands on the real month
  const now = new Date();
  const todayKey = isoDate(now.getFullYear(), now.getMonth(), now.getDate());

  const [view, setView] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selected, setSelected] = useState(null);
  const [eventsByDate, setEventsByDate] = useState({});
  const [status, setStatus] = useState(API_KEY ? "loading" : "unconfigured");

  const closeRef = useRef(null);
  const lastTriggerRef = useRef(null);

  function shiftMonth(step) {
    if (API_KEY) setStatus("loading");
    setView((prev) => {
      const d = new Date(prev.year, prev.month + step, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function goToToday() {
    if (API_KEY) setStatus("loading");
    const d = new Date();
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }

  function openDay(day, e) {
    lastTriggerRef.current = e.currentTarget;
    setSelected({ year: view.year, month: view.month, day });
  }

  function closeDay() {
    setSelected(null);
    // hand focus back to the day that opened it
    if (lastTriggerRef.current) lastTriggerRef.current.focus();
  }

  // pull the visible month from google calendar
  useEffect(() => {
    if (!API_KEY) {
      console.warn(
        "VITE_GOOGLE_CALENDAR_API_KEY is not set - the calendar will render without concerts.",
      );
      return;
    }

    const controller = new AbortController();
    // widen by a month either side so events spilling over a boundary
    // still appear on the days they cover
    const timeMin = new Date(view.year, view.month - 1, 1).toISOString();
    const timeMax = new Date(view.year, view.month + 2, 1).toISOString();
    const params = new URLSearchParams({
      key: API_KEY,
      timeMin,
      timeMax,
      singleEvents: "true", // expands a recurring series into dates
      orderBy: "startTime",
      maxResults: "250",
    });
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID,
    )}/events?${params}`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Calendar request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setEventsByDate(groupEvents(data.items || [], data.timeZone));
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        setStatus("error");
      });

    return () => controller.abort();
  }, [view.year, view.month]);

  // escape closes the popup wherever focus happens to be
  useEffect(() => {
    if (!selected) return;
    function onKeyDown(e) {
      if (e.key === "Escape") closeDay();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  // move focus into the popup when it opens
  useEffect(() => {
    if (selected && closeRef.current) closeRef.current.focus();
  }, [selected]);

  const isCurrentMonth =
    view.year === now.getFullYear() && view.month === now.getMonth();

  const total = daysInMonth(view.year, view.month);
  const leading = new Date(view.year, view.month, 1).getDay();
  // pad the tail so the grid always closes as a clean rectangle
  const trailing = (7 - ((leading + total) % 7)) % 7;

  const selectedKey = selected
    ? isoDate(selected.year, selected.month, selected.day)
    : null;
  const selectedEvents = selectedKey ? eventsByDate[selectedKey] || [] : [];

  return (
    <div className="calendar-parent-div">
      <PageMeta {...metaFor["/calendar"]} />
      <h1 className="calendarh1">Upcoming Concerts and Events</h1>
      <span className="hairline" aria-hidden />

      <div className="calendar-page">
        <div className="calendar-head">
          <button
            type="button"
            className="calendar-nav"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
          >
            <span aria-hidden>&#8592;</span>
          </button>
          <div className="calendar-head-center">
            <div className="calendar-today-slot">
              {!isCurrentMonth && (
                <button
                  type="button"
                  className="calendar-today-btn"
                  onClick={goToToday}
                  aria-label="Return to today"
                >
                  <span aria-hidden>&#8592;</span> Today
                </button>
              )}
            </div>
            <h2 className="calendar-month" aria-live="polite">
              {MONTHS[view.month]} <span>{view.year}</span>
            </h2>
          </div>
          <button
            type="button"
            className="calendar-nav"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
          >
            <span aria-hidden>&#8594;</span>
          </button>
        </div>

        <div className="calendar-weekdays" aria-hidden>
          {WEEKDAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* no role="grid": that contract requires row children, and each
            day is already a self-describing button */}
        <div className="calendar-grid">
          {Array.from({ length: leading }).map((_, i) => (
            <span key={`lead-${i}`} className="calendar-cell is-empty" />
          ))}

          {Array.from({ length: total }, (_, i) => i + 1).map((day) => {
            const key = isoDate(view.year, view.month, day);
            const events = eventsByDate[key] || [];
            const isToday = key === todayKey;
            return (
              <button
                type="button"
                key={key}
                className={`calendar-cell calendar-day${isToday ? " is-today" : ""}${events.length ? " has-events" : ""}`}
                onClick={(e) => openDay(day, e)}
                aria-label={`${MONTHS[view.month]} ${day}, ${view.year}${
                  events.length
                    ? `, ${events.length} event${events.length > 1 ? "s" : ""}: ${events
                        .map((ev) => ev.title)
                        .join(", ")}`
                    : ""
                }`}
              >
                <span className="calendar-daynum">{day}</span>

                {/* aria-hidden throughout: the button's own label already
                    announces the count, and reading each preview would say
                    every title twice - once here, once in the popup */}
                {events.length > 0 && (
                  <>
                    <span className="calendar-day-events" aria-hidden>
                      {events.slice(0, PREVIEW_LIMIT).map((ev, i) => (
                        <span className="calendar-chip" key={ev.id || i}>
                          <span className="calendar-chip-time">
                            {ev.allDay ? "All day" : ev.start}
                          </span>
                          <span className="calendar-chip-title">{ev.title}</span>
                        </span>
                      ))}
                      {events.length > PREVIEW_LIMIT && (
                        <span className="calendar-chip-more">
                          +{events.length - PREVIEW_LIMIT} more
                        </span>
                      )}
                    </span>

                    {/* a cell on a phone is ~45px wide, which no amount of
                        truncation makes a title readable in - so below the
                        breakpoint the previews are swapped for dots */}
                    <span className="calendar-day-dots" aria-hidden>
                      {events.slice(0, 3).map((ev, i) => (
                        <span key={ev.id || i} />
                      ))}
                    </span>
                  </>
                )}
              </button>
            );
          })}

          {Array.from({ length: trailing }).map((_, i) => (
            <span key={`trail-${i}`} className="calendar-cell is-empty" />
          ))}
        </div>

        {status === "error" && (
          <p className="calendar-status" role="status">
            Concert listings are unavailable just now.
          </p>
        )}
        {status === "unconfigured" && import.meta.env.DEV && (
          <p className="calendar-status" role="status">
            Set VITE_GOOGLE_CALENDAR_API_KEY to load concerts.
          </p>
        )}
      </div>

      {selected && (
        <div className="calendar-modal-backdrop" onClick={closeDay}>
          <div
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="calendar-modal-close"
              onClick={closeDay}
              ref={closeRef}
              aria-label="Close"
            >
              <span aria-hidden>&#215;</span>
            </button>

            <p className="calendar-modal-date" id="calendar-modal-title">
              {MONTHS[selected.month]} {selected.day}, {selected.year}
            </p>

            {selectedEvents.length > 0 ? (
              <ul className="calendar-modal-list">
                {selectedEvents.map((ev, i) => (
                  <li key={ev.id || i}>
                    <h2>{ev.title}</h2>
                    <p className="calendar-modal-time">
                      {ev.allDay
                        ? "All day"
                        : ev.end
                          ? `${ev.start} – ${ev.end}`
                          : ev.start}
                    </p>
                    {ev.location && (
                      <p className="calendar-modal-venue">{ev.location}</p>
                    )}
                    {ev.description && (
                      <p className="calendar-modal-desc">{ev.description}</p>
                    )}
                    {ev.rsvpUrl && (
                      <a
                        className="calendar-rsvp-btn"
                        href={ev.rsvpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        // several concerts can share a popup, so the link
                        // needs to say which one it books
                        aria-label={`RSVP for ${ev.title}`}
                      >
                        <span>RSVP here</span>
                        <svg aria-hidden="true">
                          <rect x="0" y="0" width="100%" height="100%" />
                        </svg>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="calendar-modal-empty">
                {status === "loading"
                  ? "Checking for concerts..."
                  : "No concerts scheduled for this day."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
