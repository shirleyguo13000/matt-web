import React from "react";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { FaLinkedin, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Home from "./pages/Home.jsx";
import Listen from "./pages/Listen.jsx";
import Calendar from "./pages/Calendar.jsx";
import Contact from "./pages/Contact.jsx";
import Lessons from "./pages/Lessons.jsx";
import ScrollTop from "../src/ScrollTop.jsx";
import "./App.css";

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
          <li>
            <Link to="/Listen" onClick={closeMenu}>
              Listen
            </Link>
          </li>
          <li>
            <Link to="/Calendar" onClick={closeMenu}>
              Calendar
            </Link>
          </li>
          <li>
            <Link to="/Lessons" onClick={closeMenu}>
              Lessons
            </Link>
          </li>
          <li>
            <Link to="/Contact" onClick={closeMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      <Routes className="links">
        <Route path="/" element={<Home />} />
        <Route path="/Listen" element={<Listen />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/Lessons" element={<Lessons />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>

      <footer>
        <div className="social-icons">
          <a
            href="https://www.linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.facebook.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a href="mailto:your-email@example.com" aria-label="Email">
            <MdEmail />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
