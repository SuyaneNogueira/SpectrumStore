import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TelaProdutos from './TelaProdutos/Tela_produtos';
import CarrinhoP1 from './CarrinhoP1/CarrinhoP1';
import Tela_inicial from './TelaInicial/Tela_inicial.jsx';
import TelaFavoritos from './TelaFavoritos/TelaFavoritos.jsx';
import TelaRetirada from './telaRetirada/TelaRetirada.jsx';
import LoginWrapper from './pages/Login/LoginWrapper.jsx'; // ✅ IMPORTAR O WRAPPER
import Perfil from './pages/Perfil/Perfil.jsx';
import { CartProvider } from './Carrinho/CartContext.jsx';
import { FavoriteProvider } from './Front-end/TelaFavoritos/FavoriteContext.jsx';

function App() {
  return (
    <Router>
      <FavoriteProvider> 
        <CartProvider>
          <Routes>
            <Route path="/" element={<Tela_inicial />} />
            <Route path="/produto/:id" element={<TelaProdutos />} />
            <Route path="/carrinho" element={<CarrinhoP1 />} />
            <Route path="/favoritos" element={<TelaFavoritos />} />
            <Route path="/retirada" element={<TelaRetirada />} />
            <Route path="/login" element={<LoginWrapper />} /> {/* ✅ AGORA USA O WRAPPER */}
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </CartProvider>
      </FavoriteProvider>
    </Router>
  );
}

export default App;