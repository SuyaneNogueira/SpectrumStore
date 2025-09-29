import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TelaProdutos from './TelaProdutos/Tela_produtos';
import CarrinhoP1 from './CarrinhoP1/CarrinhoP1';
import Tela_inicial from './TelaInicial/Tela_inicial.jsx';
import TelaFavoritos from './TelaFavoritos/TelaFavoritos.jsx';
import { CartProvider } from './Carrinho/CartContext.jsx';
import { FavoriteProvider } from './Front-end/TelaFavoritos/FavoriteContext.jsx'; // Importe o provedor de favoritos

function App() {
  return (
    // O CartProvider e o FavoriteProvider devem envolver o Router
      <FavoriteProvider> 
    <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Tela_inicial />} />
            <Route path="/produto/:id" element={<TelaProdutos />} />
            <Route path="/carrinho" element={<CarrinhoP1 />} />
            <Route path="/favoritos" element={<TelaFavoritos />} />
          </Routes>
        </Router>
    </CartProvider>
      </FavoriteProvider>
  );
}

export default App;