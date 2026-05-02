import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const authData = localStorage.getItem('userAuth');
  const token = localStorage.getItem('access');

  useEffect(() => {
    // Если токена нет совсем, сразу отправляем на логин
    if (!token) {
      navigate('/login');
      return;
    }

    api.get('cars/')
      .then(res => {
        // Учитываем пагинацию Django (поле results)
        const data = res.data.results || res.data;
        if (Array.isArray(data)) {
          setCars(data);
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

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Вы уверены, что хотите удалить этот автомобиль?")) {
      api.delete(`cars/${id}/`)
        .then(() => {
          setCars(cars.filter(car => car.id !== id));
        })
        .catch((err) => {
          console.error("Ошибка удаления:", err.response);
          alert(err.response?.status === 403 ? "У вас нет прав на это действие" : "Ошибка при удалении");
        });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-10">
      {/* Шапка кабинета */}
      <div className="border-b pb-6 mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Личный кабинет</h1>
          <p className="text-gray-500 font-medium">Сотрудник: <span className="text-blue-600 font-bold">{username}</span></p>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
        >
          Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Боковая панель */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 border-2 border-blue-50 rounded-3xl text-center bg-white">
            <h2 className="text-xs font-black mb-4 uppercase text-gray-400 tracking-widest">Действия</h2>
            <button
              onClick={() => navigate('/add-car')}
              className="w-full bg-blue-600 text-white px-4 py-4 rounded-xl font-black hover:bg-blue-700 transition-transform active:scale-95 shadow-lg shadow-blue-500/20"
            >
              + ДОБАВИТЬ АВТО
            </button>
          </div>

          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
            <h2 className="text-xs font-black mb-4 uppercase text-gray-400 tracking-widest">Статус системы</h2>
            <ul className="text-sm space-y-3 font-bold">
              <li className="flex items-center gap-2">
                <span className="text-green-500">●</span> Связь с API: <span className="text-gray-900">OK</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">●</span> Роль: <span className="text-gray-900">Администратор</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Таблица */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b bg-gray-50/50">
              <h2 className="font-black uppercase text-xs tracking-widest text-gray-500">Управление объявлениями</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase text-gray-400 border-b border-gray-50">
                    <th className="p-6 font-black">Фото</th>
                    <th className="p-6 font-black">Модель</th>
                    <th className="p-6 font-black text-right">Цена</th>
                    <th className="p-6 font-black text-center">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cars.length > 0 ? cars.map(car => (
                    <tr key={car.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <img
                          src={car.image || '/placeholder-car.png'}
                          className="w-20 h-12 object-cover rounded-lg shadow-sm border border-gray-100"
                          alt="car"
                        />
                      </td>
                      <td className="p-6">
                        <Link to={`/car/${car.id}`} className="font-black text-gray-900 hover:text-blue-600 transition-colors uppercase text-sm">
                          {car.brand} {car.model_name}
                        </Link>
                        <p className="text-xs font-bold text-gray-400 mt-1">{car.year} г. в.</p>
                      </td>
                      <td className="p-6 text-right font-black text-sm text-gray-900">
                        {Number(car.price).toLocaleString()} ₽
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => navigate(`/edit-car/${car.id}`)}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Редактировать"
                          >
                             ✎
                          </button>
                          <button
                            onClick={(e) => handleDelete(car.id, e)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Удалить"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                        Список автомобилей пуст
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