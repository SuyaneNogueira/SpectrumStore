// =========================================================
// 🔹 FUNÇÕES DE AJUDA
// =========================================================

function getOrDefault(map, key, defaultValue) {
 const effectiveKey = Array.isArray(key) ? key[0] : key;
 if (effectiveKey === null || typeof effectiveKey === "undefined") {
  return defaultValue;
 }
 const value = map[effectiveKey];
 return typeof value === "undefined" ? defaultValue : value;
}

function traduzirExtrasParaPadroes(mapa, selecoesExtras) {
 const padroes = { padrao1: "0", padrao2: "0", padrao3: "0" };
 if (!Array.isArray(selecoesExtras)) {
  return padroes;
 }
 if (selecoesExtras[0]) {
  padroes.padrao1 = getOrDefault(mapa, selecoesExtras[0], "0");
 }
 if (selecoesExtras[1]) {
  padroes.padrao2 = getOrDefault(mapa, selecoesExtras[1], "0");
 }
 if (selecoesExtras[2]) {
  padroes.padrao3 = getOrDefault(mapa, selecoesExtras[2], "0");
 }
 return padroes;
}

// =========================================================
// 🔹 PADRÕES DA MÁQUINA
// =========================================================
const DEFAULT_BLOCO_VAZIO = {
 cor: 1, lamina1: 0, padrao1: "0",
 lamina2: 0, padrao2: "0", lamina3: 0, padrao3: "0"
};

// =========================================================
// 👇👇👇 "CURA" 1: A "Caixa de Andares" (A Exceção) 👇👇👇
// =========================================================
const MAPA_CAIXA_SKU_FRONTEND = "CAIXA_ANDARES";
const MAPA_CAIXA_SKU_MAQUINA = "CAIXA-01";
const MAPA_CAIXA_PRODUTO = { "caixa de um andar": 1, "caixa de dois andares": 2, "caixa de três andares": 3 };
const MAPA_CAIXA_CHASSI = { "preto": 1, "vermelho": 2, "azul": 3 };
const MAPA_CAIXA_PALETA_COR = { "null": 0, "vermelho": 1, "azul": 2, "amarelo": 3, "verde": 4, "preto": 5, "branco": 6 };
const MAPA_CAIXA_PALETA_DESENHO = { "null": "0", "casa": "1", "barco": "2", "estrela": "3" };

function traduzirCaixaAndares(customs) {
  console.log("Traduzindo CAIXA_ANDARES (Lógica 1-para-1)...");
  const traduzirAndar = (andarData) => {
    if (!andarData) { return DEFAULT_BLOCO_VAZIO; } 
    return {
      "cor":   getOrDefault(MAPA_CAIXA_CHASSI, customs.corChassi, 1),
      "lamina1": getOrDefault(MAPA_CAIXA_PALETA_COR, andarData.corPaletaEsquerda, 0),
      "padrao1": getOrDefault(MAPA_CAIXA_PALETA_DESENHO, andarData.desenhoPaletaEsquerda, "0"),
      "lamina2": getOrDefault(MAPA_CAIXA_PALETA_COR, andarData.corPaletaFrontal, 0),
      "padrao2": getOrDefault(MAPA_CAIXA_PALETA_DESENHO, andarData.desenhoPaletaFrontal, "0"),
      "lamina3": getOrDefault(MAPA_CAIXA_PALETA_COR, andarData.corPaletaDireita, 0),
      "padrao3": getOrDefault(MAPA_CAIXA_PALETA_DESENHO, andarData.desenhoPaletaDireita, "0")
    };
  };
  const objetoCaixa = {
    codigoProduto: getOrDefault(MAPA_CAIXA_PRODUTO, customs.produtoEscolhido, 1),
    bloco1: traduzirAndar(customs.andar1),
    bloco2: traduzirAndar(customs.andar2),
    bloco3: traduzirAndar(customs.andar3)
  };
  return { objetoCaixa, skuMaquina: MAPA_CAIXA_SKU_MAQUINA };
}
// 👆👆👆 FIM DA "CURA" 1 👆👆👆
// =========================================================

