import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CarCard({ car }) {
  const allPhotos = [car.image, ...(car.images?.map(img => img.image) || [])];
  const [currentImg, setCurrentImg] = useState(0);
  const navigate = useNavigate();

  const isAdmin = !!localStorage.getItem('userAuth');

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
      onClick={() => navigate(`/car/${car.id}`)}
      onMouseLeave={() => setCurrentImg(0)}
    >

      <div className="relative h-48 bg-gray-100">
        <img
          src={allPhotos[currentImg]}
          className="w-full h-full object-cover transition-opacity duration-300"
          alt={car.model_name}
        />
        {/* ... (остальной код с невидимыми зонами и точками без изменений) ... */}
        <div className="absolute inset-0 flex">
          {allPhotos.slice(0, 5).map((_, idx) => (
            <div
              key={idx}
              className="h-full flex-1 z-10"
              onMouseEnter={() => setCurrentImg(idx)}
            />
          ))}
        </div>
        {allPhotos.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
            {allPhotos.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                className={`h-1 w-4 rounded-full transition-all ${
                  currentImg === idx ? 'bg-blue-600 w-6' : 'bg-gray-300/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {car.brand} {car.model_name}
          </h3>
        </div>
        <p className="text-gray-500 text-sm">{car.year} г. • {car.mileage?.toLocaleString()} км</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-black text-gray-900">
            {Number(car.price).toLocaleString()} ₽
          </span>
        </div>
      </div>
    </div>
  );
}

export default CarCard;