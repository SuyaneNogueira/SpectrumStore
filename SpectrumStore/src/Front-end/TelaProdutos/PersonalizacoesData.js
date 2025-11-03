
const personalizacoesPorCategoria = {
  // 1. Brinquedos Sensoriais
  "BrinquedosSensoriais": {
    "textura": ["Áspero", "Liso", "Ondulado", "Escamoso", "Pontilhado", "Acolchoado"],
    "nivelPressao": ["Muito macio", "Macio", "Médio", "Rígido"],
    "cor": ["#ffdd33", "#1b68b1", "#e55e4e", "#3a9e29", "#5a4e8f", "#ffa500"],
    "tamanho": ["P (5cm)", "M (10cm)", "G (15cm)"],
    "detalhesAdicionais": ["Espelhado", "Com glitter", "Com luzes", "Com alça"]
  },

  // 2. Brinquedos Educativos e Pedagógicos
  "BrinquedosEducativosEPedagogicos": {
    "quantidade": ["Fácil (até 10 peças)", "Médio (11 a 20 peças)", "Difícil (21 a 50 peças)"],
    "tamanho": ["P(10cm)", "M(15cm)", "G(20cm)", "GG(25cm)"],
    "material": ["EVA", "Madeira", "Plástico"],
    "corFundo": ["#1b68b1","#ffdd33", "Green", "Red", "Purple", "Orange"],
    "temaVisual": ["Animais", "Natureza", "Veículos", "Formas geométricas", "Personagens", "Objetos do dia a dia"]
  },

  // 3. Rotina e Organização
  "RotinaEOrganizacao": {
    "tipoFixação": ["Ímã", "Velcro", "Cartolina rígida", "Presilhas"],
    "estiloImagem": ["Fotos reais", "Pictogramas", "Desenhos lúdicos"],
    "corMoldura": ["#1b68b1", "#474a4e", "#ffdd33", "Green", "Red", "#3d34a5"],
    "tamanho": ["Pequeno (30x40cm)", "Médio (50x70cm)", "Grande (80x100cm)"],
    "extras": ["Com ícones personalizáveis", "Com relógio integrado", "Com espaço para anotações", "Com figuras móveis", "Com caneta"]
  },

  // 4. Moda e Acessórios Sensoriais
  "ModaEAcessoriosSensoriais": {
    "tipoTecido": ["Algodão", "Dry fit", "Lycra", "Plush", "Viscose", "Malha fria"],
    "corPrincipal": ["#bfd0cb", "#1b68b1", "Black", "#2d7f6c", "#5a4e8f", "#eac853"],
    "tamanho": ["PP", "P", "M", "G", "GG", "XG"],
    "estampa": ["Lisa", "Listrada", "Xadrez", "Com desenho", "Com frase"],
    "extras": ["Com etiquetas removíveis", "Costura suave", "Sem etiquetas internas", "Com reforço interno", "Com bolsos"]
  },

  // 5. Ambiente e Relaxamento
  "AmbienteERelaxamento": {
    "tipoProjecao": ["Estrelas", "Planetas", "Formas geométricas", "Animais", "Natureza", "Aleatória"],
    "corLuz": ["#dbd5d1", "#25415d", "#2d7f6c", "#e5ea88", "#594670", "Multicolor"],
    "tamanho": ["Pequena", "Média", "Grande"],
    "fonteEnergia": ["Pilha", "Bateria recarregável", "Tomada USB"],
    "extras": ["Com temporizador", "Com controle remoto", "Com regulagem de brilho", "Com som ambiente", "Com base antiderrapante", "Com troca automática de imagens"]
  },

  // 6. Jogos Cognitivos e Educacionais
  "JogosCognitivosEEducacionais": {
    "tipoEstimulo": ["Visual", "Tátil"],
    "complexidade": ["Simples", "Médio", "Avançado"],
    "designVisual": ["Alto contraste", "Cores vibrantes", "Desenhos simples"],
    "formato": ["Cartas", "Painéis", "Tabuleiros"],
    "Tema": ["Animais", "Carros", "Frutas", "Rotina", "Objetos", "Países", "Heróis"]
  },

  // 7. Materiais Escolares Adaptados
  "MateriaisEscolaresAdaptados": {
    "tipoPauta": ["Linha simples", "Dupla linha", "Quadriculado", "Pontilhado", "Guia de cores", "Com margem destacada"],
    "corCapa": ["#1b68b1", "Green", "Red", "#e5ea88", "Purple", "Orange"],
    "tamanho": ["A5", "A4", "Ofício"],
    "materialCapa": ["Plástico", "Papelão rígido", "Capa dura laminada"],
    "extras": ["Com espiral", "Com divisórias", "Com régua acoplada", "Com bolsa interna", "Com pauta dupla face", "Com marcador de página"]
  },

  // 8. Cuidados e Rotina Pessoal
  "CuidadosERotinaPessoal": {
    "tipoCerdas": ["Macias", "Médias", "Extra macias", "Duplas", "Onduladas", "Sensíveis"],
    "cor": ["#1b68b1", "Green", "Pink", "#e5ea88", "Purple", "Orange"],
    "tempoTemporizador": ["1 minuto", "2 minutos", "3 minutos"],
    "tipoEnergia": [ "Pilhas", "Recarregável"],
    "extras": ["Com luz LED", "Com música", "Com cabo antiderrapante", "Com base de apoio", "Com capa protetora", "Com indicadores de troca"]
  },

  // 9. Comunicação Alternativa e Aumentativa (CAA)
  "ComunicacaoAlternativaEAumentativa(CAA)": {
    "tipoSimbolo": ["Pictograma", "Imagem real", "Desenho infantil", "Escrita simples", "Braille"],
    "corFundo": ["White", "#e5ea88", "#1b68b1", "Green", "Purple", "Orange"],
    "tamanhoCartao": ["Pequeno", "Médio", "Grande"],
    "material": ["Plástico", "Cartão laminado", "PVC"],
    "extras": ["Com velcro", "Com textura", "Com borda reforçada", "Com figuras em alto contraste", "Com legenda personalizada"]
  },

  // 10. Material Ponderado
  "MaterialPonderado": {
    "distribuicaoPeso": ["Ombros", "Costas", "Peito", "Uniforme", "Personalizado"],
    "corPrincipal": ["#1b68b1", "Black", "Gray", "Green", "Purple", "Red"],
    "nivelPeso": ["3kg", "5kg", "7kg"],
    "tecido": ["Algodão", "Veludo", "Malha"],
    "extras": ["Com ajuste de velcro", "Com bolsos", "Com peso removível", "Com reforço interno", "Com estampa personalizada", "Com fecho frontal"]
  }
};

export default personalizacoesPorCategoria;