import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './Carrinho/CartProvider';
import TelaProdutos from './TelaProdutos/Tela_produtos';
import CarrinhoP1 from './CarrinhoP1/CarrinhoP1';
import Home from './Home';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<TelaProdutos />} />
          <Route path="/carrinho" element={<CarrinhoP1 />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;