
// teste e depressão

/**
 * Traduz as customizações de UM item do carrinho para o formato da máquina.
 * @param {object} itemDoCarrinho - O item vindo do frontend, DEVE conter uma chave 'customizations'.
 * @returns {object | null} O objeto 'caixa' para a máquina, ou null se não for customizável.
 */
function traduzirItemParaCaixa(itemDoCarrinho) {
    
    // 1. Verifica se o item tem customizações
    const customs = itemDoCarrinho.customizations;
    if (!customs || !customs.produtoEscolhido) {
        console.log(`Item '${itemDoCarrinho.name}' não é customizável ou falta 'produtoEscolhido'. Pulando tradução.`);
        return null; // Não é um item que vai para a máquina
    }

    try {
        // 2. Função auxiliar interna para traduzir um andar (bloco)
        //    Isso evita repetir o código 3x
        const traduzirAndar = (andarData) => {
            // Se o andar não foi fornecido (ex: caixa de 1 andar, andar2 é undefined),
            // retorna um bloco padrão (vazio/default).
            if (!andarData) {
                return {
                    "cor": 1, // 'Preto' como padrão, ou o que fizer sentido
                    "lamina1": 0, "padrao1": "0",
                    "lamina2": 0, "padrao2": "0",
                    "lamina3": 0, "padrao3": "0"
                };
            }
            
            // Traduz campo por campo usando os mapas
            const bloco = {
                "cor": MAPA_COR_CHASSI[andarData.corChassi],
                "lamina1": MAPA_COR_LAMINA[andarData.corLamina1],
                "padrao1": MAPA_PADRAO[andarData.padraoLamina1],
                "lamina2": MAPA_COR_LAMINA[andarData.corLamina2],
                "padrao2": MAPA_PADRAO[andarData.padraoLamina2],
                "lamina3": MAPA_COR_LAMINA[andarData.corLamina3],
                "padrao3": MAPA_PADRAO[andarData.padraoLamina3]
            };

            // Validação: Checa se alguma tradução falhou (virou 'undefined')
            for (const key in bloco) {
                if (typeof bloco[key] === 'undefined') {
                    throw new Error(`Falha ao traduzir campo '${key}' no andar. Valor recebido: '${andarData[key]}'`);
                }
            }
            
            return bloco;
        };

        // 3. Traduz o produto e cada andar (bloco)
        const codigoProduto = MAPA_PRODUTO[customs.produtoEscolhido];
        if (typeof codigoProduto === 'undefined') {
             throw new Error(`Produto escolhido '${customs.produtoEscolhido}' não encontrado no MAPA_PRODUTO.`);
        }
        
        const bloco1 = traduzirAndar(customs.andar1);
        const bloco2 = traduzirAndar(customs.andar2); // Funciona mesmo se customs.andar2 for undefined
        const bloco3 = traduzirAndar(customs.andar3); // Funciona mesmo se customs.andar3 for undefined

        // 4. Monta o payload final
        const payload = {
            "caixa": {
                "codigoProduto": codigoProduto,
                "bloco1": bloco1,
                "bloco2": bloco2,
                "bloco3": bloco3
            }
        };

        return payload;

    } catch (e) {
        console.error(`❌ Falha crítica ao traduzir item '${itemDoCarrinho.name}':`, e.message);
        // Retorna null para que este item não gere um erro fatal no pedido
        return null;
    }
}