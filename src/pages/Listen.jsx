import React from "react";
import ReactPlayer from "react-player";
import { useEffect } from "react";

function Listen() {
  return (
    <div className="listen-parent-div">
      <h1 className="listen-h1">Recordings and Performances</h1>
      <span class="hairline" aria-hidden />
      <div className="video">
        <iframe
          src="https://www.youtube.com/embed/aRiEdV4NUng?si=EKa7AQQNmdPzAeW0"
          title="Jeff Scott: Elegy for Innocence for bassoon and piano"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <p>
          Elegy for Innocence for bassoon and piano by Jeff Scott. <br></br>
          Performed on April 16th, 2026 at Manhattan School of Music on
          Matthew's Master's graduation recital. <br></br>
          Pianist: Jenny Tseng
        </p>
      </div>
      <div className="video">
        <iframe
          src="https://www.youtube.com/embed/V2okm3n5Di8?si=nWUdDPfu8xQ_fpO-"
          title="André Jolivet: Bassoon Concerto"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <p>
          André Jolivet: Bassoon Concerto. <br></br>
          Performed on April 16th, 2026 at Manhattan School of Music on
          Matthew's Master's graduation recital. <br></br>
          Pianist: Jenny Tseng
        </p>
      </div>
      <div className="video">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/-fdNaJ3ug68?si=-eeOo-eaj_7kcsZL&amp;start=4422"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <p>
          Symphony No. 10 by Dmitri Shostakovich.
          <br></br>
          Performed on January 30th, 2026 with{" "}
          <span className="listen-italics">
            {" "}
            The New York City Orchestra Project{" "}
          </span>{" "}
          as principal bassoonist.
        </p>
      </div>
    </div>
  );
}

export default Listen;
