// IMPORTS DAS IMAGENS
import CadernoBrochura from "../imagens/CadernoBrochura.webp";
import CamisaCompressao from "../imagens/CamisaCompressao.webp";
import EscovaEletrica from "../imagens/EscovaEletrica.webp";
import FidgetToy from "../imagens/FidgetToy.webp";
import JogoMemoria from "../imagens/JogoMemoria.jpg";
import KitJogoPareamento from "../imagens/KitJogoPareamento.webp";
import LivroComunicacao from "../imagens/LivroComunicacao.jpg";
import LuminariaProjetor from "../imagens/LuminariaProjetor.avif";
import MantaPonderada from "../imagens/MantaPonderada.webp";
import QuadroRotinaD from "../imagens/QuadroRotinaD.webp";
import QuebraCabecaV from "../imagens/QuebraCabecaV.png";

const gambiSpectrum = [
  {
    id: 1,
    nome: "Caderno Brochura",
    valor: 12.5,
    imagem: CadernoBrochura,
    descricao:
      "Caderno brochura simples com capa lisa. Ideal para anotações e desenhos, de fácil manuseio.",
    rating: 4.0,
    categoria: "MateriaisEscolaresAdaptados",
  },
  {
    id: 2,
    nome: "Camisa de Compressão",
    valor: 79.9,
    imagem: CamisaCompressao,
    descricao:
      "Camisa de compressão sensorial, oferece feedback tátil profundo, ajudando a regular e acalmar.",
    rating: 4.8,
    categoria: "ModaEAcessoriosSensoriais",
  },
  {
    id: 3,
    nome: "Escova de Dentes Elétrica",
    valor: 55.0,
    imagem: EscovaEletrica,
    descricao:
      "Escova de dentes elétrica com vibração suave, indicada para sensibilidade oral.",
    rating: 3.9,
    categoria: "CuidadosERotinaPessoal",
  },
  {
    id: 4,
    nome: "Fidget Toy Pop-It",
    valor: 25.0,
    imagem: FidgetToy,
    descricao: "Brinquedo sensorial Pop-It para alívio do estresse e foco.",
    rating: 4.5,
    categoria: "BrinquedosSensoriais",
  },
  {
    id: 5,
    nome: "Jogo da Memória",
    valor: 35.0,
    imagem: JogoMemoria,
    descricao:
      "Jogo clássico da memória que estimula concentração e raciocínio.",
    rating: 4.2,
    categoria: "JogosCognitivosEEducacionais",
  },
  {
    id: 6,
    nome: "Kit Jogo de Pareamento",
    valor: 45.9,
    imagem: KitJogoPareamento,
    descricao: "Kit com cartões para atividades de pareamento.",
    rating: 4.7,
    categoria: "BrinquedosEducativosEPedagogicos",
  },
  {
    id: 7,
    nome: "Livro de Comunicação Visual",
    valor: 65.0,
    imagem: LivroComunicacao,
    descricao: "Livro/Álbum de comunicação alternativa (PECS).",
    rating: 5.0,
    categoria: "ComunicacaoAlternativaEAumentativaCAA",
  },
  {
    id: 8,
    nome: "Luminária Projetora",
    valor: 89.99,
    imagem: LuminariaProjetor,
    descricao: "Luminária que projeta estrelas para ambiente relaxante.",
    rating: 4.6,
    categoria: "AmbienteERelaxamento",
  },
  {
    id: 9,
    nome: "Manta Ponderada",
    valor: 249.0,
    imagem: MantaPonderada,
    descricao:
      "Manta com peso terapêutico para proporcionar calma.",
    rating: 4.9,
    categoria: "MaterialPonderado",
  },
  {
    id: 10,
    nome: "Quadro de Rotina Diária",
    valor: 49.9,
    imagem: QuadroRotinaD,
    descricao:
      "Quadro visual magnético para ajudar na rotina diária.",
    rating: 4.7,
    categoria: "RotinaEOrganizacao",
  },
  {
    id: 11,
    nome: "Quebra-Cabeça de Madeira",
    valor: 38.0,
    imagem: QuebraCabecaV,
    descricao:
      "Quebra-cabeça de madeira para desenvolver foco e motricidade.",
    rating: 4.3,
    categoria: "BrinquedosEducativosEPedagogicos",
  },
];

export default gambiSpectrum;
