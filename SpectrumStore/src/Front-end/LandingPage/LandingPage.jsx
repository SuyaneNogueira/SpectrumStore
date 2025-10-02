import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "./LandingPage.css";

function LandingPage() {
  const cards = [
     {
      title: "Brinquedos sensoriais",
      text:
        "Materiais pensados para acolher os sentidos — texturas, pesos e sons que ajudam na regulação e no bem-estar.",
    },
    {
      title: "Brinquedos educativos e pedagógicos",
      text:
        "Recursos lúdicos que transformam aprendizagem em experiência prazerosa: raciocínio, linguagem e coordenação.",
    },
    {
      title: "Rotina e organização",
      text:
        "Materiais que facilitam previsibilidade e autonomia: quadros de rotina, timers e suportes visuais adaptados.",
    },
    {
      title: "Moda e acessórios sensoriais",
      text:
        "Roupas e acessórios projetados para conforto, segurança tátil e facilidade no uso cotidiano.",
    },
    {
      title: "Ambiente e relaxamento",
      text:
        "Itens para criar espaços calmantes: luzes suaves, texturas aconchegantes e instrumentos de relaxamento.",
    },
    {
      title: "Jogos Cognitivos e Educacionais",
      text:
        "Jogos que estimulam memória, atenção e resolução de problemas com níveis adaptáveis de desafio.",
    },
    {
      title: "Materiais Escolares Adaptados",
      text:
        "Ferramentas didáticas que tornam a escola mais acessível: recursos visuais, ajustáveis e fáceis de usar.",
    },
    {
      title: "Cuidados e Rotina Pessoal",
      text:
        "Produtos pensados para autonomia nas atividades diárias com conforto e segurança.",
    },
    {
      title: "Materiais de CAA",
      text:
        "Soluções de Comunicação Aumentativa e Alternativa criadas para apoiar a expressão e interação.",
    },
    {
      title: "Material Ponderado",
      text:
        "Produtos ponderados e de pressão profunda para ajudar na autorregulação e sensação de segurança.",
    },
  ];

  const [current, setCurrent] = useState(0);

  const prevCard = () => {
    setCurrent((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const nextCard = () => {
    setCurrent((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

 
  const leftIndex = (current - 1 + cards.length) % cards.length;
  const rightIndex = (current + 1) % cards.length;

  return (
    <div className="landing-container">
      <nav className="landing-navbar">
        <img src="/Spectrum Store.png" alt="Spectrum Store" className="landing-logo" />
        <div className="landing-nav-links">
          <Link to="/Login">Entrar</Link>
          <Link to="/Cadastro">Cadastre-se</Link>
        </div>
      </nav>
       <div>
      <section className="landing-hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Bem-vindo(a)</h1>
        <p>
          Na Spectrum Store, cada produto é pensado para pessoas no espectro autista em todas as
          fases da vida. Mais que itens, oferecemos recursos que promovem bem-estar, autonomia e
          inclusão — sempre com carinho, qualidade e propósito.
        </p>
      </section>
      </div>
      <section className="landing-carousel" aria-roledescription="carousel">
        <button
          className="carousel-arrow left"
          onClick={prevCard}
          aria-label="Anterior"
        >
          <img src="/SetaE.png" alt="Seta esquerda" />
        </button>

        <div className="carousel-card">
          <h3>{cards[leftIndex].title}</h3>
          <p>{cards[leftIndex].text}</p>
        </div>

        <div className="carousel-card">
          <h3>{cards[current].title}</h3>
          <p>{cards[current].text}</p>
        </div>

        <div className="carousel-card">
          <h3>{cards[rightIndex].title}</h3>
          <p>{cards[rightIndex].text}</p>
        </div>

        <button
          className="carousel-arrow right"
          onClick={nextCard}
          aria-label="Próximo"
        >
          <img src="/SetaD.png" alt="Seta direita" />
        </button>
      </section>
    </div>
  );
}

export default LandingPage;
