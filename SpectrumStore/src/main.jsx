

import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './Router/Router.jsx'
import { GlobalContextProvider } from './Global Context/GlobalContext.jsx'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(

  <GlobalContextProvider>
  <RouterProvider router={router} />
  </GlobalContextProvider>
) 
