import React from 'react';
import './TermosDeUso.css';

const TermosDeUso = ({ onClose }) => {

  return (
    <div className="modal-overlay">
      <div className="modal">
    <div className="modal-header">
      <h2>📜 Termos de Uso</h2>
      <button
          className="button-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
    </div>  
    <div className="modal-content">
      <p>
        Bem-vindo(a) à <strong>Spectrum Store</strong>. Ao acessar ou utilizar este site, você concorda integralmente com os Termos de Uso abaixo. 
        Recomendamos que leia atentamente cada seção antes de criar uma conta ou realizar uma compra.
      </p>  
      <h3>1. Sobre a Spectrum Store</h3>
      <p>
        A <strong>Spectrum Store</strong> é um espaço criado com propósito, acolhimento e ciência. Nosso objetivo é oferecer produtos sensoriais, materiais educativos e itens que promovem conforto, autonomia e bem-estar para pessoas no espectro autista, suas famílias e profissionais que as acompanham.
      </p>
      <ul>
        <li>Brinquedos sensoriais</li>
        <li>Brinquedos educativos e pedagógicos</li>
        <li>Rotina e organização</li>
        <li>Moda e acessórios sensoriais</li>
        <li>Ambiente e relaxamento</li>
        <li>Jogos cognitivos e educacionais</li>
        <li>Materiais escolares adaptados</li>
        <li>Cuidados e rotina pessoal</li>
        <li>Materiais de CAA (Comunicação Alternativa e Aumentativa)</li>
        <li>Materiais ponderados</li>
      </ul>  
      <h3>2. Aceitação dos Termos</h3>
      <p>Ao acessar o site, efetuar um cadastro ou realizar uma compra, o usuário declara estar ciente e de acordo com as condições descritas neste documento.</p>  
      <h3>3. Cadastro e Conta do Usuário</h3>
      <p>
        Para utilizar os recursos da Spectrum Store, o usuário pode criar uma conta pessoal, manualmente ou via Google. 
        É necessário fornecer informações verdadeiras e atualizadas. 
        O usuário é responsável por manter a confidencialidade de seu login e senha. 
        Contas com informações falsas ou uso irregular podem ser suspensas.
      </p>  
      <h3>4. Privacidade e Proteção de Dados</h3>
      <p>
        A Spectrum Store trata seus dados pessoais conforme a <strong>Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)</strong>. 
        As informações são usadas apenas para melhorar sua experiência de navegação e compra, e podem ser compartilhadas apenas com a plataforma <strong>Stripe</strong> para processamento de pagamentos.
      </p>  
      <h3>5. Produtos e Informações</h3>
      <p>
        Os produtos são descritos com clareza, mas variações leves de cor ou textura podem ocorrer. 
        Todos os valores estão em Reais (R$) e podem ser alterados sem aviso prévio.
      </p>  
      <h3>6. Pagamentos</h3>
      <p>
        Os pagamentos são processados de forma segura pela <strong>Stripe</strong>. 
        Nenhum dado sensível, como número de cartão, é armazenado pela Spectrum Store. 
        Tentativas de fraude resultam no cancelamento imediato do pedido.
      </p>  
      <h3>7. Retirada de Produtos</h3>
      <p>
        A Spectrum Store não realiza entregas físicas. 
        Após a confirmação do pagamento, os produtos devem ser retirados no ponto de retirada informado durante a compra, mediante apresentação do comprovante de pagamento ou documento de identificação.
      </p>  
      <h3>8. Cancelamentos e Trocas</h3>
      <p>
        Cancelamentos podem ser solicitados antes da retirada. 
        Trocas e devoluções são aceitas em até 7 dias corridos, desde que o item esteja em perfeitas condições. 
        Produtos personalizados só poderão ser trocados em caso de defeito de fabricação.
      </p>  
      <h3>9. Direitos Autorais e Propriedade Intelectual</h3>
      <p>
        Todo o conteúdo da Spectrum Store é protegido por leis de direitos autorais. 
        É proibida a reprodução, total ou parcial, sem autorização expressa da equipe.
      </p>  
      <h3>10. Conduta do Usuário</h3>
      <ul>
        <li>Não violar a legislação vigente;</li>
        <li>Não tentar obter acesso não autorizado ao sistema;</li>
        <li>Não disseminar conteúdo ofensivo, discriminatório ou enganoso;</li>
        <li>Utilizar o site de forma ética e respeitosa.</li>
      </ul>  
      <h3>11. Alterações nos Termos</h3>
      <p>
        A Spectrum Store reserva-se o direito de alterar estes Termos a qualquer momento. 
        O uso contínuo do site após modificações implica aceitação das novas condições.
      </p>  
      <h3>12. Contato e Suporte</h3>
      <p>
        Em caso de dúvidas, sugestões ou solicitações, entre em contato com:  
        <strong> spectrum.tea0204@gmail.com</strong>
      </p>  
    </div>
  </div>
    </div>
  );
};

export default TermosDeUso;
