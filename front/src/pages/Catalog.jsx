import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import CarCard from '../components/CarCard';
import { Helmet } from 'react-helmet-async';

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Данные
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]); // Полный список марок для фильтра
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Состояния фильтров (инициализируем из URL)
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('min_price') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('max_price') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand_name') || '');
  const [selectedModel, setSelectedModel] = useState('');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '-created_at');

  // Для задержки (debounce)
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: searchParams.get('search') || '',
    priceMin: searchParams.get('min_price') || '',
    priceMax: searchParams.get('max_price') || ''
  });

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

    // 1. Загрузка ВСЕХ существующих марок из справочника
    useEffect(() => {
      api.get('brands/') // Используем ваш BrandViewSet
        .then(res => {
          // DRF обычно возвращает список либо напрямую, либо в ключе results
          const brandsData = res.data.results || res.data;
          // Извлекаем только названия марок
          const names = brandsData.map(b => b.name).sort();
          setBrands(names);
        })
        .catch(err => console.error("Ошибка загрузки марок:", err));
    }, []);

  // 2. Синхронизация при переходе с главной (если URL изменился извне)
  useEffect(() => {
    setSelectedBrand(searchParams.get('brand_name') || '');
    setSearch(searchParams.get('search') || '');
    setPriceMin(searchParams.get('min_price') || '');
    setPriceMax(searchParams.get('max_price') || '');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // 3. Debounce для текстовых полей
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({ search, priceMin, priceMax });
    }, 500);
    return () => clearTimeout(handler);
  }, [search, priceMin, priceMax]);

  // 4. Основная функция запроса
  const fetchCars = useCallback((page = 1, silent = false) => {
    if (silent) setIsFiltering(true);
    else setLoading(true);

    const params = {
      page: page,
      ordering: ordering,
      search: debouncedFilters.search || undefined,
      brand_name: selectedBrand || undefined,
      min_price: debouncedFilters.priceMin || undefined,
      max_price: debouncedFilters.priceMax || undefined,
    };

    api.get('cars/', { params })
      .then(res => {
        setCars(res.data.results || res.data);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
        setLoading(false);
        setIsFiltering(false);
      })
      .catch(err => {
        console.error('Ошибка API:', err);
        setLoading(false);
        setIsFiltering(false);
      });
  }, [selectedBrand, debouncedFilters, ordering]);

  // 5. Вызываем запрос при изменении любого фильтра
  useEffect(() => {
    fetchCars(currentPage, cars.length > 0);

    // Обновляем URL (чтобы можно было скопировать ссылку)
    const params = {};
    if (selectedBrand) params.brand_name = selectedBrand;
    if (debouncedFilters.search) params.search = debouncedFilters.search;
    if (ordering !== '-created_at') params.ordering = ordering;
    if (debouncedFilters.priceMin) params.min_price = debouncedFilters.priceMin;
    if (debouncedFilters.priceMax) params.max_price = debouncedFilters.priceMax;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params);
  }, [selectedBrand, debouncedFilters, ordering, currentPage]);

  const handleReset = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSearch('');
    setPriceMin('');
    setPriceMax('');
    setOrdering('-created_at');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Модели фильтруем только из того, что сейчас в стейте `cars`
  const availableModels = selectedBrand
    ? [...new Set(cars.filter(car => car.brand === selectedBrand).map(car => car.model_name))].sort()
    : [];

  const finalCars = selectedModel
    ? cars.filter(car => car.model_name === selectedModel)
    : cars;

  return (
    <div className="max-w-[1440px] mx-auto px-10 pt-12 pb-24 min-h-screen">
        <Helmet>
            <title>Каталог автомобилей | Drive Select</title>
        </Helmet>

      {/* ПАНЕЛЬ ФИЛЬТРОВ */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 pb-8 border-b-2 border-gray-100">
        <div className="flex flex-col gap-2">
           <span className="text-blue-600 font-black uppercase tracking-widest text-[10px]">Наш автопарк</span>
           <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter">Каталог</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="ПОИСК..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="py-3.5 px-6 bg-white border border-gray-200 rounded-2xl font-black uppercase text-[11px] tracking-widest outline-none focus:border-blue-500 transition-all min-w-[200px]"
          />

          <div className="flex gap-2 p-1.5 bg-gray-50/50 rounded-[24px] border border-gray-100">
            <input
              type="number"
              placeholder="ОТ ₽"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-24 py-3 px-4 bg-white border border-gray-200 rounded-xl font-black uppercase text-[10px] outline-none"
            />
            <input
              type="number"
              placeholder="ДО ₽"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-24 py-3 px-4 bg-white border border-gray-200 rounded-xl font-black uppercase text-[10px] outline-none"
            />
          </div>

          <div className="flex gap-2 p-1.5 bg-gray-50/50 rounded-[24px] border border-gray-100">
            <select
              value={selectedBrand}
              onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(''); setCurrentPage(1); }}
              className="appearance-none py-3 px-6 bg-white border border-gray-200 rounded-xl font-black uppercase text-[11px] outline-none cursor-pointer min-w-[140px]"
            >
              <option value="">МАРКА</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="appearance-none py-3 px-6 bg-white border border-gray-200 rounded-xl font-black uppercase text-[11px] outline-none cursor-pointer min-w-[140px] disabled:opacity-40"
            >
              <option value="">МОДЕЛЬ</option>
              {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <select
            value={ordering}
            onChange={(e) => { setOrdering(e.target.value); setCurrentPage(1); }}
            className="appearance-none py-3.5 px-8 bg-white border border-gray-200 rounded-2xl font-black uppercase text-[11px] outline-none cursor-pointer min-w-[160px]"
          >
            <option value="-created_at">НОВИНКИ</option>
            <option value="price">ДЕШЕВЛЕ</option>
            <option value="-price">ДОРОЖЕ</option>
            <option value="-year">СВЕЖЕЕ ГОД</option>
          </select>

          <button onClick={handleReset} className="ml-2 px-4 py-2 text-blue-600 font-black uppercase text-[11px] hover:text-gray-900 transition-colors">
            СБРОС
          </button>
        </div>
      </div>

      {/* КОНТЕНТ */}
      <div className="relative">
        {isFiltering && (
            <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] flex justify-center pt-20">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <div key={i} className="h-[400px] bg-gray-50 rounded-[32px] animate-pulse" />)}
          </div>
        ) : finalCars.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-opacity ${isFiltering ? 'opacity-30' : 'opacity-100'}`}>
            {finalCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase">Ничего не найдено</p>
          </div>
        )}
      </div>

      {/* ПАГИНАЦИЯ */}
      {(prevPage || nextPage) && !loading && (
        <div className="flex justify-center items-center gap-4 mt-16">
          <button
            disabled={!prevPage}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-8 py-4 border-2 border-gray-100 rounded-xl font-black uppercase text-[10px] hover:bg-gray-50 disabled:opacity-30 transition-all"
          >Назад</button>
          <span className="font-black text-gray-300 text-sm mx-2">{currentPage}</span>
          <button
            disabled={!nextPage}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-[10px] hover:bg-blue-600 shadow-lg disabled:opacity-30 transition-all"
          >Вперед</button>
        </div>
      )}
    </div>
  );
}

export default Catalog;