import express from "express";
import axios from "axios"; // O "carteiro" do backend

// Crie um "mini-app" (Router) só para as rotas de admin
const router = express.Router();

// =========================================================
// 🔹 GET ESTOQUE (A rota que seu Dashboard.jsx chama)
// =========================================================
/**
 * GET: Rota "Proxy" que busca o estoque REAL da máquina.
 * Ela repassa qualquer filtro (query) que o frontend enviar.
 * Ex: /api/maquina/estoque?q=chassi
 */
router.get('/api/maquina/estoque', async (req, res) => {
    console.log("[Proxy Admin] Recebida requisição para estoque da máquina...");
    
    // 1. Define o endereço REAL da API da máquina
    const maquinaBaseUrl = "http://52.72.137.244:3000/estoque";
    
    // 2. Pega TODOS os filtros que o frontend enviou (ex: ?q=chassi)
    const filtros = req.query; 

    console.log(`[Proxy Admin] Repassando filtros para a máquina:`, filtros);

    try {
        // 3. Usa axios para chamar a MÁQUINA (com os filtros)
        const response = await axios.get(maquinaBaseUrl, { 
            params: filtros 
        });
        
        // 4. Retorna a resposta da máquina DIRETAMENTE para o seu frontend
        console.log("[Proxy Admin] Máquina respondeu com sucesso.");
        res.json(response.data);

    } catch (error) {
        console.error("❌ Erro ao buscar estoque da máquina:", error.message);
        // Se a máquina estiver offline, o frontend verá este erro
        res.status(500).json({ 
            error: "Erro ao conectar com a máquina.",
            detalhes: error.code // Ex: "ECONNREFUSED"
        });
    }
});


router.get('/api/maquina/estoque/:pos', async (req, res) => {
    
    // 1. Pega o ID da posição (ex: '5') da URL
    const { pos } = req.params; 
    console.log(`[Proxy Admin] Recebida requisição para posição de estoque: ${pos}`);

    // 2. Monta a URL REAL da máquina (como na sua foto)
    const maquinaUrl = `http://52.72.137.244:3000/estoque/${pos}`;
    
    try {
        // 3. Chama a máquina
        const response = await axios.get(maquinaUrl);
        
        // 4. Retorna a resposta (JSON da peça) para o frontend
        console.log(`[Proxy Admin] Máquina respondeu para a posição ${pos}.`);
        res.json(response.data);

    } catch (error) {
        console.error(`❌ Erro ao buscar posição ${pos} da máquina:`, error.message);
        
        // Se a máquina der erro 404 (posição não encontrada), repassa o erro
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        res.status(500).json({ 
            error: "Erro ao conectar com a máquina.",
            detalhes: error.code
        });
    }
});


//Rota put (Criar ou atualizar estoque da maquina)

router.put('/api/maquina/estoque/:pos', async (req, res) => {

    // 1. Pega o ID da posição (ex: '1') da URL
    const { pos } = req.params; 
    
    // 2. Pega o JSON do "Request body" que o frontend enviou
    const bodyParaMaquina = req.body; 

    console.log(`[Proxy Admin] Recebida requisição PUT para posição ${pos} com body:`, bodyParaMaquina);

    // 3. Monta a URL REAL da máquina
    const maquinaUrl = `http://52.72.137.244:3000/estoque/${pos}`;
    
    try {
        // 4. Chama a máquina com o método PUT e envia o 'body'
        const response = await axios.put(maquinaUrl, bodyParaMaquina);
        
        // 5. Retorna a resposta da máquina para o frontend
        console.log(`[Proxy Admin] Máquina atualizou a posição ${pos}.`);
        res.json(response.data);

    } catch (error) {
        console.error(`❌ Erro ao ATUALIZAR posição ${pos} da máquina:`, error.message);
        
        if (error.response) {
            // Se a máquina der um erro (ex: 400 Bad Request), repassa
            return res.status(error.response.status).json(error.response.data);
        }
        
        res.status(500).json({ 
            error: "Erro ao conectar com a máquina.",
            detalhes: error.code
        });
    }
});


// Exporta o router para o server.js principal
export default router;