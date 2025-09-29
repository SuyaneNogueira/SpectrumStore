const personalizacoesPorCategoria = {
  // 1. Brinquedos Sensoriais
  "Brinquedos Sensoriais": {
    "textura": ["Áspero", "Liso", "Ondulado", "Escamoso", "Pontilhado", "Acolchoado"],
    "nivelPressao": ["Muito macio", "Macio", "Médio", "Rígido"],
    "cor": ["Yellow", "Blue", "Red", "Green", "Purple", "Orange"],
    "tamanho": ["P (5cm)", "M (10cm)", "G (15cm)"],
    "detalhesAdicionais": ["Com sinos", "Com espelhos", "Com glitter", "Com luzes", "Com alça", "Com velcro"]
  },

  // 2. Brinquedos Educativos e Pedagógicos
  "BrinquedosEducativosEPedagogicos": {
    "nivelDificuldade": ["Fácil (até 10 peças)", "Médio (11 a 20 peças)", "Difícil (21 a 50 peças)"],
    "fonteLetras": ["Bastão simples", "Cursiva", "Fonte adaptada para dislexia", "Fonte grande"],
    "material": ["EVA", "Madeira", "Plástico"],
    "corFundo": ["Blue", "Yellow", "Green", "Red", "Purple", "Orange"],
    "temaVisual": ["Animais", "Natureza", "Veículos", "Formas geométricas", "Personagens", "Objetos do dia a dia"]
  },

  // 3. Rotina e Organização
  "RotinaEOrganizacao": {
    "tipoFixacao": ["Ímã", "Velcro", "Cartolina rígida"],
    "estiloImagem": ["Fotos reais", "Pictogramas", "Desenhos lúdicos"],
    "corMoldura": ["Blue", "White", "Yellow", "Green", "Red", "Purple"],
    "tamanho": ["Pequeno (30x40cm)", "Médio (50x70cm)", "Grande (80x100cm)"],
    "extras": ["Com ícones personalizáveis", "Com relógio integrado", "Com espaço para anotações", "Com figuras móveis", "Com luzes indicativas", "Com sons"]
  },

  // 4. Moda e Acessórios Sensoriais
  "ModaEAcessoriosSensoriais": {
    "tipoTecido": ["Algodão", "Dry fit", "Lycra", "Plush", "Viscose", "Malha fria"],
    "corPrincipal": ["White", "Blue", "Black", "Green", "Purple", "Yellow"],
    "tamanho": ["PP", "P", "M", "G", "GG", "XG"],
    "estampa": ["Lisa", "Listrada", "Xadrez", "Com desenho", "Com frase", "Customizada"],
    "extras": ["Com etiquetas removíveis", "Costura suave", "Sem etiquetas internas", "Com reforço interno", "Com bolsos", "Com QR code de identificação"]
  },

  // 5. Ambiente e Relaxamento
  "AmbienteERelaxamento": {
    "tipoProjecao": ["Estrelas", "Planetas", "Formas geométricas", "Animais", "Natureza", "Aleatória"],
    "corLuz": ["Warm white", "Blue", "Green", "Yellow", "Purple", "Multicolor"],
    "tamanho": ["Pequena", "Média", "Grande"],
    "fonteEnergia": ["Pilha", "Bateria recarregável", "Tomada USB"],
    "extras": ["Com temporizador", "Com controle remoto", "Com regulagem de brilho", "Com som ambiente", "Com base antiderrapante", "Com troca automática de imagens"]
  },

  // 6. Jogos Cognitivos e Educacionais
  "JogosCognitivosEEducacionais": {
    "tipoEstimulo": ["Visual", "Auditivo", "Tátil"],
    "complexidade": ["Simples", "Médio", "Avançado"],
    "designVisual": ["Alto contraste", "Cores vibrantes", "Desenhos simples"],
    "formato": ["Cartas", "Painéis", "Tabuleiros", "Apps"],
    "sistemaRecompensa": ["Visual", "Sonoro", "Tátil"]
  },

  // 7. Materiais Escolares Adaptados
  "MateriaisEscolaresAdaptados": {
    "tipoPauta": ["Linha simples", "Dupla linha", "Quadriculado", "Pontilhado", "Guia de cores", "Com margem destacada"],
    "corCapa": ["Blue", "Green", "Red", "Yellow", "Purple", "Orange"],
    "tamanho": ["A5", "A4", "Ofício"],
    "materialCapa": ["Plástico", "Papelão rígido", "Capa dura laminada"],
    "extras": ["Com espiral", "Com divisórias", "Com régua acoplada", "Com bolsa interna", "Com pauta dupla face", "Com marcador de página"]
  },

  // 8. Cuidados e Rotina Pessoal
  "CuidadosERotinaPessoal": {
    "tipoCerdas": ["Macias", "Médias", "Extra macias", "Duplas", "Onduladas", "Sensíveis"],
    "cor": ["Blue", "Green", "Pink", "Yellow", "Purple", "Orange"],
    "tempoTemporizador": ["1 minuto", "2 minutos", "3 minutos"],
    "tipoEnergia": ["Manual", "Pilhas", "Recarregável"],
    "extras": ["Com luz LED", "Com música", "Com cabo antiderrapante", "Com base de apoio", "Com capa protetora", "Com indicadores de troca"]
  },

  // 9. Comunicação Alternativa e Aumentativa (CAA)
  "ComunicacaoAlternativaEAumentativa(CAA)": {
    "tipoSimbolo": ["Pictograma", "Imagem real", "Desenho infantil", "Escrita simples", "Braille", "Misto"],
    "corFundo": ["White", "Yellow", "Blue", "Green", "Purple", "Orange"],
    "tamanhoCartao": ["Pequeno", "Médio", "Grande"],
    "material": ["Plástico", "Cartão laminado", "PVC"],
    "extras": ["Com velcro", "Com código QR sonoro", "Com textura", "Com borda reforçada", "Com figuras em alto contraste", "Com legenda personalizada"]
  },

  // 10. Material Ponderado
  "MaterialPonderado": {
    "distribuicaoPeso": ["Ombros", "Costas", "Peito", "Uniforme", "Misto", "Personalizado"],
    "corPrincipal": ["Blue", "Black", "Gray", "Green", "Purple", "Red"],
    "nivelPeso": ["1kg", "2kg", "3kg"],
    "tecido": ["Algodão", "Veludo", "Malha"],
    "extras": ["Com ajuste de velcro", "Com bolsos", "Com peso removível", "Com reforço interno", "Com estampa personalizada", "Com fecho frontal"]
  }
};

export default personalizacoesPorCategoria;