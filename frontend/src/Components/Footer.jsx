const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>LUMÉ Beauty</h2>
          <p>
            Premium beauty essentials, carefully selected to help you feel
            confident and beautiful every single day.
          </p>
        </div>

        <nav className="footer-links">
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="footer-social">
          <a
            href="https://wa.me/0096181678108"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a
            href="https://instagram.com/she_Wants.s"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LUMÉ Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
