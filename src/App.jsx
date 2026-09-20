import { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";
import Home from "./pages/Home.jsx";
import Listen from "./pages/Listen.jsx";
import Calendar from "./pages/Calendar.jsx";
import Contact from "./pages/Contact.jsx";
import Lessons from "./pages/Lessons.jsx";
import NotFound from "./pages/NotFound.jsx";
import ScrollTop from "./components/ScrollTop.jsx";
import { legacyRedirects } from "./routes.js";
import "./App.css";

// deliberately NOT lazy-loaded: splitting these saved ~7 kB gzip but
// made a direct visit to any of them paint an empty page first, then
// pop the content in - a 1.0 layout shift. not worth it at this size.

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div>
      <ScrollTop />
      <nav>
        <div>
          <Link to="/" className="logo" onClick={closeMenu}>
            Matthew So
          </Link>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={menuOpen ? "open" : ""}>
          <li className="nav-social">
            <a
              href="https://www.youtube.com/@matttbassoon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Matthew So on YouTube"
              onClick={closeMenu}
            >
              <FaYoutube aria-hidden="true" />
            </a>
          </li>
          <li>
            <Link to="/listen" onClick={closeMenu}>
              Listen
            </Link>
          </li>
          <li>
            <Link to="/calendar" onClick={closeMenu}>
              Calendar
            </Link>
          </li>
          <li>
            <Link to="/lessons" onClick={closeMenu}>
              Lessons
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listen" caseSensitive element={<Listen />} />
          <Route path="/calendar" caseSensitive element={<Calendar />} />
          <Route path="/lessons" caseSensitive element={<Lessons />} />
          <Route path="/contact" caseSensitive element={<Contact />} />

          {/* The capitalised URLs were live, so Netlify 301s them at the
              HTTP level (see the generated _redirects) - that is the part
              Google cares about. These client-side equivalents cover
              in-app navigation and keep the SPA correct on its own if a
              host rule ever goes missing. They are only reachable because
              the routes above are caseSensitive: react-router matches
              case-insensitively by default, which would otherwise render
              /Listen in place without ever normalising the URL. */}
          {legacyRedirects.map(({ from, to }) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <div className="social-icons">
          <a
            href="https://www.linkedin.com/in/matthew-so-364854218/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.facebook.com/matthew.so.33"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.youtube.com/@matttbassoon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Youtube"
          >
            <FaYoutube />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
