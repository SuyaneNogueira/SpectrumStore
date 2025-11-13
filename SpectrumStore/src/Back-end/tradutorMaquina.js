
// teste e depressão

function getOrDefault(map, key, defaultValue) {
    const effectiveKey = Array.isArray(key) ? key[0] : key; // Pega o primeiro item se for array
    if (effectiveKey === null || typeof effectiveKey === 'undefined') {
        return defaultValue;
    }
    const value = map[effectiveKey];
    return (typeof value === 'undefined') ? defaultValue : value;
}

/**
 * A MÁGICA: Traduz um array de seleções em um bloco de 6 slots (lógica 0 ou 1).
 * @param {object} mapa - O mapa que diz qual opção vai em qual slot (ex: {"Áspero": "lamina1"})
 * @param {string[]} selecoesUsuario - O array de opções que o usuário marcou (ex: ["Áspero", "Liso"])
 */
function traduzirArrayParaBloco(mapa, selecoesUsuario) {
    const bloco = { lamina1: 0, lamina2: 0, lamina3: 0, padrao1: "0", padrao2: "0", padrao3: "0" };
    if (!Array.isArray(selecoesUsuario)) {
        return bloco;
    }
    for (const selecao of selecoesUsuario) {
        const slot = mapa[selecao]; 
        if (slot) {
            bloco[slot] = (slot.startsWith("padrao")) ? "1" : 1;
        }
    }
    return bloco;
}

// =========================================================
// Padrões da Máquina
// =========================================================
const DEFAULT_BLOCO_PADRAO = {
    cor: 1, lamina1: 0, padrao1: "0",
    lamina2: 0, padrao2: "0", lamina3: 0, padrao3: "0"
};

// =========================================================
// PRODUTO 0: "CAIXA DE ANDARES" (A EXCEÇÃO que foi apagada)
// =========================================================
const MAPA_CAIXA_SKU_FRONTEND = "CAIXA_ANDARES";
const MAPA_CAIXA_SKU_MAQUINA = "CAIXA-01"; // TODO: Confirme este SKU
const MAPA_CAIXA_PRODUTO = { "caixa de um andar": 1, "caixa de dois andares": 2, "caixa de três andares": 3 };
const MAPA_CAIXA_CHASSI = { "preto": 1, "vermelho": 2, "azul": 3 };
const MAPA_CAIXA_PALETA_COR = { "null": 0, "vermelho": 1, "azul": 2, "amarelo": 3, "verde": 4, "preto": 5, "branco": 6 };
const MAPA_CAIXA_PALETA_DESENHO = { "null": "0", "casa": "1", "barco": "2", "estrela": "3" };

function traduzirCaixaAndares(customs) {
    console.log("Traduzindo CAIXA_ANDARES (Lógica 1-para-1)...");
    const traduzirAndar = (andarData) => {
        if (!andarData) { return DEFAULT_BLOCO_PADRAO; }
        return {
            "cor":     getOrDefault(MAPA_CAIXA_CHASSI, customs.corChassi, 1),
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

// =========================================================
// CATEGORIA 1: Brinquedos Sensoriais
// =========================================================
const MAPA_BS_SKU_FRONTEND = "BrinquedosSensoriais";
const MAPA_BS_SKU_MAQUINA = "KIT-01";
const MAPA_BS_PRESSAO = { "Muito macio": 1, "Macio": 2, "Médio": 3, "Rígido": 4 };
const MAPA_BS_TAMANHO = { "Pequeno (5cm)": 1, "Médio (10cm)": 2, "Grande (15cm)": 3 };
const MAPA_BS_TEXTURA = { "Áspero": "lamina1", "Liso": "lamina2", "Ondulado": "lamina3", "Escamoso": "padrao1", "Pontilhado": "padrao2", "Acolchoado": "padrao3" };
const MAPA_BS_COR = { "Azul": "lamina1", "Verde": "lamina2", "Amarelo": "lamina3", "Vermelho": "padrao1", "Roxo": "padrao2", "Laranja": "padrao3" };
const MAPA_BS_DETALHES = { "Com sinos": "lamina1", "Com espelhos": "lamina2", "Com glitter": "lamina3", "Com luzes": "padrao1", "Com alça": "padrao2", "Com velcro": "padrao3" };

function traduzirBrinquedosSensoriais(customs) {
    console.log("Traduzindo BrinquedosSensoriais (Lógica Binária)...");
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO: Sempre 3 blocos (paletas)
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_BS_TEXTURA, customs.textura), // {paleta esquerda}
            cor: getOrDefault(MAPA_BS_PRESSAO, customs.nivelPressao, 1)  // {cor da caixa 1}
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_BS_COR, customs.corPrincipal), // {paleta frente}
            cor: getOrDefault(MAPA_BS_TAMANHO, customs.tamanho, 1)        // {cor da caixa 2}
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_BS_DETALHES, customs.detalhesAdicionais), // {paleta direita}
            cor: 1 // Fixo
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_BS_SKU_MAQUINA };
}

