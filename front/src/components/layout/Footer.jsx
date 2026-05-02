import { Link } from 'react-router-dom';

function Footer() {
  // Добавляем проверку авторизации и сюда
  const isAuth = !!localStorage.getItem('userAuth');

  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Левая колонка */}
          <div className="space-y-4">
            <Link to="/" className="text-xl font-black tracking-tighter text-blue-600">
              DRIVE<span className="text-gray-900">SELECT</span>
            </Link>
            <p className="text-gray-500 text-sm">Курсовая работа • 2026</p>
          </div>

          {/* Центральная колонка (Навигация) */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Навигация</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-blue-600">Каталог автомобилей</Link></li>

              {/* Если НЕ авторизован — показываем вход */}
              {!isAuth ? (
                <li><Link to="/login" className="hover:text-blue-600">Вход для персонала</Link></li>
              ) : (
                <li><Link to="/dashboard" className="hover:text-blue-600 font-bold text-blue-600">Панель управления</Link></li>
              )}
            </ul>
          </div>

          {/* Правая колонка */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Поддержка</h4>
            <p className="text-sm text-gray-500 italic">Служба поддержки: 8 (800) 555-35-35</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;