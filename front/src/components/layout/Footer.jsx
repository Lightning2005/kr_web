import { Link } from 'react-router-dom';

function Footer() {
  // Проверяем наличие авторизации, чтобы скрыть/показать вход для персонала
  const isAuth = !!localStorage.getItem('userAuth');

  return (
    <footer className="bg-white border-t-2 border-gray-100 py-20 mt-20">
      {/* Контейнер 1440px для идеального выравнивания с шапкой и каталогом */}
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

          {/* Левая колонка: Брендинг */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600 uppercase">
              DRIVE<span className="text-gray-900">SELECT</span>
            </Link>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Курсовая работа • 2026
            </p>
          </div>

          {/* Центральная колонка: Навигация */}
          <div>
            <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">
              Навигация
            </h4>
            <ul className="space-y-3 text-[13px] font-medium uppercase tracking-tight">
              <li>
                <Link to="/catalog" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Каталог автомобилей
                </Link>
              </li>

              {/* Скрытая навигация: неброский цвет, чтобы не отвлекать */}
              <li>
                {!isAuth ? (
                  <Link to="/login" className="text-gray-300 hover:text-gray-600 transition-colors">
                    Вход для персонала
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-gray-300 hover:text-gray-600 transition-colors">
                    Панель управления
                  </Link>
                )}
              </li>
            </ul>
          </div>

          {/* Правая колонка: Поддержка */}
          <div>
            <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">
              Поддержка
            </h4>
            <p className="text-[13px] text-gray-400 font-medium">
              Служба поддержки: <span className="text-gray-600">8 (800) 555-35-35</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;