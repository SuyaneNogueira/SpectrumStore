import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './Front-end/Router/Router.jsx';
// import { CartContext } from '../GlobalContext/GlobalContext.jsx'; 
import { CartProvider } from './Front-end/Carrinho/CartContext.jsx';


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
      <CartProvider> 
        <RouterProvider router={router} />
      </CartProvider>
);