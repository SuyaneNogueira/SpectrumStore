import express from "express";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { pool } from "./db.js";
import { defineRoutes } from "./CarrinhoBackT.js";
import axios from "axios";
import { traduzirItemParaPayload } from "./tradutorMaquina.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030; // ← PORTA FIXA 3030
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =========================================================
// 🔹 MIDDLEWARES
// =========================================================
app.use(cors());
app.use(express.json());

// =========================================================
// 🔹 ROTAS EXISTENTES (mantenha suas rotas originais)
// =========================================================
defineRoutes(app);

// =========================================================
// 🔹 ROTAS DE RETIRADA MOCKADAS (NOVAS)
// =========================================================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development'
  });
});

// Listar pedidos prontos para retirada
app.get('/retirada/pedidos-prontos', (req, res) => {
  console.log('📦 Buscando pedidos prontos para retirada...');
  
  res.json({
    pedidos: [
      {
        id: '671a5b8c9d0e1f2a3b4c5d6e',
        orderId: 'PED-TESTE-001',
        sku: 'KIT-01',
        cor: 'azul',
        estoquePos: 5,
        callbackUrl: '',
        createdAt: new Date().toISOString(),
        prontoDesde: new Date().toISOString(),
        payload: { 
          orderId: 'PED-TESTE-001', 
          sku: 'KIT-01', 
          cor: 'azul',
          categoria: 'BrinquedosSensoriais'
        }
      }
    ],
    total: 1,
    timestamp: new Date().toISOString()
  });
});

// Confirmar retirada
app.post('/retirada/:orderId/confirmar', (req, res) => {
  const { orderId } = req.params;
  
  console.log(`✅ Confirmando retirada do pedido: ${orderId}`);
  
  res.json({
    message: 'Retirada confirmada com sucesso',
    orderId: orderId,
    pedidoId: '671a5b8c9d0e1f2a3b4c5d6e',
    confirmacao: {
      confirmadoEm: new Date().toISOString(),
      localRetirada: 'Loja Principal - Balcão 1',
      funcionario: `Func-${Math.floor(Math.random() * 100)}`,
      codigoConfirmacao: `RET-${Date.now()}`,
      metodoVerificacao: 'Código do pedido'
    },
    timestamp: new Date().toISOString()
  });
});

// Status da área de retirada
app.get('/retirada/status', (req, res) => {
  res.json({
    resumo: {
      prontosParaRetirada: 1,
      retiradosHoje: 5,
      totalProcessado: 6
    },
    areaRetirada: {
      balcoesAtivos: 2,
      tempoMedioRetirada: '2-5 minutos',
      filaRetirada: Math.floor(Math.random() * 5),
      funcionariosDisponiveis: Math.floor(Math.random() * 3) + 1,
      horarioFuncionamento: '08:00 - 22:00'
    },
    timestamp: new Date().toISOString()
  });
});

// Cancelar retirada
app.post('/retirada/:orderId/cancelar', (req, res) => {
  const { orderId } = req.params;
  const { motivo } = req.body;
  
  console.log(`❌ Cancelando retirada do pedido: ${orderId} - Motivo: ${motivo}`);
  
  res.json({
    message: 'Retirada cancelada com sucesso',
    orderId: orderId,
    timestamp: new Date().toISOString()
  });
});

// Status de um pedido específico
app.get('/queue/items/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    _id: id,
    payload: { 
      orderId: 'PED-TESTE-001', 
      sku: 'KIT-01', 
      cor: 'azul',
      categoria: 'BrinquedosSensoriais'
    },
    status: 'COMPLETED',
    stage: 'PRONTO_RETIRADA',
    progress: 100,
    estoquePos: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

// Rota de teste simples
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend SpectrumStore funcionando! 🚀',
    timestamp: new Date().toISOString()
  });
});

// =========================================================
// 🔹 APENAS UM app.listen() NO FINAL!
// =========================================================
app.listen(PORT, () => {
  console.log(`🎉 Backend SpectrumStore rodando em http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🛍️  Pedidos Prontos: http://localhost:${PORT}/retirada/pedidos-prontos`);
  console.log(`🧪 Teste: http://localhost:${PORT}/test`);
  console.log('==============================================');
});

// NÃO ADICIONE NENHUM OUTRO app.listen() AQUI!