// =========================================================
// CATEGORIA 1: Brinquedos Sensoriais
// =========================================================
const MAPA_BS_PRESSAO = { "Muito macio": 1, "Macio": 2, "Médio": 3, "Rígido": 4 };
const MAPA_BS_TAMANHO = { "Pequeno (5cm)": 1, "Médio (10cm)": 2, "Grande (15cm)": 3 };
const MAPA_BS_TEXTURA = { "Áspero": 1, "Liso": 2, "Ondulado": 3, "Escamoso": 4, "Pontilhado": 5, "Acolchoado": 6 };
const MAPA_BS_DETALHES = { "Com sinos": "1", "Com espelhos": "2", "Com glitter": "3", "Com luzes": "4", "Com alça": "5", "Com velcro": "6" };

function traduzirBrinquedosSensoriais(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_BS_PRESSAO, customs.nivelPressao, 1),
      lamina1: getOrDefault(MAPA_BS_TAMANHO, customs.tamanho, 0),
      lamina2: getOrDefault(MAPA_BS_TEXTURA, customs.textura, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.detalhesAdicionais && customs.detalhesAdicionais.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_BS_DETALHES, customs.detalhesAdicionais)
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "KIT-01" };
}

// =========================================================
// CATEGORIA 2: Brinquedos Educativos e Pedagógicos
// =========================================================
const MAPA_BEP_DIFICULDADE = { "Fácil (até 10 peças)": 1, "Médio (11 a 20 peças)": 2, "Difícil (21 a 50 peças)": 3 };
const MAPA_BEP_MATERIAL = { "EVA": 1, "Madeira": 2, "Plástico": 3 };
const MAPA_BEP_FONTE = { "Bastão simples": 1, "Cursiva": 2, "Fonte adaptada para dislexia": 3, "Fonte grande": 4 };
const MAPA_BEP_TEMA = { "Animais": "1", "Natureza": "2", "Veículos": "3", "Formas geométricas": "4", "Personagens": "5", "Objetos do dia a dia": "6" };

function traduzirBrinquedosEducativosEPedagogicos(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_BEP_DIFICULDADE, customs.nivelDificuldade, 1),
      lamina1: getOrDefault(MAPA_BEP_MATERIAL, customs.material, 0),
      lamina2: getOrDefault(MAPA_BEP_FONTE, customs.fonteDasLetras, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.temaVisual && customs.temaVisual.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_BEP_TEMA, customs.temaVisual)
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "EDU-01" };
}

// =========================================================
// CATEGORIA 3: Rotina e Organização
// =========================================================
const MAPA_RO_FIXACAO = { "Ímã": 1, "Velcro": 2, "Cartolina rígida": 3 };
const MAPA_RO_TAMANHO = { "Pequeno (30x40cm)": 1, "Médio (50x70cm)": 2, "Grande (80x100cm)": 3 };
const MAPA_RO_ESTILO = { "Fotos reais": 1, "Pictogramas": 2, "Desenhos lúdicos": 3 };
const MAPA_RO_EXTRAS = { "Com ícones personalizáveis": "1", "Com relógio integrado": "2", "Com espaço para anotações": "3", "Com figuras móveis": "4", "Com luzes indicativas": "5", "Com sons": "6" };

function traduzirRotinaEOrganizacao(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_RO_FIXACAO, customs.tipoFixacao, 1),
      lamina1: getOrDefault(MAPA_RO_TAMANHO, customs.tamanho, 0),
      lamina2: getOrDefault(MAPA_RO_ESTILO, customs.estiloImagem, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.extras && customs.extras.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_RO_EXTRAS, customs.extras),
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO,
  };
  return { objetoCaixa, skuMaquina: "ROT-01" };
}

