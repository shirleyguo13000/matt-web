import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="home-page-body">
        <div className="home-title-div">
          <h1 className="home-h1">Matthew So</h1>
          <p className="headline">Bassoonist | Oboist | Pianist | Educator</p>
        </div>
        <div className="about-transition">
          <Link
            to="#about"
            className="scroll-arrow about-hover"
            aria-label="Go to About page"
          >
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 10l6 6 6-6" />
            </svg>
          </Link>
        </div>
        {/* <img
        src="src/assets/Screenshot_20260507-151346.jpg"
        alt="portrait of Matthew So"
        className="portrait-one"
      /> */}
        {/* <p className="home-p">
        A performer and educator dedicated to creating meaningful musical
        experiences.
      </p> */}
        {/* <div className="button-grid">
        <button className="home-btn home-btn1">Hire me</button>
        <button className="home-btn home-btn2">Book a lesson</button>
      </div> */}
      </div>
      {/* -------------------add a page divider line here----------- */}
      <hr class="solid"></hr>
      <div className="bio" id="about">
        <p className="about-page-title">About</p>
        <span class="hairline" aria-hidden />
        {/* <img
          src="src/assets/Screenshot_20260507-151346.jpg"
          alt="portrait of Matthew So"
          className="portrait-one"
        /> */}
        <div className="bio-text">
          <p>
            <span className="drop-cap">R</span>
            <span className="lede">ooted in a passion</span> for artistic
            excellence and driven by a lifelong love for music, Matthew So is a
            performer and educator dedicated to creating meaningful musical
            experiences. From orchestral stages to chamber music collaborations
            and private instruction, his work reflects a commitment to the
            highest standards of musicianship and the joy of sharing music with
            others.
          </p>
          <p>
            A finalist in multiple professional orchestra auditions, Matthew has
            established himself as a sought-after orchestral musician known for
            his exceptional performance quality and reliability. His previous
            engagements include the New World Symphony, the Chelsea Symphony,
            the Hahnsol Music Group, and many more.
          </p>
          <p>
            In addition to his freelance orchestral career, Matthew is an avid
            chamber musician and a two-time consecutive winner of the Fuchs
            Chamber Competition.
          </p>

          <p>
            Matthew earned his Master's degree in Classical Bassoon from
            Manhattan School of Music, where he studied under William Short,
            Principal Bassoon of the Metropolitan Opera. He completed his
            undergraduate degree at McGill University under Stéphane Lévesque
            and has also received guidance from Nguyen Bao Anh, Fraser Jackson,
            Mathias Steir, Carin Miller, Kim Laskowski, Miles Maner, and Michael
            Sundell.
          </p>
          <p>
            Originally from Hong Kong and Toronto, Matthew began his musical
            journey at the piano at the age of five before taking up the bassoon
            at twelve—the instrument that would become central to his artistic
            identity. Along the way, he also studied oboe and saxophone, making
            him a versatile presence across orchestral, chamber, and
            contemporary settings. His festival experience includes the National
            Academy Orchestra in Hamilton, Canada, and the National Repertory
            Orchestra in Breckenridge, Colorado.
          </p>
          <p>
            Today, Matthew maintains an active performance and teaching studio
            in New York, offering private instruction in bassoon, oboe,
            saxophone, and piano.
          </p>
        </div>
      </div>
      <div className="home-btn-div">
        <button className="home-btn">Listen</button>
        <button className="home-btn">Contact</button>
      </div>
    </div>
  );
}

export default Home;
