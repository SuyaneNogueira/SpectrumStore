import React, { useState } from "react";
import "./LandingPage.css"; 
import Cadastro from "../Cadastro/Cadastro";
import Login from "../Login/Login";


// Dados para a seção Carrossel
const carouselCardsData = [
  { title: "Aprender com leveza", text: "Jogos e recursos que estimulam habilidades cognitivas de forma prazerosa e adaptada." },
  { title: "Explorar com os sentidos", text: "Materiais sensoriais que acolhem, acalmam e convidam a descobrir o mundo ao seu ritmo." },
  { title: "Inclusão em cada detalhe", text: "Produtos pensados para apoiar diferentes rotinas, idades e estilos de vida dentro do TEA." },
  { title: "Brinquedos sensoriais", text: "Materiais pensados para acolher os sentidos — texturas, pesos e sons que ajudam na regulação e no bem-estar." },
  { title: "Brinquedos educativos e pedagógicos", text: "Recursos lúdicos que transformam aprendizagem em experiência prazerosa: raciocínio, linguagem e coordenação." },
  { title: "Rotina e organização", text: "Materiais que facilitam previsibilidade e autonomia: quadros de rotina, timers e suportes visuais adaptados." },
  { title: "Moda e acessórios sensoriais", text: "Roupas e acessórios projetadas para conforto, segurança tátil e facilidade no uso cotidiano." },
  { title: "Ambiente e relaxamento", text: "Itens para criar espaços calmantes: luzes suaves, texturas aconchegantes e instrumentos de relaxamento." },
  { title: "Jogos Cognitivos e Educacionais", text: "Jogos que estimulam memória, atenção e resolução de problemas com níveis adaptáveis de desafio." },
  { title: "Materiais Escolares Adaptados", text: "Ferramentas didáticas que tornam a escola mais acessível: recursos visuais, ajustáveis e fáceis de usar." },
];

// Dados para a seção "Por que escolher a Spectrum Store?"
const whyChooseCards = [
  { title: "Segurança e Confiança", text: "Materiais testados e aprovados, feitos para quem busca tranquilidade e proteção." },
  { title: "Design Inclusivo", text: "Pensados para diferentes idades, perfis sensoriais e estilos de aprendizado." },
  { title: "Sustentabilidade", text: "Produtos responsáveis, que cuidam de quem usa e do planeta em que vivemos." },
  { title: "Estímulo Completo", text: "Ferramentas que desenvolvem habilidades cognitivas, sociais, motoras e emocionais." },
  { title: "Impacto Social", text: "Cada compra apoia iniciativas de inclusão, diversidade e apoio ao TEA." },
  { title: "Experiência Memorável", text: "Mais do que o produto: um aliado para tornar o dia a dia mais confortável, inclusivo e feliz." },
];

