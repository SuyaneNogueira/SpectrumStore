// =========================================================
// MAPAS GERAIS (Podem ser usados por vários produtos)
// =========================================================
const MAPA_COR_LAMINA = { "sem lâmina": 0, "Vermelho": 1, "Azul": 2, "Amarelo": 3, "Verde": 4, "Preto": 5, "Branco": 6 };
const MAPA_PADRAO = { "sem desenho": "0", "casa": "1", "barco": "2", "estrela": "3" };

// =========================================================
// MAPAS PRODUTO 1: "CAIXA DE ANDARES"
// =========================================================
const MAPA_CAIXA_SKU_FRONTEND = "CAIXA_ANDARES"; // O que o frontend envia
const MAPA_CAIXA_SKU_MAQUINA = "CAIXA-01"; // O que a máquina recebe
const MAPA_CAIXA_PRODUTO = { "caixa de um andar": 1, "caixa de dois andares": 2, "caixa de três andares": 3 };
const MAPA_CAIXA_CHASSI = { "Preto": 1, "Vermelho": 2, "Azul": 3 };

// =========================================================
// MAPAS PRODUTO 2: "CUBO SENSORIAL"
// =========================================================
const MAPA_CUBO_SKU_FRONTEND = "CUBO_SENSORIAL"; // O que o frontend envia
const MAPA_CUBO_SKU_MAQUINA = "KIT-01"; // O que a máquina recebe
const MAPA_CUBO_CODIGO_PRODUTO = 2; // Código fixo para Cubo

// Bloco 1 (Paleta Esquerda)
const MAPA_CUBO_TEXTURA = { "Áspero": 1, "Liso": 2, "Ondulado": 3, "Escamoso": 4, "Pontilhado": 5, "Acolchoado": 6 };
const MAPA_CUBO_PRESSAO = { "Muito macio": 1, "Macio": 2, "Médio": 3, "Rígido": 4 };
// Bloco 2 (Paleta Frente)
const MAPA_CUBO_COR = { "Azul": 1, "Verde": 2, "Amarelo": 3, "Vermelho": 4, "Roxo": 5, "Laranja": 6 };
const MAPA_CUBO_TAMANHO = { "Pequeno (5cm)": 1, "Médio (10cm)": 2, "Grande (15cm)": 3 };
// Bloco 3 (Paleta Direita)
const MAPA_CUBO_DETALHES = { "Com sinos": 1, "Com espelhos": 2, "Com glitter": 3, "Com luzes": 4, "Com alça": 5, "Com velcro": 6 };

// =========================================================
// FUNÇÃO PRIVADA 1: Tradutor da Caixa de Andares
// =========================================================
function traduzirCaixaAndares(customs) {
    // Função interna para traduzir um andar (bloco)
    const traduzirAndar = (andarData) => {
        if (!andarData) { // Se o andar não existir (ex: andar 2 em caixa de 1)
            return { "cor": 1, "lamina1": 0, "padrao1": "0", "lamina2": 0, "padrao2": "0", "lamina3": 0, "padrao3": "0" };
        }
        return {
            "cor": MAPA_CAIXA_CHASSI[andarData.corChassi] || 1, // Padrão 'Preto'
            "lamina1": MAPA_CAIXA_LAMINA[andarData.corLamina1] || 0, // Padrão 'sem lâmina'
            "padrao1": MAPA_CAIXA_PADRAO[andarData.padraoLamina1] || "0", // Padrão 'sem desenho'
            "lamina2": MAPA_CAIXA_LAMINA[andarData.corLamina2] || 0,
            "padrao2": MAPA_CAIXA_PADRAO[andarData.padraoLamina2] || "0",
            "lamina3": MAPA_CAIXA_LAMINA[andarData.corLamina3] || 0,
            "padrao3": MAPA_CAIXA_PADRAO[andarData.padraoLamina3] || "0"
        };
    };

    return {
        codigoProduto: MAPA_CAIXA_PRODUTO[customs.produtoEscolhido] || 1,
        bloco1: traduzirAndar(customs.andar1),
        bloco2: traduzirAndar(customs.andar2),
        bloco3: traduzirAndar(customs.andar3)
    };
}

