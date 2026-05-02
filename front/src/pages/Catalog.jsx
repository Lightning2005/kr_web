import { useEffect, useState } from 'react';
import api from '../api';
import CarCard from '../components/CarCard';

function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fetchCars = (url = 'cars/') => {
    setLoading(true);
    const params = selectedBrand ? { brand_name: selectedBrand } : {};

    api.get(url, { params })
      .then(res => {
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

  useEffect(() => {
    fetchCars();
  }, [selectedBrand]);

  const brands = [...new Set(cars.map(car => car.brand))].sort();
  const availableModels = selectedBrand
    ? [...new Set(cars.filter(car => car.brand === selectedBrand).map(car => car.model_name))].sort()
    : [];

  const filteredCars = selectedModel
    ? cars.filter(car => car.model_name === selectedModel)
    : cars;

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-12">

      {/* ЕДИНАЯ ЛИНИЯ: ЗАГОЛОВОК И ФИЛЬТРЫ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-8 border-b-2 border-black-100">
        <div className="flex flex-col gap-2">
           <span className="text-blue-600 font-black uppercase tracking-widest text-[10px]">Наш автопарк</span>
           <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter">Каталог</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel('');
              }}
              className="py-3 px-6 bg-white border border-gray-200 rounded-xl font-bold uppercase text-[11px] tracking-wider outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer min-w-[180px]"
            >
              <option value="">Все марки</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="py-3 px-6 bg-white border border-gray-200 rounded-xl font-bold uppercase text-[11px] tracking-wider outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer min-w-[180px] disabled:opacity-50"
            >
              <option value="">Все модели</option>
              {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {(selectedBrand || selectedModel) && (
            <button
              onClick={() => { setSelectedBrand(''); setSelectedModel(''); }}
              className="px-6 py-4 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 rounded-xl transition-all"
            >
              Сброс
            </button>
          )}
        </div>
      </div>

      {/* СЕТКА КАРТОЧЕК */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-[400px] bg-gray-50 rounded-[32px] animate-pulse" />
          ))}
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCars.map(car => (
             <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-black uppercase tracking-tighter">Ничего не найдено</p>
        </div>
      )}

      {/* ПАГИНАЦИЯ (Появится, когда на бэке будет больше машин, чем лимит на страницу) */}
      {(prevPage || nextPage) && (
        <div className="flex justify-center items-center gap-4 mt-16">
            <button
              disabled={!prevPage}
              onClick={() => {
                fetchCars(prevPage);
                window.scrollTo(0, 0); // Возвращаем вверх при переходе
              }}
              className="px-8 py-4 border-2 border-gray-100 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              Назад
            </button>
            <button
              disabled={!nextPage}
              onClick={() => {
                fetchCars(nextPage);
                window.scrollTo(0, 0);
              }}
              className="px-8 py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 shadow-lg shadow-gray-200 disabled:opacity-30 transition-all"
            >
              Вперед
            </button>
        </div>
      )}
    </div>
  );
}

export default Catalog;