// =========================================================
// CATEGORIA 4: Moda e Acessórios Sensoriais
// =========================================================
const MAPA_MODA_COR = { "Branco": 1, "Azul": 2, "Preto": 3, "Verde": 4, "Roxo": 5, "Amarelo": 6 };
const MAPA_MODA_TECIDO = { "Algodão": 1, "Dry fit": 2, "Lycra": 3, "Plush": 4, "Viscose": 5, "Malha fria": 6 };
const MAPA_MODA_TAMANHO = { "PP": 1, "P": 2, "M": 3, "G": 4, "GG": 5, "XG": 6 };
const MAPA_MODA_EXTRAS = { "Com etiquetas removíveis": "1", "Costura suave": "2", "Sem etiquetas internas": "3", "Com reforço interno": "4", "Com bolsos": "5", "Com QR code de identificação": "6" };

function traduzirModaEAcessoriosSensoriais(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_MODA_COR, customs.corPrincipal, 1),
      lamina1: getOrDefault(MAPA_MODA_TECIDO, customs.tipoTecido, 0),
      lamina2: getOrDefault(MAPA_MODA_TAMANHO, customs.tamanho, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.extras && customs.extras.length > 0) ? 1 : 0, 
      ...traduzirExtrasParaPadroes(MAPA_MODA_EXTRAS, customs.extras),
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "MODA-01" };
}

// =========================================================
// CATEGORIA 5: Ambiente e Relaxamento
// =========================================================
const MAPA_AR_TAMANHO = { "Pequena (1 criança)": 1, "Média (2 crianças)": 2, "Grande (3+ crianças)": 3 };
const MAPA_AR_MATERIAL = { "Algodão": 1, "Poliéster": 2, "Plush": 3 };
const MAPA_AR_FORMATO = { "Pirâmide": 1, "Casinha": 2, "Circular": 3, "Triangular": 4, "Tipi": 5, "Túnel": 6 };
const MAPA_AR_EXTRAS = { "Com luzes LED": "1", "Com janelas": "2", "Com cortinas blackout": "3", "Com bolso interno": "4", "Com piso acolchoado": "5", "Com entrada dupla": "6" };

function traduzirAmbienteERelaxamento(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_AR_TAMANHO, customs.tamanho, 1),
      lamina1: getOrDefault(MAPA_AR_MATERIAL, customs.material, 0),
      lamina2: getOrDefault(MAPA_AR_FORMATO, customs.formato, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.extras && customs.extras.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_AR_EXTRAS, customs.extras),
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "AMB-01" };
}

// =========================================================
// CATEGORIA 6: Jogos Cognitivos e Educacionais
// =========================================================
const MAPA_JCE_PARES = { "10": 1, "15": 2, "20": 3 };
const MAPA_JCE_MATERIAL = { "Cartão rígido": 1, "Plástico": 2, "Madeira": 3 };
const MAPA_JCE_TEMA = { "Animais": 1, "Frutas": 2, "Profissões": 3, "Objetos": 4, "Natureza": 5, "Transportes": 6 };
const MAPA_JCE_EXTRAS = { "Com braille": "1", "Com textura": "2", "Com QR code sonoro": "3", "Com borda reforçada": "4", "Com figuras ampliadas": "5", "Com aroma suave": "6" };

function traduzirJogosCognitivosEEducacionais(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_JCE_PARES, customs.quantidadePares, 1),
      lamina1: getOrDefault(MAPA_JCE_MATERIAL, customs.material, 0),
      lamina2: getOrDefault(MAPA_JCE_TEMA, customs.tema, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.extras && customs.extras.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_JCE_EXTRAS, customs.extras),
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "JOGO-01" };
}

