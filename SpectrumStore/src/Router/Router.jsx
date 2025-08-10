import { createBrowserRouter } from "react-router-dom";
import Tela_inicial from "../Tela inicial/Tela_inicial"
import PedidosAdm from "../Adm/PedidosAdm";

const Router = createBrowserRouter([
{path: "/", element: <Tela_inicial/>},
{path: "/Adm", element: <PedidosAdm/>}



])

export default Router   