function LandingPage() {
  const CARDS_PER_VIEW = 3;
  const TOTAL_CARDS = carouselCardsData.length;
  const TOTAL_GROUPS = 4; 
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0); 
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);  
  const [isLoginOpen, setIsLoginOpen] = useState(false);  
  const cardsToDisplay = [...carouselCardsData, ...carouselCardsData.slice(0, CARDS_PER_VIEW)];
  const VISUAL_CARDS_COUNT = cardsToDisplay.length;
  const nextGroup = () => {

    setCurrentGroupIndex((prevIndex) => (prevIndex === TOTAL_GROUPS - 1 ? 0 : prevIndex + 1));
    };

  const prevGroup = () => {

    setCurrentGroupIndex((prevIndex) => (prevIndex === 0 ? TOTAL_GROUPS - 1 : prevIndex - 1));
    };
   
   const translateValue = currentGroupIndex * CARDS_PER_VIEW * 100 / VISUAL_CARDS_COUNT;

 return (
    <div className="landing-container">
            
            {isCadastroOpen && <Cadastro onClose={() => setIsCadastroOpen(false)} />}
            {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
         
         {/* NAVBAR */}
         <nav className="landing-navbar">
             <img src="/Spectrum Store.png" alt="Spectrum Store Logo" className="landing-logo" />
             <div className="landing-login-links">
              <div className="landing-login-links"
                     onClick={() => setIsLoginOpen(true)} 
                     style={{cursor: 'pointer', marginLeft: '-35px'}} 
                 >
                     Entrar
                 </div>
             <div className="landing-cadastro-links"
                     onClick={() => setIsCadastroOpen(true)} 
                     style={{cursor: 'pointer', marginLeft: '30px'}} 
                 >
                     Cadastre-se
                 </div>
        </div>
   </nav>       
   {/* HERO */}
   <section className="landing-hero" aria-labelledby="hero-title">
      <div className="hero-content">
       <h2 id="hero-title">Bem-vindo(a)</h2>
       <p>
       Na Spectrum Store, cada produto é pensado para pessoas no espectro autista em todas as
       fases da vida. Mais que itens, oferecemos recursos que promovem bem-estar, autonomia e
       inclusão — sempre com carinho, qualidade e propósito.
       </p>
      </div>
   </section>       
   {/* CARROSSEL */}
   <section className="carousel-section" aria-roledescription="carousel">
   <button className="carousel-arrow left" onClick={prevGroup} aria-label="Anterior">
    <img src="/SetaE.png" alt="Seta esquerda" className="arrow-icon" />
   </button>       
   <div className="carousel-window">
   <div className="carousel-track" style={{ transform: `translateX(-${translateValue}%)` }}>       
    {cardsToDisplay.map((card, index) => (
     <div key={index} className="carousel-card">
     <h4>{card.title}</h4>
     <p>{card.text}</p>
     </div>
    ))}
   </div>
   </div>       
   <button className="carousel-arrow right" onClick={nextGroup} aria-label="Próximo">
     <img src="/SetaD.png" alt="Seta direita" className="arrow-icon" />
   </button>
   
   {/* Indicadores do Carrossel (Bolinhas) */}
   <div className="carousel-indicators">
      {[...Array(TOTAL_GROUPS)].map((_, index) => (
         <button
           key={index}
           className={`indicator-dot ${index === currentGroupIndex ? 'active' : ''}`}
           onClick={() => setCurrentGroupIndex(index)}
           aria-label={`Ir para o slide ${index + 1}`}
         />
      ))}
   </div>
   </section>       
   {/* SEÇÃO “MUITO ALÉM DE PRODUTOS” */}
   <section className="beyond-products">
   <div className="beyond-content">
    <h3>Muito além de produtos</h3>
    <p>
      Cada pessoa no espectro é única. Por isso, nossos recursos vão além da utilidade: eles
      acolhem, estimulam e tornam a vida mais leve. Seja no brincar, nos estudos, no trabalho ou no dia a dia,
      criamos soluções que fortalecem a autonomia e celebram a diversidade.
    </p>
   </div>
   </section>       
   {/* SEÇÃO “POR QUE ESCOLHER A SPECTRUM STORE?” */}
   <section className="why-spectrum">
    <div className="why-header-container">
     <h2>Por que escolher a Spectrum Store?</h2>
    </div>
    <div className="why-grid">
      {whyChooseCards.map((card, index) => (
        <div key={index} className="why-card">
        <h4>{card.title}</h4>
        <p>{card.text}</p>
        </div>
      ))}
    </div>
   </section>       
   {/* CHAMADA FINAL */}
   <section className="final-call">
     <h3>Transforme rotina em qualidade de vida</h3>
     <p>
      Na Spectrum Store, cada escolha é um passo em direção à mais autonomia, acolhimento e
      bem-estar. <br /> Junte-se a nós e faça parte dessa transformação que valoriza cada pessoa
      dentro do espectro autista.
     </p>
   </section>       
   {/* FOOTER */}
   <footer className="landing-footer">
     <img src="/Spectrum Store.png" alt="Spectrum Store Logo" className="footer-logo" />
     <div className="footer-info">
     <p>Fale Conosco: spectrum.tea2024@gmail.com</p>
     <p>
      <img src="/InstagramLP.png" alt="Instagram Logo" className="footer-social-icon" /> 
      Nos Acompanhe Também no Instagram
     </p>
  </div>
   </footer>
  </div>
);
}

export default LandingPage;