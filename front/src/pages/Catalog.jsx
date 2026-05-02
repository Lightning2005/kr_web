import { useEffect, useState } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';

function Catalog() {
  const [cars, setCars] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  // Загружаем данные из твоего API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/cars/')
      .then(res => {
        setCars(res.data);
      })
      .catch(err => console.error('Ошибка при загрузке данных:', err));
  }, []);

  // 1. Формируем список уникальных марок из тех авто, что есть в базе
  const brands = [...new Set(cars.map(car => car.brand))].sort();

  // 2. Формируем список моделей для выбранной марки (используем model_name)
  const availableModels = selectedBrand
    ? [...new Set(
        cars
          .filter(car => car.brand === selectedBrand)
          .map(car => car.model_name) // Новое поле после чистки бэкенда
      )].sort()
    : [];

  // 3. Логика фильтрации отображаемых карточек
  const filteredCars = cars.filter(car => {
    const matchBrand = selectedBrand ? car.brand === selectedBrand : true;
    const matchModel = selectedModel ? car.model_name === selectedModel : true;
    return matchBrand && matchModel;
  });

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <h1 className="text-4xl font-extrabold text-gray-900 uppercase">Каталог</h1>

        {/* Блок фильтров */}
        <div className="flex flex-wrap gap-4">
          {/* Селектор марки */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel(''); // Сброс модели при смене марки
            }}
            className="p-3 border rounded-xl bg-white shadow-sm focus:border-blue-600 outline-none min-w-[160px]"
          >
            <option value="">Все марки</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Селектор модели */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
            className="p-3 border rounded-xl bg-white shadow-sm focus:border-blue-600 outline-none min-w-[160px] disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Все модели</option>
            {availableModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Кнопка сброса */}
          {(selectedBrand || selectedModel) && (
            <button
              onClick={() => { setSelectedBrand(''); setSelectedModel(''); }}
              className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Сетка автомобилей */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-lg italic">Машин с такими параметрами пока нет в наличии...</p>
        </div>
      )}
    </div>
  );
}

export default Catalog;