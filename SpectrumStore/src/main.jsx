import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './Router/Router.jsx';
import { GlobalContextProvider } from './Global Context/GlobalContext.jsx';
import { CartProvider } from '../src/Carrinho/CartProvider.jsx'; 

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(

    <GlobalContextProvider>
      <CartProvider> 
        <RouterProvider router={router} />
      </CartProvider>
    </GlobalContextProvider>
  
);