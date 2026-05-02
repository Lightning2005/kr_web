import { useEffect, useState } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';

function Catalog() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/cars/')
      .then(res => setCars(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    // max-w-7xl ограничивает ширину контента, mx-auto центрирует его
    <div className="max-w-[1200px] mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 uppercase">Каталог</h1>

      {/* grid-cols-4 заставляет карточки встать в 4 колонки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}

export default Catalog;