// =========================================================
// CATEGORIA 2: Brinquedos Educativos e Pedagógicos
// =========================================================
const MAPA_BEP_SKU_FRONTEND = "BrinquedosEducativosEPedagogicos";
const MAPA_BEP_SKU_MAQUINA = "EDU-01"; // TODO: CONFIRMAR SKU
const MAPA_BEP_DIFICULDADE = { "Fácil (até 10 peças)": 1, "Médio (11 a 20 peças)": 2, "Difícil (21 a 50 peças)": 3 };
const MAPA_BEP_MATERIAL = { "EVA": 1, "Madeira": 2, "Plástico": 3 };
const MAPA_BEP_FONTE = { "Bastão simples": "lamina1", "Cursiva": "lamina2", "Fonte adaptada para dislexia": "lamina3", "Fonte grande": "padrao1" };
const MAPA_BEP_CORFUND = { "Azul": "lamina1", "Amarelo": "lamina2", "Verde": "lamina3", "Vermelho": "padrao1", "Roxo": "padrao2", "Laranja": "padrao3" };
const MAPA_BEP_TEMA = { "Animais": "lamina1", "Natureza": "lamina2", "Veículos": "lamina3", "Formas geométricas": "padrao1", "Personagens": "padrao2", "Objetos do dia a dia": "padrao3" };

function traduzirBrinquedosEducativosEPedagogicos(customs) {
    console.log("Traduzindo BrinquedosEducativosEPedagogicos (Lógica Binária)...");
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO: Sempre 3 blocos (paletas)
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_BEP_FONTE, customs.fonteDasLetras),
            cor: getOrDefault(MAPA_BEP_DIFICULDADE, customs.nivelDificuldade, 1),
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_BEP_CORFUND, customs.corFundo),
            cor: getOrDefault(MAPA_BEP_MATERIAL, customs.material, 1),
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_BEP_TEMA, customs.temaVisual),
            cor: 1
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_BEP_SKU_MAQUINA };
}

// =========================================================
// CATEGORIA 3: Rotina e Organização
// =========================================================
const MAPA_RO_SKU_FRONTEND = "RotinaEOrganizacao";
const MAPA_RO_SKU_MAQUINA = "ROT-01"; // TODO: CONFIRMAR
const MAPA_RO_FIXACAO = { "Ímã": 1, "Velcro": 2, "Cartolina rígida": 3 };
const MAPA_RO_TAMANHO = { "Pequeno (30x40cm)": 1, "Médio (50x70cm)": 2, "Grande (80x100cm)": 3 };
const MAPA_RO_ESTILO = { "Fotos reais": "lamina1", "Pictogramas": "lamina2", "Desenhos lúdicos": "lamina3" };
const MAPA_RO_MOLDURA = { "Azul": "lamina1", "Branco": "lamina2", "Amarelo": "lamina3", "Verde": "padrao1", "Vermelho": "padrao2", "Roxo": "padrao3" };
const MAPA_RO_EXTRAS = { "Com ícones personalizáveis": "lamina1", "Com relógio integrado": "lamina2", "Com espaço para anotações": "lamina3", "Com figuras móveis": "padrao1", "Com luzes indicativas": "padrao2", "Com sons": "padrao3" };

