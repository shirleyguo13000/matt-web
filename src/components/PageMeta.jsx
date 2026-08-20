import { useEffect } from "react";

const SITE = "https://mattbassoon.com";

// This is a single-page app, so every route otherwise shares the one
// title and description in index.html - meaning each page competes for
// the same search terms. Setting them per route lets the lessons page
// rank for lessons and the calendar page for concerts. Google executes
// JS when it renders, so it reads these; the static tags in index.html
// stay as the fallback for crawlers that do not.
function PageMeta({ title, description, path }) {
  useEffect(() => {
    document.title = title;

    const set = (selector, create, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    set(
      'meta[name="description"]',
      () => Object.assign(document.createElement("meta"), { name: "description" }),
      "content",
      description,
    );
    set(
      'meta[property="og:title"]',
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:title");
        return m;
      },
      "content",
      title,
    );
    set(
      'meta[property="og:description"]',
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:description");
        return m;
      },
      "content",
      description,
    );
    set(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      "href",
      SITE + path,
    );
    set(
      'meta[property="og:url"]',
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:url");
        return m;
      },
      "content",
      SITE + path,
    );
  }, [title, description, path]);

  return null;
}

export default PageMeta;
