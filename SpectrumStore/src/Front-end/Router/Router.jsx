import { createBrowserRouter } from "react-router-dom";
import Tela_inicial from "../TelaInicial/Tela_inicial";
import CarrnhoP1 from "../Carrinho/CarrnhoP1";
import BrinquedosSensoriais from "../Categorias/BrinquedosSensoriais";
import BrinquedosEducativosEPedagogicos from "../Categorias/BrinquedosEducativosEPedagogicos";
import RotinaEOrganizacao from "../Categorias/RotinaEOrganizacao";
import ModaEAcessoriosSensoriais from "../Categorias/ModaEAcessoriosSensoriais";
import AmbienteERelaxamento from "../Categorias/AmbienteERelaxamento";
import JogosCognitivosEEducacionais from "../Categorias/JogosCognitivosEEducacionais";
import MateriaisEscolaresAdaptados from "../Categorias/MateriaisEscolaresAdaptados";
import CuidadosERotinaPessoal from "../Categorias/CuidadosERotinaPessoal";
import MateriaisDeCAA from "../Categorias/MateriaisDeCAA";
import MaterialPonderado from "../Categorias/MaterialPonderado";
import Tela_produtos from "../TelaProdutos/Tela_produtos";
import TelaDePerfil from "../TelaDePefil/Perfil/TelaDePerfil";
import CarrinhoP2 from "../Carrinho/CarrinhoP2";
import Produtos from "../../Adm/pages/Produtos";
import Layout from "../../Adm/components/Layout";
import Dashboard from "../../Adm/pages/Dashboard";
import Pedidos from "../../Adm/pages/Pedidos";
import Estatisticas from "../../Adm/pages/Estatisticas";
import Estoque from "../../Adm/pages/Estoque";
import TelaFavoritos from "../TelaFavoritos/TelaFavoritos";
import LandingPage from "../LandingPage/LandingPage";

const Router = createBrowserRouter([
    { path: "/", element: <LandingPage/> },
    { path: "/TelaInicial", element: <Tela_inicial/> },
    { path: "/produto/:id", element: <Tela_produtos/> }, 
    { path: "/Carrinho", element: <CarrnhoP1/> },
    {path: "/pagamento", element: <CarrinhoP2/>},
    { path: "/BrinquedosSensoriais", element: <BrinquedosSensoriais/> },
    { path: "/BrinquedosEducativosEPedagogicos", element: <BrinquedosEducativosEPedagogicos/> },
    { path: "/RotinaEOrganização", element: <RotinaEOrganizacao/> },
    { path: "/ModaEAcessoriosSensorias", element: <ModaEAcessoriosSensoriais/> },
    { path: "/AmbienteERelaxamento", element: <AmbienteERelaxamento/> },
    { path: "/JogosCognitivosEEducacionais", element: <JogosCognitivosEEducacionais/> },
    { path: "/MateriaisEscolares", element: <MateriaisEscolaresAdaptados/> },
    { path: "/CuidadosERotinaPessoal", element: <CuidadosERotinaPessoal/> },
    { path: "/MateriaisDeCAA", element: <MateriaisDeCAA/> },
    { path: "/MaterialPonderado", element: <MaterialPonderado/> },
    { path: "/TelaDePerfil", element: <TelaDePerfil/> },
    { path: "/TelaFavoritos", element: <TelaFavoritos/> },
    {
        path: "/LayoutAdm",
        element: <Layout/>, 
        children: [
            { index: true, element: <Dashboard/> },
            { path: "dashboard", element: <Dashboard/> },
            { path: "pedidos", element: <Pedidos/> },
            { path: "estatisticas", element: <Estatisticas/> },
            { path: "produtos", element: <Produtos/> },
            { path: "estoque", element: <Estoque/> },
        ], 
    }
]);

export default Router;