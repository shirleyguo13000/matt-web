import bassoon from "../assets/bassoon.webp";
import oboe from "../assets/oboe.webp";
import piano from "../assets/piano.webp";
import theory from "../assets/theory.webp";
import PageMeta from "../components/PageMeta.jsx";

function Lessons() {
  return (
    <div className="lesson-parent-div">
      <PageMeta
        title="Bassoon, Oboe & Piano Lessons in New York | Matthew So"
        description="Private bassoon, oboe, piano and music theory lessons in New York with Matthew So, Manhattan School of Music graduate. Reed-making, technique and musicianship."
        path="/Lessons"
      />
      <h1 className="lessonh1">Book a Lesson</h1>
      <span className="hairline" aria-hidden />
      <div className="lesson-grid-parent">
        <div className="lesson-card lessonbsn">
          <h2>Bassoon</h2>
          <img
            src={bassoon}
            alt="Close-up of a bassoon’s keywork and rosewood body"
            fetchPriority="high"
          />
          <p>
            More than on any other instrument, a bassoonist's success begins
            with the reed. A student can have flawless technique and beautiful
            musical instincts, but a poor reed will undermine intonation, tone,
            and response before a single phrase is shaped. I begin students on a
            playable, decently well-made reed so their earliest experiences on
            the instrument are not fighting an unworkable setup. From there, we
            establish embouchure and air support through long tones, then build
            fundamental hand position and fingerings. Scale and interval work
            (Milde's studies are a mainstay) develops technique in sync with
            tone quality, and I introduce simple, musical material early so that
            phrasing and expression are never separated from technique-building.
            As students mature, I bring in reed adjustment and eventually
            reed-making, so they gain independence over the single variable that
            affects everything else.
          </p>
        </div>
        <div className="lesson-card lessonpno">
          <h2>Piano</h2>
          <img
            src={piano}
            alt="Piano keyboard lit from above"
            loading="lazy"
          />
          <p>
            At the piano, the defining challenge is hand-eye coordination — our
            eyes having to read two lines of music to process rhythm and
            notation, and then translating into two hands playing the
            independent lines, all while requiring your ears to listen to
            yourself and reflect upon what can be done better during practice.
            Successful pianists develop this coordination alongside strong aural
            awareness: the ability to listen critically to their own sound and
            adjust in real time. Technical fluency and internal listening have
            to grow together. I start students with hand position and hand shape
            — a relaxed, rounded hand so that they can feel comfortable and move
            efficiently across the keyboard. Note reading and basic technique
            (scales, simple arpeggios) develop alongside this. As technique
            advances through graded repertoire, I weave in sight-reading and ear
            training throughout, so musicianship is built in step with technical
            skill rather than bolted on afterward.
          </p>
        </div>
        <div className="lesson-card lessonoboe">
          <h2>Oboe</h2>
          <img
            src={oboe}
            alt="An oboe with its reed"
            className="oboeimg"
            loading="lazy"
          />
          <p>
            Where the bassoon favors a wide and open air stream, the oboe
            demands the opposite: a narrower, more tightly controlled,
            compressed airstream and a firm, different degree of angle
            embouchure is required. Much of the success on oboe comes from one's
            ability to manage air pressure and pacing — exhaling slowly and
            steadily against real resistance — while keeping the embouchure
            flexible enough to bend pitch and color on demand. I teach within
            the American oboe tradition — a clear, focused, vibrant sound with
            flexible color and articulation — while staying practical rather
            than dogmatic about lineage, since most of my students come to the
            oboe as a second or exploratory instrument. My priority is giving
            each student a reliable, healthy setup they can build on, adapting
            my approach as their ears and goals develop rather than insisting on
            a single stylistic mold from day one.
          </p>
        </div>
        <div className="lesson-card lessontheory">
          <h2>Music Theory & Aural</h2>
          <img
            src={theory}
            alt="Handwritten sheet music used for theory and aural training"
            className="theoryimg"
            loading="lazy"
          />
        </div>
      </div>
      <a
        href="https://airtable.com/appjXE1qz3E25t2u8/paghfPFN1N5vohAMR/form"
        target="_blank"
        rel="noopener noreferrer"
        className="lessonbtn"
      >
        <span>Book a lesson</span>
        <svg aria-hidden="true">
          <rect x="0" y="0" width="100%" height="100%" />
        </svg>
      </a>
    </div>
  );
}

export default Lessons;