function traduzirRotinaEOrganizacao(customs) {
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_RO_ESTILO, customs.estiloImagem),
            cor: getOrDefault(MAPA_RO_FIXACAO, customs.tipoFixacao, 1),
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_RO_MOLDURA, customs.corMoldura),
            cor: getOrDefault(MAPA_RO_TAMANHO, customs.tamanho, 1),
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_RO_EXTRAS, customs.extras),
            cor: 1
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_RO_SKU_MAQUINA };
}

// =========================================================
// CATEGORIA 4: Moda e Acessórios Sensoriais
// =========================================================
const MAPA_MODA_SKU_FRONTEND = "ModaEAcessoriosSensoriais";
const MAPA_MODA_SKU_MAQUINA = "MODA-01"; // TODO: CONFIRMAR
const MAPA_MODA_TAMANHO = { "PP": 1, "P": 2, "M": 3, "G": 4, "GG": 5, "XG": 6 };
const MAPA_MODA_TECIDO = { "Algodão": "lamina1", "Dry fit": "lamina2", "Lycra": "lamina3", "Plush": "padrao1", "Viscose": "padrao2", "Malha fria": "padrao3" };
const MAPA_MODA_COR = { "Branco": "lamina1", "Azul": "lamina2", "Preto": "lamina3", "Verde": "padrao1", "Roxo": "padrao2", "Amarelo": "padrao3" };
const MAPA_MODA_ESTAMPA = { "Lisa": "lamina1", "Listrada": "lamina2", "Xadrez": "lamina3", "Com desenho": "padrao1", "Com frase": "padrao2", "Customizada": "padrao3" };
const MAPA_MODA_EXTRAS = { "Com etiquetas removíveis": "lamina1", "Costura suave": "lamina2", "Sem etiquetas internas": "lamina3", "Com reforço interno": "padrao1", "Com bolsos": "padrao2", "Com QR code de identificação": "padrao3" };

function traduzirModaEAcessoriosSensoriais(customs) {
    // ATENÇÃO: CONFLITO NOS HINTS!
    // "Estampa" e "Extras" ambos pedem "paleta direita" (bloco3).
    // "Tipo Tecido" (bloco1) e "Cor" (bloco2) parecem corretos.
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_MODA_TECIDO, customs.tipoTecido), // {paleta esquerda}
            cor: getOrDefault(MAPA_MODA_TAMANHO, customs.tamanho, 1),       // {cor da caixa}
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_MODA_COR, customs.corPrincipal), // {paleta frente}
            cor: 1 // Fixo?
        },
        bloco3: {
            // SOLUÇÃO: "Estampa" usa os 3 slots de LÂMINA, "Extras" usa os 3 de PADRÃO
            ...traduzirArrayParaBloco(MAPA_MODA_ESTAMPA, customs.estampa),
            ...traduzirArrayParaBloco(MAPA_MODA_EXTRAS, customs.extras),
            cor: 1 // Fixo
        }
    };
    // A solução acima SÓ funciona se os mapas forem:
    // MAPA_MODA_ESTAMPA = { "Lisa": "lamina1", "Listrada": "lamina2", "Xadrez": "lamina3" }
    // MAPA_MODA_EXTRAS = { "Com etiquetas...": "padrao1", "Costura...": "padrao2", ... }
    // Você PRECISA confirmar este mapeamento. O meu código acima é um CHUTE.
    return { objetoCaixa, skuMaquina: MAPA_MODA_SKU_MAQUINA };
}


// =========================================================
// CATEGORIA 5: Ambiente e Relaxamento
// =========================================================
const MAPA_AR_SKU_FRONTEND = "AmbienteERelaxamento";
const MAPA_AR_SKU_MAQUINA = "AMB-01"; // TODO: CONFIRMAR
const MAPA_AR_TAMANHO = { "Pequena (1 criança)": 1, "Média (2 crianças)": 2, "Grande (3+ crianças)": 3 };
const MAPA_AR_MATERIAL = { "Algodão": 1, "Poliéster": 2, "Plush": 3 };
const MAPA_AR_FORMATO = { "Pirâmide": "lamina1", "Casinha": "lamina2", "Circular": "lamina3", "Triangular": "padrao1", "Tipi": "padrao2", "Túnel": "padrao3" };
const MAPA_AR_COR = { "Azul": "lamina1", "Branco": "lamina2", "Verde": "lamina3", "Roxo": "padrao1", "Amarelo": "padrao2", "Rosa": "padrao3" };
const MAPA_AR_EXTRAS = { "Com luzes LED": "lamina1", "Com janelas": "lamina2", "Com cortinas blackout": "lamina3", "Com bolso interno": "padrao1", "Com piso acolchoado": "padrao2", "Com entrada dupla": "padrao3" };

