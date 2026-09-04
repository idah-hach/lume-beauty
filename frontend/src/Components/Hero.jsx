const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <span className="hero-subtitle">BEAUTY • CONFIDENCE • YOU</span>

        <h1>
          Your Beauty,
          <br />
          Your Style
        </h1>

        <p>
          Discover premium beauty products carefully selected to make you feel
          confident and beautiful every day.
        </p>

        <div className="hero-buttons">
          <a href="#shop" className="btn primary">
            Shop Now
          </a>

          <a href="#about" className="btn secondary">
            Discover More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
