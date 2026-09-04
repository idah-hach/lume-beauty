const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="contact-content">
        <span>GET IN TOUCH</span>

        <h2>Let's Connect</h2>

        <p>
          Have a question or want to place an order? Reach us directly through
          WhatsApp or Instagram.
        </p>

        <div className="contact-buttons">
          <a
            href="https://wa.me/0096181678108"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn whatsapp"
          >
            WhatsApp
          </a>

          <a
            href="https://instagram.com/she_Wants.s"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn instagram"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
