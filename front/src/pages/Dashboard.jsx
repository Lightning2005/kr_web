import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const authData = localStorage.getItem('userAuth');

  if (!authData) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-xl mb-4">Доступ только для персонала</h1>
        <button onClick={() => navigate('/login')} className="text-blue-600 underline">
          Перейти ко входу
        </button>
      </div>
    );
  }

  const username = atob(authData).split(':')[0];

  return (
    <div className="max-w-[1200px] mx-auto p-10">
      <div className="border-b pb-6 mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Личный кабинет</h1>
          <p className="text-gray-500">Сотрудник: {username}</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('userAuth');
            window.location.href = '/';
          }}
          className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition-colors"
        >
          Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border-2 border-blue-100 rounded-3xl text-center bg-white shadow-sm">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-tight">Управление каталогом</h2>
          <button
            onClick={() => navigate('/add-car')}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black hover:bg-blue-700 transition-transform active:scale-95"
          >
            + ДОБАВИТЬ АВТОМОБИЛЬ
          </button>
        </div>

        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-tight">Статус системы</h2>
          <ul className="text-sm space-y-3">
            <li className="flex items-center gap-2">
              <span className="text-green-500">●</span> Связь с API: Установлена
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">●</span> Роль: Администратор
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;