import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About";
import Listen from "./pages/Listen.jsx";
import Calendar from "./pages/Calendar.jsx";
import Contact from "./pages/Contact.jsx";

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li className="logo">
            <Link to="/">Matthew So</Link>
          </li>
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
            <Link to="/Contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <footer>
        {/* install react-icons, put in linkedin, facebook and email */}
      </footer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Listen" element={<Listen />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
