import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './contexts/FavoritesContext';
import TelaInicial from './Tela inicial/Tela_inicial';
import FavoritesPage from './components/FavoritesPage';

function App() {
  return (
    <Router>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
        </Routes>
      </FavoritesProvider>
    </Router>
  );
}

export default App;