import { createBrowserRouter } from "react-router-dom";
import Tela_inicial from "../Tela inicial/Tela_inicial"
import PedidosAdm from "../Adm/PedidosAdm";
import CarrnhoP1 from "../Cliente/Carrinho/CarrnhoP1";

const Router = createBrowserRouter([
{path: "/", element: <Tela_inicial/>},
{path: "/Adm", element: <PedidosAdm/>},
{path: "/Carrinho", element: <CarrnhoP1/>}


])

export default Router   