// =========================================================
// CATEGORIA 7: Materiais Escolares Adaptados
// =========================================================
const MAPA_MEA_TAMANHO = { "A5": 1, "A4": 2, "Ofício": 3 };
const MAPA_MEA_MATCAPA = { "Plástico": 1, "Papelão rígido": 2, "Capa dura laminada": 3 };
const MAPA_MEA_PAUTA = { "Linha simples": 1, "Dupla linha": 2, "Quadriculado": 3, "Pontilhado": 4, "Guia de cores": 5, "Com margem destacada": 6 };
const MAPA_MEA_EXTRAS = { "Com espiral": "1", "Com divisórias": "2", "Com régua acoplada": "3", "Com bolsa interna": "4", "Com pauta dupla face": "5", "Com marcador de página": "6" };

function traduzirMateriaisEscolaresAdaptados(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_MEA_TAMANHO, customs.tamanho, 1),
      lamina1: getOrDefault(MAPA_MEA_MATCAPA, customs.materialCapa, 0),
      lamina2: getOrDefault(MAPA_MEA_PAUTA, customs.tipoPauta, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.extras && customs.extras.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_MEA_EXTRAS, customs.extras),
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "ESC-01" };
}

// =========================================================
// CATEGORIA 8: Cuidados e Rotina Pessoal
// =========================================================
const MAPA_CRP_TEMPO = { "1 minuto": 1, "2 minutos": 2, "3 minutos": 3 };
const MAPA_CRP_ENERGIA = { "Manual": 1, "Pilhas": 2, "Recarregável": 3 };
const MAPA_CRP_CERDAS = { "Macias": 1, "Médias": 2, "Extra macias": 3, "Duplas": 4, "Onduladas": 5, "Sensíveis": 6 };
const MAPA_CRP_EXTRAS = { "Com luz LED": "1", "Com música": "2", "Com cabo antiderrapante": "3", "Com base de apoio": "4", "Com capa protetora": "5", "Com indicadores de troca": "6" };

function traduzirCuidadosERotinaPessoal(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_CRP_TEMPO, customs.tempoTemporizador, 1),
      lamina1: getOrDefault(MAPA_CRP_ENERGIA, customs.tipoEnergia, 0),
      lamina2: getOrDefault(MAPA_CRP_CERDAS, customs.tipoCerdas, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.extras && customs.extras.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_CRP_EXTRAS, customs.extras),
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "CUID-01" };
}

// =========================================================
// CATEGORIA 9: Comunicação Alternativa (CAA)
// =========================================================
const MAPA_CAA_TAMANHO = { "Pequeno": 1, "Médio": 2, "Grande": 3 };
const MAPA_CAA_MATERIAL = { "Plástico": 1, "Cartão laminado": 2, "PVC": 3 };
const MAPA_CAA_SIMBOLO = { "Pictograma": 1, "Imagem real": 2, "Desenho infantil": 3, "Escrita simples": 4, "Braille": 5, "Misto": 6 };
const MAPA_CAA_EXTRAS = { "Com velcro": "1", "Com código QR sonoro": "2", "Com textura": "3", "Com borda reforçada": "4", "Com figuras em alto contraste": "5", "Com legenda personalizada": "6" };

function traduzirComunicacaoAlternativa(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_CAA_TAMANHO, customs.tamanhoCartao, 1),
      lamina1: getOrDefault(MAPA_CAA_MATERIAL, customs.material, 0),
      lamina2: getOrDefault(MAPA_CAA_SIMBOLO, customs.tipoSimbolo, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.extras && customs.extras.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_CAA_EXTRAS, customs.extras),
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "CAA-01" };
}

// =========================================================
// CATEGORIA 10: Material Ponderado
// =========================================================
const MAPA_MP_PESO = { "1kg": 1, "2kg": 2, "3kg": 3 };
const MAPA_MP_TECIDO = { "Algodão": 1, "Veludo": 2, "Malha": 3 };
const MAPA_MP_DISTRIBUICAO = { "Ombros": 1, "Costas": 2, "Peito": 3, "Uniforme": 4, "Misto": 5, "Personalizado": 6 };
const MAPA_MP_EXTRAS = { "Com ajuste de velcro": "1", "Com bolsos": "2", "Com peso removível": "3", "Com reforço interno": "4", "Com estampa personalizada": "5", "Com fecho frontal": "6" };

