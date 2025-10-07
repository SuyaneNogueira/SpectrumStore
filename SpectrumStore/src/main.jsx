import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './Front-end/Router/Router.jsx';
import { CartProvider } from './Front-end/Carrinho/CartContext.jsx';
import { FavoriteProvider } from './Front-end/TelaFavoritos/FavoriteContext.jsx'; // Caminho de exemplo

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <CartProvider>
    <FavoriteProvider> {/* Novo provedor de favoritos */}
      <RouterProvider router={router} />
    </FavoriteProvider>
  </CartProvider>
);