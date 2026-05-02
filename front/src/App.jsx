import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import CarDetail from './pages/CarDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/car/:id" element={<CarDetail/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;