function traduzirMaterialPonderado(customs) {
  const objetoCaixa = {
    codigoProduto: 1, 
    bloco1: {
      cor:   getOrDefault(MAPA_MP_PESO, customs.nivelPeso, 1),
      lamina1: getOrDefault(MAPA_MP_TECIDO, customs.tecido, 0),
      lamina2: getOrDefault(MAPA_MP_DISTRIBUICAO, customs.distribuicaoPeso, 0),
            // 👇👇👇 "CURA" 2: O "Interruptor Mestre" (Sua Lógica) 👇👇👇
      lamina3: (customs.extras && customs.extras.length > 0) ? 1 : 0,
      ...traduzirExtrasParaPadroes(MAPA_MP_EXTRAS, customs.extras),
    },
    bloco2: DEFAULT_BLOCO_VAZIO,
    bloco3: DEFAULT_BLOCO_VAZIO
  };
  return { objetoCaixa, skuMaquina: "PESO-01" };
}


// =========================================================
// O ROTEADOR (A "Tabela de Despacho")
// (Agora inclui todas as novas funções e mapas)
// =========================================================
const TRADUTORES_POR_SKU = {
  [MAPA_CAIXA_SKU_FRONTEND]: traduzirCaixaAndares, // Exceção mantida
  ["BrinquedosSensoriais"]: traduzirBrinquedosSensoriais,
  ["BrinquedosEducativosEPedagogicos"]:
   traduzirBrinquedosEducativosEPedagogicos,
  ["RotinaEOrganizacao"]: traduzirRotinaEOrganizacao,
  ["ModaEAcessoriosSensoriais"]: traduzirModaEAcessoriosSensoriais,
  ["AmbienteERelaxamento"]: traduzirAmbienteERelaxamento,
  ["JogosCognitivosEEducacionais"]: traduzirJogosCognitivosEEducacionais,
  ["MateriaisEscolaresAdaptados"]: traduzirMateriaisEscolaresAdaptados,
  ["CuidadosERotinaPessoal"]: traduzirCuidadosERotinaPessoal,
  ["ComunicacaoAlternativaEAumentativa(CAA)"]: traduzirComunicacaoAlternativa,
  ["MaterialPonderado"]: traduzirMaterialPonderado,
};

// =========================================================
// FUNÇÃO PÚBLICA (A que seu app.js chama)
// (Esta função não muda, ela é perfeita)
// =========================================================
function traduzirItemParaPayload(itemDoCarrinho, pedidoIdDoBanco) {
 const customs = itemDoCarrinho.customizations;
 const skuFrontend = customs ? customs.sku : null;

 if (!skuFrontend) {
  console.log(
   `Item '${itemDoCarrinho.name}' não é customizável (falta 'customizations.sku'). Pulando.`
  );
  return null;
 }

 const tradutor = TRADUTORES_POR_SKU[skuFrontend];
 if (!tradutor) {
  console.error(`Tradutor não encontrado para SKU: ${skuFrontend}.`);
  return null;
 }

 try {
  const { objetoCaixa, skuMaquina } = tradutor(customs);
  if (!objetoCaixa) {
   console.error(`Tradução falhou para SKU: ${skuFrontend}`);
   return null;
  }

  const payloadCompleto = {
   payload: {
    orderId: `SPECTRUM-PEDIDO-${pedidoIdDoBanco}`,
    caixa: objetoCaixa,
    sku: skuMaquina,
   },
   callbackUrl: "http://localhost:3333/callback",
  };

  return payloadCompleto;
 } catch (err) {
  console.error(
   `Erro crítico ao traduzir ${skuFrontend}: ${err.message}`,
   err
  );
  return null;
 }
}

// Exporta a única função que o resto da sua aplicação precisa conhecer
export { traduzirItemParaPayload };