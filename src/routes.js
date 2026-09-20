// Single source of truth for the site's routes and their <head> metadata.
//
// Four consumers read this:
//   - PageMeta, at runtime, to update the head on client-side navigation
//   - App, to declare react-router routes and the legacy redirects
//   - scripts/generate-pages.js, to bake one static HTML file per route
//   - the same script, to emit dist/_redirects and dist/sitemap.xml
//
// Keeping all four in one place is the point. The reason only the homepage
// was indexed is that the static HTML and the client-side head disagreed:
// every URL shipped a canonical pointing at "/", so Google folded the five
// routes into one.

export const SITE = "https://mattbassoon.com";

export const routes = [
  {
    path: "/",
    // rewritten in place by the build script; keep first
    file: "index.html",
    title: "Matthew So | Bassoonist, Oboist & Pianist in NYC",
    description:
      "Matthew So is a bassoonist, oboist, pianist and educator based in New York City. Orchestral and chamber performances, upcoming concerts, and private bassoon, oboe, saxophone and piano lessons in NYC.",
  },
  {
    path: "/listen",
    was: "/Listen",
    file: "listen.html",
    title: "Recordings & Performances | Matthew So",
    description:
      "Watch and listen to NYC bassoonist Matthew So perform: Jolivet’s Bassoon Concerto, Jeff Scott’s Elegy for Innocence, Shostakovich, Bartók and Poulenc chamber music.",
  },
  {
    path: "/calendar",
    was: "/Calendar",
    file: "calendar.html",
    title: "Upcoming Concerts in NYC | Matthew So",
    description:
      "Upcoming concerts and performances by New York City bassoonist Matthew So. Dates, venues and times for orchestral and chamber music engagements.",
  },
  {
    path: "/lessons",
    was: "/Lessons",
    file: "lessons.html",
    title: "Bassoon Lessons NYC | Oboe & Piano Lessons | Matthew So",
    description:
      "Private bassoon lessons in NYC with Matthew So, Manhattan School of Music graduate. Also teaching oboe, saxophone, piano and music theory in New York City — reed-making, technique and musicianship for all levels.",
  },
  {
    path: "/contact",
    was: "/Contact",
    file: "contact.html",
    title: "Contact | Matthew So, NYC Bassoonist",
    description:
      "Get in touch with Matthew So to book a bassoon, oboe or piano lesson in New York City, enquire about a performance or engagement, or ask a question.",
  },
];

// Old capitalised URLs -> their lowercase replacement. These were live and
// are in Google's index, so they get 301s rather than just disappearing.
export const legacyRedirects = routes
  .filter((r) => r.was)
  .map((r) => ({ from: r.was, to: r.path }));

export const metaFor = Object.fromEntries(routes.map((r) => [r.path, r]));
