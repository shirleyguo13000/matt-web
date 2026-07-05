import { Routes, Route, Link } from "react-router-dom";
import { FaLinkedin, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Home from "./pages/Home.jsx";
import About from "./pages/About";
import Listen from "./pages/Listen.jsx";
import Calendar from "./pages/Calendar.jsx";
import Contact from "./pages/Contact.jsx";
import Lessons from "./pages/Lessons.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <nav>
        <div>
          <Link to="/" className="logo">
            Matthew So
          </Link>
        </div>
        <ul>
          <li>
            <Link to="/About">About</Link>
          </li>
          <li>
            <Link to="/Listen">Listen</Link>
          </li>
          <li>
            <Link to="/Calendar">Calendar</Link>
          </li>
          <li>
            <Link to="/Lessons">Lessons</Link>
          </li>
          <li>
            <Link to="/Contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <Routes className="links">
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
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