function traduzirAmbienteERelaxamento(customs) {
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_AR_FORMATO, customs.formato),
            cor: getOrDefault(MAPA_AR_TAMANHO, customs.tamanho, 1),
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_AR_COR, customs.corPrincipal),
            cor: getOrDefault(MAPA_AR_MATERIAL, customs.material, 1),
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_AR_EXTRAS, customs.extras),
            cor: 1
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_AR_SKU_MAQUINA };
}

// =========================================================
// CATEGORIA 6: Jogos Cognitivos e Educacionais
// =========================================================
const MAPA_JCE_SKU_FRONTEND = "JogosCognitivosEEducacionais";
const MAPA_JCE_SKU_MAQUINA = "JOGO-01"; // TODO: CONFIRMAR
const MAPA_JCE_PARES = { "10": 1, "15": 2, "20": 3 };
const MAPA_JCE_MATERIAL = { "Cartão rígido": 1, "Plástico": 2, "Madeira": 3 };
const MAPA_JCE_TEMA = { "Animais": "lamina1", "Frutas": "lamina2", "Profissões": "lamina3", "Objetos": "padrao1", "Natureza": "padrao2", "Transportes": "padrao3" };
const MAPA_JCE_CORVERSO = { "Azul": "lamina1", "Verde": "lamina2", "Roxo": "lamina3", "Amarelo": "padrao1", "Laranja": "padrao2", "Vermelho": "padrao3" };
const MAPA_JCE_EXTRAS = { "Com braille": "lamina1", "Com textura": "lamina2", "Com QR code sonoro": "lamina3", "Com borda reforçada": "padrao1", "Com figuras ampliadas": "padrao2", "Com aroma suave": "padrao3" };

function traduzirJogosCognitivosEEducacionais(customs) {
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_JCE_TEMA, customs.tema),
            cor: getOrDefault(MAPA_JCE_PARES, customs.quantidadePares, 1),
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_JCE_CORVERSO, customs.corVerso),
            cor: getOrDefault(MAPA_JCE_MATERIAL, customs.material, 1),
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_JCE_EXTRAS, customs.extras),
            cor: 1
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_JCE_SKU_MAQUINA };
}

// =========================================================
// CATEGORIA 7: Materiais Escolares Adaptados
// =========================================================
const MAPA_MEA_SKU_FRONTEND = "MateriaisEscolaresAdaptados";
const MAPA_MEA_SKU_MAQUINA = "ESC-01"; // TODO: CONFIRMAR
const MAPA_MEA_TAMANHO = { "A5": 1, "A4": 2, "Ofício": 3 };
const MAPA_MEA_MATCAPA = { "Plástico": 1, "Papelão rígido": 2, "Capa dura laminada": 3 };
const MAPA_MEA_PAUTA = { "Linha simples": "lamina1", "Dupla linha": "lamina2", "Quadriculado": "lamina3", "Pontilhado": "padrao1", "Guia de cores": "padrao2", "Com margem destacada": "padrao3" };
const MAPA_MEA_CORCAPA = { "Azul": "lamina1", "Verde": "lamina2", "Vermelho": "lamina3", "Amarelo": "padrao1", "Roxo": "padrao2", "Laranja": "padrao3" };
const MAPA_MEA_EXTRAS = { "Com espiral": "lamina1", "Com divisórias": "lamina2", "Com régua acoplada": "lamina3", "Com bolsa interna": "padrao1", "Com pauta dupla face": "padrao2", "Com marcador de página": "padrao3" };

