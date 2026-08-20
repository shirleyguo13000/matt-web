import { useState, useEffect, useRef } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
    const entry = {
      id: ev.id,
      title: ev.summary || "Untitled event",
      location: ev.location || "",
      description: ev.description || "",
      allDay,
      start: allDay ? "" : formatTime(ev.start.dateTime, zone),
      end: allDay || !ev.end?.dateTime ? "" : formatTime(ev.end.dateTime, zone),
    };
    eventDayKeys(ev, calendarZone).forEach((key) => {
      byDate[key] = byDate[key] ? [...byDate[key], entry] : [entry];
    });
  });
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

        <div className="calendar-grid" role="grid">
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
                aria-label={`${MONTHS[view.month]} ${day}, ${view.year}${events.length ? `, ${events.length} event${events.length > 1 ? "s" : ""}` : ""}`}
              >
                <span className="calendar-daynum">{day}</span>
                {events.length > 0 && (
                  <span className="calendar-event-corner" aria-hidden />
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
                    <h3>{ev.title}</h3>
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
