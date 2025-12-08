import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./TelaInfo.css";

function TelaInfo() {

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const infos = [
    {
      titulo: "O que Significa Estar no Espectro Autista",
      texto: `O TEA é uma forma natural de funcionamento neurológico. Cada pessoa autista tem suas próprias maneiras de perceber o mundo, comunicar, sentir estímulos e organizar seus interesses.
 O DSM-5-TR descreve diferenças em comunicação social e padrões de comportamento, mas isso não define quem alguém é — apenas ajuda na identificação e no acesso ao suporte necessário.
Para nós, aqui na Spectrum Store, o mais importante é lembrar:
  Cada pessoa tem uma forma única de viver o espectro.
  Não existe um perfil “certo” ou  “errado”.
 As necessidades e preferências sensoriais são reais e merecem respeito.`
    },
    {
      titulo: "Identificação Precoce e Trajetória de Desenvolvimento",
      texto: `A ciência mostra que quanto mais cedo a criança recebe suporte, melhor — mas crianças, adolescentes e adultos podem aprender, desenvolver habilidades e encontrar conforto com as ferramentas adequadas.
A identificação precoce ajuda porque:
• Facilita acesso a intervenções;
• Fortalece autonomia ao longo do crescimento;`
    },
    {
      titulo: "Intervenções baseadas em evidências",
      texto: `As pesquisas atuais mostram que intervenções estruturadas podem ajudar em áreas como comunicação, habilidades sociais e autonomia. 
      Mas também é verdade que cada pessoa responde de um jeito.

    O que funciona melhor costuma envolver:
    •  Clareza e previsibilidade;
    •  Objetivos pequenos e alcançáveis;
    •  Participação ativa da família;
    •  Respeito ao ritmo individual;
    •  Ambientes amigáveis sensorialmente.

    E aqui está um ponto essencial: nenhum recurso, brinquedo ou ferramenta substitui um profissional — mas eles podem apoiar muito esse processo.`
    },
    {
      titulo: "Comunicação Aumentativa e Alternativa (CAA)",
      texto: `A CAA não “atrapalha” a fala — pelo contrário, ajuda no desenvolvimento da linguagem, reduz frustrações e amplia a autonomia.
    Pode ser usada por:
    • Crianças que ainda não falam;
    • Pessoas que falam pouco;
    • Pessoas que falam, mas preferem outras formas de comunicação em ambientes mais exigentes;
    • Adultos que têm seletividade de fala.
    
    Na prática, isso significa:
    •  Quadros de comunicação,
    •  Aplicativos,
    •  Cartões visuais,
    •  Símbolos, gestos, imagens…
    É comunicação — e toda forma de comunicação é válida.`
    },
    {
      titulo: "Sensibilidades Sensoriais e uso de Produtos Sensoriais",
      texto: `Pessoas autistas frequentemente sentem o mundo de forma mais intensa (ou menos intensa) em aspectos como toque, som, luz, textura e movimento.
Por isso os produtos sensoriais fazem sentido:
• Ajudam a regular o corpo;
• Reduzem ansiedade;
• Aumentam concentração;
• Criam conforto e previsibilidade;
• Permitem expressão e alívio sem julgamento.

A ciência mostra que os efeitos variam de pessoa para pessoa — então sempre recomendamos observar como cada pessoa se sente, em vez de esperar “uma resposta padrão”.`
    },
    {
      titulo: "Design inclusivo",
      texto: `Nosso projeto nasceu pensando em acessibilidade real:
  • Navegação simples;
  • Textos claros;
  • Sem sobrecarga visual;
  • Cores suaves;
  • Previsibilidade em todas as etapas
Isso não é apenas design — é permitir que pessoas autistas naveguem com segurança, sem surpresas desconfortáveis.`
    },
    {
      titulo: "O Impacto na Rotina de Pais e Responsáveis",
      texto: `Cuidar de alguém no espectro é uma experiência intensa, cheia de amor, desafios, dúvidas e descobertas. A literatura deixa claro que a rotina familiar pode ser exigente emocionalmente, 
      e pequenos apoios fazem muita diferença.
Por isso prezamos por:
    • Informações claras,
    • Orientações práticas,
    • Linguagem acessível,
    • Produtos úteis e seguros,
    • Compra descomplicada e transparente`
    },
    {
      titulo: "Autonomia, segurança e ética",
      texto: `Para nós, tudo precisa estar alinhado com dois princípios:
    Respeito à individualidade.
    
    Responsabilidade com informação e segurança.

Por isso:
    • Não fazemos promessas terapêuticas.
    • Não vendemos nada sem indicar uso adequado.
    • Não coletamos dados além do necessário.
    • Seguimos diretrizes de privacidade (LGPD).

A pessoa autista — criança, jovem ou adulta — sempre vem em primeiro lugar.`
    },
    {
      titulo: "Como transformamos tudo em prática",
      texto: `A Spectrum Store nasce unindo acolhimento + ciência + funcionalidade, oferecendo:
    • Produtos selecionados por profissionais;
    • Categorias pensadas em perfis sensoriais;
    • Informações acessíveis;
    • Uso responsável e orientado;
    • Espaço de apoio, não de julgamento;
    • Ambiente seguro e humano.`
    },
    {
      titulo: "Para quem é a Spectrum Store?",
      texto: `Para você que é autista e quer conforto, autonomia e respeito.
      Para você que é mãe, pai ou responsável e procura apoio confiável.
      Para você, profissional, que precisa de recursos para trabalhar, ensinar ou cuidar.

      Aqui, todos têm lugar.`
    }
  ];

  return (
    <div className="div-principal-info">
      <Navbar/>

      <div className="div-fundo-b-container">
        <img className="foto-fundo-b" src="Fundo-brinquedos.png" alt="Brinquedos educativos" />
        <h2 className="titulo-um">Guia de Apoio,</h2>
        <h2 className="titulo-dois">Informação e Inclusão</h2>
      </div>

      <div className="infos-container">
        {infos.map((item, index) => (
          <div key={index} className="info-box">
            <div className="info-header" onClick={() => toggle(index)}>
              <img
                src="setainformacoes.png"
                className={`seta-icone ${openIndex === index ? "aberta" : ""}`}
              />
              <h3>{item.titulo}</h3>
            </div>

            {openIndex === index && (
              <p className="info-text">{item.texto}</p>
            )}

            <div className="linha"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TelaInfo;