function traduzirMateriaisEscolaresAdaptados(customs) {
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_MEA_PAUTA, customs.tipoPauta),
            cor: getOrDefault(MAPA_MEA_TAMANHO, customs.tamanho, 1),
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_MEA_CORCAPA, customs.corCapa),
            cor: getOrDefault(MAPA_MEA_MATCAPA, customs.materialCapa, 1),
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_MEA_EXTRAS, customs.extras),
            cor: 1
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_MEA_SKU_MAQUINA };
}

// =========================================================
// CATEGORIA 8: Cuidados e Rotina Pessoal
// =========================================================
const MAPA_CRP_SKU_FRONTEND = "CuidadosERotinaPessoal";
const MAPA_CRP_SKU_MAQUINA = "CUID-01"; // TODO: CONFIRMAR
const MAPA_CRP_TEMPO = { "1 minuto": 1, "2 minutos": 2, "3 minutos": 3 };
const MAPA_CRP_ENERGIA = { "Manual": 1, "Pilhas": 2, "Recarregável": 3 };
const MAPA_CRP_CERDAS = { "Macias": "lamina1", "Médias": "lamina2", "Extra macias": "lamina3", "Duplas": "padrao1", "Onduladas": "padrao2", "Sensíveis": "padrao3" };
const MAPA_CRP_COR = { "Azul": "lamina1", "Verde": "lamina2", "Rosa": "lamina3", "Amarelo": "padrao1", "Roxo": "padrao2", "Laranja": "padrao3" };
const MAPA_CRP_EXTRAS = { "Com luz LED": "lamina1", "Com música": "lamina2", "Com cabo antiderrapante": "lamina3", "Com base de apoio": "padrao1", "Com capa protetora": "padrao2", "Com indicadores de troca": "padrao3" };

function traduzirCuidadosERotinaPessoal(customs) {
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_CRP_CERDAS, customs.tipoCerdas),
            cor: getOrDefault(MAPA_CRP_TEMPO, customs.tempoTemporizador, 1),
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_CRP_COR, customs.cor),
            cor: getOrDefault(MAPA_CRP_ENERGIA, customs.tipoEnergia, 1),
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_CRP_EXTRAS, customs.extras),
            cor: 1
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_CRP_SKU_MAQUINA };
}

// =========================================================
// CATEGORIA 9: Comunicação Alternativa (CAA)
// =========================================================
const MAPA_CAA_SKU_FRONTEND = "ComunicacaoAlternativaEAumentativa(CAA)";
const MAPA_CAA_SKU_MAQUINA = "CAA-01"; // TODO: CONFIRMAR
const MAPA_CAA_TAMANHO = { "Pequeno": 1, "Médio": 2, "Grande": 3 };
const MAPA_CAA_MATERIAL = { "Plástico": 1, "Cartão laminado": 2, "PVC": 3 };
const MAPA_CAA_SIMBOLO = { "Pictograma": "lamina1", "Imagem real": "lamina2", "Desenho infantil": "lamina3", "Escrita simples": "padrao1", "Braille": "padrao2", "Misto": "padrao3" };
const MAPA_CAA_CORFUND = { "Branco": "lamina1", "Amarelo": "lamina2", "Azul": "lamina3", "Verde": "padrao1", "Roxo": "padrao2", "Laranja": "padrao3" };
const MAPA_CAA_EXTRAS = { "Com velcro": "lamina1", "Com código QR sonoro": "lamina2", "Com textura": "lamina3", "Com borda reforçada": "padrao1", "Com figuras em alto contraste": "padrao2", "Com legenda personalizada": "padrao3" };

function traduzirComunicacaoAlternativa(customs) {
    const objetoCaixa = {
        codigoProduto: 3, // CORRIGIDO
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_CAA_SIMBOLO, customs.tipoSimbolo),
            cor: getOrDefault(MAPA_CAA_TAMANHO, customs.tamanhoCartao, 1),
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_CAA_CORFUND, customs.corFundo),
            cor: getOrDefault(MAPA_CAA_MATERIAL, customs.material, 1),
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_CAA_EXTRAS, customs.extras),
            cor: 1
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_CAA_SKU_MAQUINA };
}

