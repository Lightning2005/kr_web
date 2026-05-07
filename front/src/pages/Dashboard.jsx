import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

function Dashboard() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalPrice: 0, maxPrice: 0 });
  const authData = localStorage.getItem('userAuth');
  const token = localStorage.getItem('access');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Добавляем параметр, чтобы бэкенд не ограничивал выдачу (если настроим)
    // или просто обрабатываем то, что пришло
    api.get('cars/?page_size=999')
      .then(res => {
        // ВАЖНО: Если включена пагинация, данные лежат в res.data.results
        const isPaginated = !!res.data.results;
        const data = res.data.results || res.data;
        if (Array.isArray(data)) {

          // 1. Берем ОБЩЕЕ количество из поля count (которое присылает Django)
          const totalFromServer = isPaginated ? res.data.count : data.length;

          setCars(data);

          const sum = data.reduce((acc, car) => acc + Number(car.price), 0);
          const max = data.length > 0 ? Math.max(...data.map(car => Number(car.price))) : 0;

          setStats({
            total: totalFromServer, // Теперь тут будет 13
            totalPrice: sum,
            maxPrice: max
          });
        }
      })
      .catch(err => {
        console.error("Ошибка Dashboard:", err.response);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      });
  }, [navigate, token]);

  if (!authData || !token) return null;

  const username = atob(authData).split(':')[0];
  const averagePrice = stats.total > 0 ? Math.round(stats.totalPrice / stats.total) : 0;

  const handleDelete = (id, e) => {
      e.stopPropagation();

      toast((t) => (
        <div className="flex flex-col gap-4">
          <span className="text-center font-bold">Удалить этот автомобиль?</span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Сама логика удаления
                api.delete(`cars/${id}/`)
                  .then(() => {
                    setCars(prev => prev.filter(car => car.id !== id));
                    toast.success("Автомобиль удален");
                  })
                  .catch(() => toast.error("Ошибка при удалении"));
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
            >
              Да, удалить
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
            >
              Отмена
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-center',
      });
    };

  return (
    <div className="max-w-[1440px] mx-auto p-6 md:p-10">
        <Helmet>
            <title>Панель управления | Drive Select</title>
        </Helmet>
      {/* Шапка */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 text-left">Личный кабинет</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 text-left">
            Сотрудник: <span className="text-blue-600">{username}</span>
          </p>
        </div>
        <button
          onClick={() => { localStorage.clear(); navigate('/'); }}
          className="bg-white border-2 border-red-50 text-red-500 px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          Выйти
        </button>
      </div>

      {/* Секция статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2 text-left">Авто в базе</p>
          <h3 className="text-4xl font-black text-left">{stats.total}</h3>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 text-left">Общая стоимость</p>
          <h3 className="text-2xl font-black text-gray-900 text-left">{stats.totalPrice.toLocaleString()} ₽</h3>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 text-left">Средняя цена</p>
          <h3 className="text-2xl font-black text-gray-900 text-left">{averagePrice.toLocaleString()} ₽</h3>
        </div>
        <div className="bg-gray-900 p-8 rounded-[32px] text-white shadow-xl shadow-gray-900/10">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 text-left">Самый дорогой лот</p>
          <h3 className="text-2xl font-black text-blue-400 text-left">{stats.maxPrice.toLocaleString()} ₽</h3>
        </div>
      </div>

      {/* Сетка управления: Левая панель + Таблица */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Левая панель управления */}
        <div className="lg:col-span-4 space-y-6">

          <div className="p-10 bg-white border-2 border-blue-600 rounded-[40px] shadow-lg shadow-blue-500/5">
            <h2 className="text-[10px] font-black mb-6 uppercase text-gray-400 tracking-[0.2em] text-left">

              Управление данными
            </h2>
            <button
              onClick={() => navigate('/add-car')}
              className="w-full bg-blue-600 text-white px-4 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-md"
            >
              + Добавить автомобиль
            </button>
          </div>

          <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">

                Сервер: Online
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">v 1.2.0</span>
          </div>
        </div>

        {/* Правая часть: Таблица с фиксированной высотой и скроллом */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden">
            {/* Контейнер скролла:
                max-h-[600px] — ограничивает высоту таблицы.
                overflow-y-auto — включает вертикальную прокрутку.
                scrollbar-thin — (опционально) делает полосу прокрутки аккуратнее в некоторых браузерах.
            */}
            <div className="max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse">
                {/* thead:
                    sticky top-0 — прибивает шапку к верху контейнера.
                    z-10 — чтобы шапка была поверх строк при скролле.
                */}
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="text-[10px] uppercase text-gray-400 border-b border-gray-50">
                    <th className="p-8 text-left font-black tracking-widest bg-white">Автомобиль</th>
                    <th className="p-8 text-right font-black tracking-widest bg-white">Цена</th>
                    <th className="p-8 text-center font-black tracking-widest bg-white">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-left">
                  {cars.length > 0 ? (
                    cars.map((car) => (
                      <tr
                        key={car.id}
                        onClick={() => navigate(`/car/${car.id}`)}
                        className="group hover:bg-gray-50/50 cursor-pointer transition-all"
                       >
                        <td className="p-8">
                          <div className="flex items-center gap-6">
                            <img
                              src={car.image || '/placeholder-car.png'}
                              className="w-24 h-16 object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-300"
                              alt="car"
                            />
                            <div>
                              <div className="font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase text-sm block mb-1">
                                {car.brand_display || car.brand}{' '}
                                {car.model_display || car.car_model_name}
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {car.year} Год
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-right">
                          <span className="font-black text-sm text-gray-900">
                            {Number(car.price).toLocaleString()} ₽
                          </span>
                        </td>
                        <td className="p-8">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit-car/${car.id}`);
                              }}
                              className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                              title="Редактировать"
                            >
                              ✎
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(car.id, e);
                              }}
                              className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                              title="Удалить"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                    ) : (
                    <tr>

                      <td
                        colSpan="3"
                        className="p-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest"
                      >
                        Автомобили не найдены
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;