// =========================================================
// FUNÇÃO PRIVADA 2: Tradutor do Cubo Sensorial
// =========================================================
function traduzirCuboSensorial(customs) {
    // customs é o objeto de personalização do frontend
    // ex: { sku: "...", textura: "Áspero", nivel_pressao: "Macio", ... }

    const bloco1 = { // Paleta Esquerda
        "cor": MAPA_CUBO_PRESSAO[customs.nivel_pressao] || 1, // Padrão 'Muito macio'
        "lamina1": MAPA_CUBO_TEXTURA[customs.textura] || 1, // Padrão 'Áspero'
        "lamina2": 0, "padrao2": "0", // Não usados
        "lamina3": 0, "padrao3": "0", // Não usados
        "padrao1": "0" // Não usado
    };

    const bloco2 = { // Paleta Frente
        "cor": MAPA_CUBO_TAMANHO[customs.tamanho] || 1, // Padrão 'Pequeno'
        "lamina1": MAPA_CUBO_COR[customs.cor_principal] || 1, // Padrão 'Azul'
        "lamina2": 0, "padrao2": "0",
        "lamina3": 0, "padrao3": "0",
        "padrao1": "0"
    };
    
    const bloco3 = { // Paleta Direita
        "cor": 1, // Fixo 1 (Padrão)
        "lamina1": MAPA_CUBO_DETALHES[customs.detalhes] || 1, // Padrão 'Com sinos'
        "lamina2": 0, "padrao2": "0",
        "lamina3": 0, "padrao3": "0",
        "padrao1": "0"
    };

    return {
        codigoProduto: MAPA_CUBO_CODIGO_PRODUTO, // Código fixo
        bloco1: bloco1,
        bloco2: bloco2,
        bloco3: bloco3
    };
}

// =========================================================
// FUNÇÃO PÚBLICA / ROTEADOR (A que você chama)
// =========================================================
/**
 * Traduz um item do carrinho para o payload COMPLETO da máquina.
 * @param {object} itemDoCarrinho - O item vindo do frontend.
 * @param {string} pedidoIdDoBanco - O ID do pedido (ex: 1, 2, 3) que salvamos no nosso banco.
 * @returns {object | null} O payload COMPLETO para a máquina, ou null se não for traduzível.
 */
function traduzirItemParaPayload(itemDoCarrinho, pedidoIdDoBanco) {
    const customs = itemDoCarrinho.customizations;
    
    // Como você disse que a personalização é obrigatória, 'customs' sempre deve existir.
    // Mas checamos por segurança.
    if (!customs || !customs.sku) {
        console.log(`Item '${itemDoCarrinho.name}' não é customizável (falta 'customizations.sku'). Pulando.`);
        return null;
    }

    let objetoCaixa;
    let skuMaquina;

    // --- O ROTEADOR ---
    if (customs.sku === MAPA_CAIXA_SKU_FRONTEND) {
        objetoCaixa = traduzirCaixaAndares(customs);
        skuMaquina = MAPA_CAIXA_SKU_MAQUINA;
    } 
    else if (customs.sku === MAPA_CUBO_SKU_FRONTEND) {
        objetoCaixa = traduzirCuboSensorial(customs);
        skuMaquina = MAPA_CUBO_SKU_MAQUINA;
    } 
    else {
        console.error(`SKU desconhecido no tradutor: ${customs.sku}`);
        return null;
    }

    // --- MONTAGEM DO PAYLOAD FINAL ---
    const payloadCompleto = {
        "payload": {
            "orderId": `PEDIDO-${pedidoIdDoBanco}`, // Converte o ID numérico (ex: 42) para string (ex: "PEDIDO-42")
            "caixa": objetoCaixa,
            "sku": skuMaquina
        },
        // ATENÇÃO: Troque "http://SEU_IP_PUBLICO" pelo seu IP real ou URL do Ngrok
        "callbackUrl": "http://SEU_IP_PUBLICO/api/maquina-callback" 
    };

    return payloadCompleto;
}

// Exporta a única função que o resto da sua aplicação precisa conhecer
module.exports = {
    traduzirItemParaPayload 
};