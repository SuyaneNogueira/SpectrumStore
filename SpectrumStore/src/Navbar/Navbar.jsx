import './Navbar.css'
function Navbar() {
  return (
    <nav className="nav-principal">
          <div className='logo-spectrum-store'>
            <h1 className='logo-escrita-spectrum-store'><span className='span-cor-logo-spectrum'>Spectrum</span> Store</h1> 
          </div>
          <div className='separacao-topicos-nav'>
            <h4 className='topicos-nav'>Informações</h4>
            <h4 className='topicos-nav'>Categorias</h4>
          </div>
          <div className='div-barra-pesquisa'>
            <div className="group">
        <svg className="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" /></g></svg>
        <input placeholder="Search" type="search" className="input" />
      </div>
          </div>
          <div className='div-icones-nav'>
            <img className='icones-nav' src="Usuario.png" alt="" />
            <img className='icones-nav' src="Heart.png" alt="" />
            <img className='icones-nav' src="Carrinho.png" alt="" />
          </div> 
    </nav>
  )
}

export default Navbar