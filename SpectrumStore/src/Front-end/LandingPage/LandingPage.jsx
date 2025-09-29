import React, { useState } from "react";
import { Link } from "react-router-dom"; // Certifique-se de que o Router está configurado
import "./LandingPage.css";

function LandingPage() {
  const cards = [
    {
      title: "Aprender com leveza",
      text: "Jogos e recursos que estimulam habilidades cognitivas de forma prazerosa e adaptada.",
    },
    {
      title: "Explorar com os sentidos",
      text: "Materiais sensoriais que acolhem, acalmam e convidam a descobrir o mundo ao seu ritmo.",
    },
    {
      title: "Inclusão em cada detalhe",
      text: "Produtos pensados para apoiar diferentes rotinas, idades e estilos de vida dentro do TEA.",
    },
  ];

  const [current, setCurrent] = useState(0);

  const prevCard = () => {
    setCurrent((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const nextCard = () => {
    setCurrent((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="landing-container">

      <nav className="landing-navbar">
        <img src="/Spectrum Store.png" alt="Spectrum Store" className="landing-logo" />
        <div className="landing-nav-links">
          <Link to="/login">Entrar</Link>
          <Link to="/cadastro">Cadastre-se</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <h1>Bem-vindo(a)</h1>
        <p>
          Na Spectrum Store, cada produto é pensado para pessoas no espectro autista em todas as
          fases da vida. Mais que itens, oferecemos recursos que promovem bem-estar, autonomia e
          inclusão — sempre com carinho, qualidade e propósito.
        </p>
      </section>

      <section className="landing-carousel">
        <button className="carousel-arrow left" onClick={prevCard}>
          <img src="/SetaE.png" alt="Anterior" />
        </button>

        <div className="carousel-card">
          <h3>{cards[current].title}</h3>
          <p>{cards[current].text}</p>
        </div>

        <div className="carousel-card">
          <h3>{cards[current].title}</h3>
          <p>{cards[current].text}</p>
        </div>

        <div className="carousel-card">
          <h3>{cards[current].title}</h3>
          <p>{cards[current].text}</p>
        </div>

        <button className="carousel-arrow right" onClick={nextCard}>
          <img src="/SetaD.png" alt="Próximo" />
        </button>
      </section>
    </div>
  );
}

export default LandingPage;
