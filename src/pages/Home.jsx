function Home() {
  return (
    <div>
      <h1 className="home-h1">Matthew So</h1>
      <p className="headline">Bassoonist | Oboist | Pianist | Educator</p>
      <img
        src="src/assets/Screenshot_20260507-151346.jpg"
        alt="portrait of Matthew So"
        className="portrait-one"
      />
      <p className="home-p">
        Professional bassoonist, educator and chamber musician based in New York
        City
      </p>
      <div className="button-grid">
        <button className="home-btn home-btn1">Hire me</button>
        <button className="home-btn home-btn2">Book a lesson</button>
      </div>
    </div>
  );
}

export default Home;
