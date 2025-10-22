import React, { useState } from 'react';
import './Navbar.css';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import IconeUsuario from '../imagens/Usuario.png'; 
import IconeCoracao from '../imagens/Heart.png';   
import IconeCarrinho from '../imagens/Carrinho.png';


function Navbar({ onCategoriaClick, onPesquisaChange }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const handleItemClick = (categoria) => {
    onCategoriaClick(categoria);
    setMenuAberto(false);
  };

  const handleInputChange = (event) => {
    onPesquisaChange(event.target.value);
  };

  return (
    <nav className="nav-principal">
      <div className='logo-spectrum-store'>
        <Link to='/TelaInicial' className='link-telaInicial'><h1 className='logo-escrita-spectrum-store'>
          <span className='span-cor-logo-spectrum'>Spectrum</span> Store
        </h1></Link>
      </div>

      <div className='separacao-topicos-nav'>
        <Link className='topicos-nav'>Informações</Link>
        <div className="dropdown-categorias">
          <h4 className="topicos-nav" onClick={() => setMenuAberto(!menuAberto)}>
            Categorias <FaChevronDown className={`icone-seta ${menuAberto ? 'rotacionado' : ''}`} />
          </h4>

          {menuAberto && (
            <div className="dropdown-conteudo">
              <div className="dropdown-coluna">
                <a onClick={() => handleItemClick("BrinquedosSensoriais")}>Brinquedos sensoriais</a>
                <a onClick={() => handleItemClick("BrinquedosEducativosEPedagogicos")}>Brinquedos educativos e pedagógicos</a>
                <a onClick={() => handleItemClick("RotinaEOrganizacao")}>Rotina e organização</a>
                <a onClick={() => handleItemClick("ModaEAcessoriosSensoriais")}>Moda e acessórios sensoriais</a>
                <a onClick={() => handleItemClick("AmbienteERelaxamento")}>Ambiente e relaxamento</a>
              </div>

              <div className="linha-divisoria"></div>

              <div className="dropdown-coluna">
                <a onClick={() => handleItemClick("JogosCognitivosEEducacionais")}>Jogos Cognitivos e Educacionais</a>
                <a onClick={() => handleItemClick("MateriaisEscolaresAdaptados")}>Materiais Escolares Adaptados</a>
                <a onClick={() => handleItemClick("CuidadosERotinaPessoal")}>Cuidados e Rotina Pessoal</a>
                <a onClick={() => handleItemClick("MateriaisDeCAA")}>Materiais de CAA</a>
                <a onClick={() => handleItemClick("MaterialPonderado")}>Material Ponderado</a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='div-barra-pesquisa'>
        <div className="group">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" /></g>
          </svg>
          <input
            placeholder="Pesquisa"
            type="search"
            className="input"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className='div-icones-nav'>
        <Link to='/TelaDePerfil' className='icones-nav'><img className='img-icons' src={IconeUsuario} alt="Ícone de Usuário" /></Link>
        <Link to='/TelaFavoritos' className='icones-nav'><img className='img-icons' src={IconeCoracao} alt="Ícone de Coração" /></Link>
        <Link to='/Carrinho' className='icones-nav'><img className='img-icons' src={IconeCarrinho} alt="Ícone de Coração" /></Link>
      </div>
    </nav>
  );
}
export default Navbar;