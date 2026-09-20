import { Link } from "react-router-dom";
import { useEffect } from "react";

// Netlify serves this shell with a real 404 status (see the catch-all rule
// in the generated _redirects), so unknown URLs are genuine 404s rather
// than soft ones. The noindex below is belt-and-braces for the case where
// a crawler renders the page anyway.
function NotFound() {
  useEffect(() => {
    document.title = "Page not found | Matthew So";

    let robots = document.head.querySelector('meta[name="robots"]');
    const added = !robots;
    if (added) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex");

    // a 404 must not leave the previous page's canonical behind, or Google
    // reads it as that page
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.remove();

    return () => {
      if (added && robots) robots.remove();
    };
  }, []);

  return (
    <div className="notfound-parent-div">
      <h1 className="notfoundh1">Page not found</h1>
      <span className="hairline" aria-hidden />
      <p className="notfound-text">
        That page doesn&rsquo;t exist &mdash; it may have moved, or the link
        may be mistyped.
      </p>
      <div className="notfound-links">
        <Link to="/">Home</Link>
        <Link to="/listen">Listen</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/lessons">Lessons</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </div>
  );
}

export default NotFound;
