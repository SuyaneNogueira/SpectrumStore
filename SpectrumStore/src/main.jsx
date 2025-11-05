import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './Front-end/Router/Router.jsx';
import { CartProvider } from './Front-end/Carrinho/CartContext.jsx';
import { FavoriteProvider } from './Front-end/TelaFavoritos/FavoriteContext.jsx';
import { RetiradaProvider } from './contexts/RetiradaContext.jsx'; // ✅ ADICIONAR

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <CartProvider>
    <FavoriteProvider>
      <RetiradaProvider> {/* ✅ ADICIONAR AQUI */}
        <RouterProvider router={router} />
      </RetiradaProvider>
    </FavoriteProvider>
  </CartProvider>
);