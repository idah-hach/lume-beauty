import Navbar from "../Navbar";
import Hero from "../Hero";
import Products from "../Products";
import About from "../About";
import Contact from "../Contact";
import Footer from "../Footer";
import "../../App.css";

const Home = ({
  cart,
  cartCount,
  onAddToCart,
  onRemove,
  onIncrease,
  onDecrease,
}) => {
  return (
    <>
      <Navbar
        cart={cart}
        cartCount={cartCount}
        onRemove={onRemove}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />

      <main>
        <Hero />

        <Products onAddToCart={onAddToCart} />

        <About />

        <Contact />
      </main>

      <Footer />
    </>
  );
};

export default Home;
