import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  // Проверка авторизации (в твоем случае — наличие суперпользователя)
  const isAuth = !!localStorage.getItem('userAuth');

  return (
    <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-50">
      {/* Увеличили max-width до 1440px и высоту до h-24 */}
      <div className="max-w-[1440px] mx-auto px-10 h-24 flex items-center justify-between">

        {/* Логотип: увеличили размер и межбуквенное расстояние */}
        <Link to="/" className="text-3xl font-black tracking-tighter text-blue-600 uppercase">
          DRIVE<span className="text-gray-900">SELECT</span>
        </Link>

        <nav className="flex items-center gap-12">
          {/* Пункты меню: сделали жирнее и крупнее */}
          <Link
            to="/catalog"
            className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-blue-600 transition-colors"
          >
            Каталог
          </Link>

          {/* Панель управления: больше отступов и жирный шрифт */}
          {isAuth && (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              Панель управления
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;