import { useEffect, useState } from 'react';
import api from '../api';
import CarCard from '../components/CarCard';

function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true); // Добавили индикатор загрузки
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Функция загрузки (вынесена отдельно, чтобы вызывать при пагинации)
  const fetchCars = (url = 'cars/') => {
    setLoading(true);

    // Передаем марку прямо в запрос к бэку, раз ты сделал ?brand_name=
    const params = selectedBrand ? { brand_name: selectedBrand } : {};

    api.get(url, { params })
      .then(res => {
        // Проверка: если пагинация выключена, данные будут в res.data, если включена - в res.data.results
        const results = res.data.results || res.data;
        setCars(results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setLoading(false);
      });
  };

  // Загружаем при первом рендере и при смене марки
  useEffect(() => {
    fetchCars();
  }, [selectedBrand]);

  // Списки для фильтров (берем из пришедших данных)
  const brands = [...new Set(cars.map(car => car.brand))].sort();
  const availableModels = selectedBrand
    ? [...new Set(cars.filter(car => car.brand === selectedBrand).map(car => car.model_name))].sort()
    : [];

  // Фильтруем только по модели, так как марку теперь фильтрует бэкенд (для надежности)
  const filteredCars = selectedModel
    ? cars.filter(car => car.model_name === selectedModel)
    : cars;

  if (loading) return <div className="text-center py-20 uppercase font-bold">Загрузка...</div>;

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <h1 className="text-4xl font-extrabold text-gray-900 uppercase">Каталог</h1>

        <div className="flex flex-wrap gap-4">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel('');
            }}
            className="p-3 border rounded-xl bg-white shadow-sm outline-none min-w-[160px]"
          >
            <option value="">Все марки</option>
            {/* Если на бэке есть марки, но машин нет, список будет пуст.
                В идеале список марок лучше тянуть отдельным эндпоинтом */}
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
            className="p-3 border rounded-xl bg-white shadow-sm outline-none min-w-[160px] disabled:bg-gray-100"
          >
            <option value="">Все модели</option>
            {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          {(selectedBrand || selectedModel) && (
            <button onClick={() => { setSelectedBrand(''); setSelectedModel(''); }} className="text-blue-600 font-bold">
              Сбросить
            </button>
          )}
        </div>
      </div>

      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-lg italic">Машин не найдено...</p>
        </div>
      )}

      {/* Оживляем кнопки пагинации */}
      <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={!prevPage}
            onClick={() => fetchCars(prevPage)}
            className="p-2 px-4 border rounded disabled:opacity-50"
          >
            Назад
          </button>
          <button
            disabled={!nextPage}
            onClick={() => fetchCars(nextPage)}
            className="p-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Вперед
          </button>
      </div>
    </div>
  );
}

export default Catalog;