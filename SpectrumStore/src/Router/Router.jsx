import { createBrowserRouter } from "react-router-dom";
import Tela_inicial from "../Tela inicial/Tela_inicial";
import Produtos from "../Adm/pages/Produtos";
import Layout from "../Adm/components/Layout";
import Dashboard from "../Adm/pages/Dashboard";


const Router = createBrowserRouter([
{path: "/", element: <Tela_inicial/>},




  {
    path: "/LayoutAdm",
    element: <Layout/>, 
    children: [
      { index: true, element: <Dashboard/> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "produtos", element: <Produtos/> },
    ],  
  }

])

export default Router   