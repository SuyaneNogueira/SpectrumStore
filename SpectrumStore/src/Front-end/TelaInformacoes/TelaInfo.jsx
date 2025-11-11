import Navbar from "../Navbar/Navbar";
import "./TelaInfo.css";


function TelaInfo() {
  return (
    <div className="div-principal-info">
        <Navbar/>
    <div className="div-fundo-brinquedos-container">
          <img className="foto-fundo-b" src="Fundo-brinquedos.png" alt="Brinquedos educativos" />
          <div className="conteudo-principal-brinquedos">
            <h2 className="titulo-brinquedos">A importancia de cada produto</h2>
          </div>
    </div>
    <div className="div-infos">
        <div className="texts-infos-elements">
         <div className="titulo-infos">Por que cada produto importa?</div>
         <div className="text-infos">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, illum fugit. Eaque est possimus, reiciendis velit sit, et illum rem, molestias ex quia laboriosam porro repellat voluptatum nam eius perferendis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam facere ipsam ducimus quisquam praesentium consectetur voluptates, impedit in laudantium iure! Illum non blanditiis aliquid!</div>   
        </div>
        <div className="espacamento-infos"><div className="linha-separacao"></div></div>
        <div className="texts-infos-elements">
         <div className="titulo-infos">Brinquedos sensoriais:</div>
         <div className="text-infos">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, illum fugit. Eaque est possimus, reiciendis velit sit, et illum rem, molestias ex quia laboriosam porro repellat voluptatum nam eius perferendis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam facere ipsam ducimus quisquam praesentium consectetur voluptates, impedit in laudantium iure! Illum non blanditiis aliquid!</div>   
        </div>
        <div className="espacamento-infos"><div className="linha-separacao"></div></div>
        <div className="texts-infos-elements">
         <div className="titulo-infos">Brinquedos regulatórios Brinquedos sensoriais:</div>
         <div className="text-infos">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, illum fugit. Eaque est possimus, reiciendis velit sit, et illum rem, molestias ex quia laboriosam porro repellat voluptatum nam eius perferendis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam facere ipsam ducimus quisquam praesentium consectetur voluptates, impedit in laudantium iure! Illum non blanditiis aliquid!</div>   
        </div>
    </div>
    </div>
  )
}

export default TelaInfo