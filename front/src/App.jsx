import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import AddCar from './pages/AddCar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Шапка сайта */}
        <Header />

        {/* Контентная часть */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/car/:id" element={<CarDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-car" element={<AddCar />} />
          </Routes>
        </main>

        {/* Подвал сайта */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;