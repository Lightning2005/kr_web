import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem('userAuth');

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600">
          DRIVE<span className="text-gray-900">SELECT</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link to="/" className="font-medium hover:text-blue-600 transition-colors">Каталог</Link>

          {/* Кнопка видна ТОЛЬКО если пользователь вошел */}
          {isAuth && (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-transform active:scale-95"
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