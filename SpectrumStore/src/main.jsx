import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './Router/Router.jsx';
import { CartProvider } from './GlobalContext/GlobalContext.jsx';


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(

    <CartProvider>
      <CartProvider> 
        <RouterProvider router={router} />
      </CartProvider>
    </CartProvider>
  
);