// =========================================================
// CATEGORIA 10: Material Ponderado
// =========================================================
const MAPA_MP_SKU_FRONTEND = "MaterialPonderado";
const MAPA_MP_SKU_MAQUINA = "PESO-01"; // TODO: CONFIRMAR
const MAPA_MP_PESO = { "1kg": 1, "2kg": 2, "3kg": 3 };
const MAPA_MP_TECIDO = { "Algodão": 1, "Veludo": 2, "Malha": 3 };
const MAPA_MP_DISTRIBUICAO = { "Ombros": "lamina1", "Costas": "lamina2", "Peito": "lamina3", "Uniforme": "padrao1", "Misto": "padrao2", "Personalizado": "padrao3" };
const MAPA_MP_COR = { "Azul": "lamina1", "Preto": "lamina2", "Cinza": "lamina3", "Verde": "padrao1", "Roxo": "padrao2", "Vermelho": "padrao3" };
const MAPA_MP_EXTRAS = { "Com ajuste de velcro": "lamina1", "Com bolsos": "lamina2", "Com peso removível": "lamina3", "Com reforço interno": "padrao1", "Com estampa personalizada": "padrao2", "Com fecho frontal": "padrao3" };

function traduzirMaterialPonderado(customs) {
    const objetoCaixa = {
        codigoProduto: 1, // CORRIGIDO
        bloco1: {
            ...traduzirArrayParaBloco(MAPA_MP_DISTRIBUICAO, customs.distribuicaoPeso),
            cor: getOrDefault(MAPA_MP_PESO, customs.nivelPeso, 1),
        },
        bloco2: {
            ...traduzirArrayParaBloco(MAPA_MP_COR, customs.corPrincipal),
            cor: getOrDefault(MAPA_MP_TECIDO, customs.tecido, 1),
        },
        bloco3: {
            ...traduzirArrayParaBloco(MAPA_MP_EXTRAS, customs.extras),
            cor: 1
        }
    };
    return { objetoCaixa, skuMaquina: MAPA_MP_SKU_MAQUINA };
}


// =========================================================
// O ROTEADOR (A "Tabela de Despacho")
// =========================================================
const TRADUTORES_POR_SKU = {
    [MAPA_CAIXA_SKU_FRONTEND]: traduzirCaixaAndares,
    [MAPA_BS_SKU_FRONTEND]: traduzirBrinquedosSensoriais,
    [MAPA_BEP_SKU_FRONTEND]: traduzirBrinquedosEducativosEPedagogicos,
    [MAPA_RO_SKU_FRONTEND]: traduzirRotinaEOrganizacao,
    [MAPA_MODA_SKU_FRONTEND]: traduzirModaEAcessoriosSensoriais,
    [MAPA_AR_SKU_FRONTEND]: traduzirAmbienteERelaxamento,
    [MAPA_JCE_SKU_FRONTEND]: traduzirJogosCognitivosEEducacionais,
    [MAPA_MEA_SKU_FRONTEND]: traduzirMateriaisEscolaresAdaptados,
    [MAPA_CRP_SKU_FRONTEND]: traduzirCuidadosERotinaPessoal,
    [MAPA_CAA_SKU_FRONTEND]: traduzirComunicacaoAlternativa,
    [MAPA_MP_SKU_FRONTEND]: traduzirMaterialPonderado,
};

// =========================================================
// FUNÇÃO PÚBLICA (A que seu app.js chama)
// =========================================================
function traduzirItemParaPayload(itemDoCarrinho, pedidoIdDoBanco) {
    const customs = itemDoCarrinho.customizations;
    const skuFrontend = customs ? customs.sku : null;

    if (!skuFrontend) {
        console.log(`Item '${itemDoCarrinho.name}' não é customizável (falta 'customizations.sku'). Pulando.`);
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
            "payload": {
                "orderId": `SPECTRUM-PEDIDO-${pedidoIdDoBanco}`,
                "caixa": objetoCaixa,
                "sku": skuMaquina
            },
            "callbackUrl": "http://localhost:3333/callback" 
        };
        return payloadCompleto;

    } catch (err) {
        console.error(`Erro crítico ao traduzir ${skuFrontend}: ${err.message}`, err);
        return null;
    }
}

// Exporta a única função que o resto da sua aplicação precisa conhecer
export { traduzirItemParaPayload };