import './Popup.css'; 

function Popup({ message, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose} className="popup-close-btn">Fechar</button>
      </div>
    </div>
  );
}

export default Popup;