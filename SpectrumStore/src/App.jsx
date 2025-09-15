import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TelaProdutos from './TelaProdutos/Tela_produtos';
import CarrinhoP1 from './CarrinhoP1/CarrinhoP1';
import Tela_inicial from './TelaInicial/Tela_inicial.jsx';
import { CartContext } from './Carrinho/CartContext.jsx';

function App() {
  return (
    <CartContext>
      <Router>
        <Routes>
          <Route path="/" element={<Tela_inicial />} />
          <Route path="/produto/:id" element={<TelaProdutos />} />
          <Route path="/carrinho" element={<CarrinhoP1 />} />
        </Routes>
      </Router>
    </CartContext>
  );
}

export default App;