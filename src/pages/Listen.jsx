import { Link } from "react-router-dom";
import msmlivestream1 from "../assets/msmlivestream1.webp";
import msmlivestream2 from "../assets/msmlivestream2.webp";

function Listen() {
  return (
    <div className="listen-parent-div">
      <h1 className="listen-h1">Recordings and Performances</h1>
      <span className="hairline" aria-hidden />

      <div className="video">
        <iframe
          src="https://www.youtube.com/embed/aRiEdV4NUng?si=EKa7AQQNmdPzAeW0"
          title="Jeff Scott: Elegy for Innocence for bassoon and piano"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <p>
          Elegy for Innocence for bassoon and piano by Jeff Scott. <br />
          Performed on April 16th, 2026 at Manhattan School of Music on
          Matthew's Master's graduation recital. <br />
          Pianist: Jenny Tseng
        </p>
      </div>

      <div className="video">
        <iframe
          src="https://www.youtube.com/embed/V2okm3n5Di8?si=nWUdDPfu8xQ_fpO-"
          title="André Jolivet: Bassoon Concerto"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <p>
          André Jolivet: Bassoon Concerto. <br />
          Performed on April 16th, 2026 at Manhattan School of Music on
          Matthew's Master's graduation recital. <br />
          Pianist: Jenny Tseng
        </p>
      </div>

      <div className="video">
        <h3>Lillian Fuchs Chamber Music Competition Winners' Concert</h3>
        <a
          href="https://www.msmnyc.edu/livestream/lillian-fuchs-chamber-music-winners-concert-2025-04-30/"
          target="_blank"
        >
          <div className="hrefimg-wrapper">
            <img
              src={msmlivestream2}
              alt="Fuch's Chamber winner's concert snapshot"
              className="hrefimg-inner"
            />
          </div>
        </a>
        <p className="hrefp">
          Lillian Fuchs Winner concert featuring Matthew's chamber group's
          winning performance of{" "}
          <span className="listen-italics">
            Sextet for Piano and Winds, FP 100 by FRANCIS POULENC
          </span>{" "}
          on April 30th, 2025.
          <br />
          Timestamp: 01:14:38.
        </p>
      </div>

      <div className="video">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/-fdNaJ3ug68?si=-eeOo-eaj_7kcsZL&amp;start=4422"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <p>
          Symphony No. 10 by Dmitri Shostakovich.
          <br />
          Performed on January 30th, 2026 with{" "}
          <span className="listen-italics">
            The New York City Orchestra Project
          </span>{" "}
          as principal bassoonist.
        </p>
      </div>

      <div className="video">
        <h3>BÉLA BARTÓK, Concerto for Orchestra, Sz 116, BB123</h3>
        <a
          href="https://www.msmnyc.edu/livestream/opus130-2024-09-18/"
          target="_blank"
        >
          <div className="hrefimg-wrapper">
            <img
              src={msmlivestream1}
              alt="MSM orchestra playing Bartok's Concerto for Orchestra"
              className="hrefimg-inner"
            />
          </div>
        </a>
        <p className="hrefp">
          Performed on Sept 18 2024 with MSM Orchestra Opus 130. Conducted by
          David Chen. <br /> Timestamp: 1:00:35
        </p>
      </div>

      <div className="listen-btn-div">
        <Link to="/Calendar" className="listen-btn">
          <span>Upcoming concerts</span>
          <svg aria-hidden="true">
            <rect x="0" y="0" width="100%" height="100%" />
          </svg>
        </Link>
        <Link to="/Lessons" className="listen-btn">
          <span>Book a lesson</span>
          <svg aria-hidden="true">
            <rect x="0" y="0" width="100%" height="100%" />
          </svg>
        </Link>
        <Link to="/Contact" className="listen-btn">
          <span>Contact</span>
          <svg aria-hidden="true">
            <rect x="0" y="0" width="100%" height="100%" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default Listen;
