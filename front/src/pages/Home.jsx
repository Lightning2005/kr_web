import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CarCard from '../components/CarCard';
import { Helmet } from 'react-helmet-async';

function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const brands = ['Lada (ВАЗ)', 'Nissan', 'Toyota', 'BMW', 'Mercedes-Benz', 'Hyundai', 'Kia', 'Ford'];

  useEffect(() => {
    api.get('cars/')
      .then(res => {
        const data = res.data.results || res.data;
        if (Array.isArray(data)) {
          setFeaturedCars(data.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка на главной:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col bg-white">
        <Helmet>
            <title>Drive Select — Твой стиль, твой драйв</title>
        </Helmet>
      {/* ГЛАВНЫЙ ЭКРАН — Больше конкретики, меньше пафоса */}
      <section className="relative h-[700px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"/>
        <img
          src="/images/bmw_5_1.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center"
          alt="Автомобиль"
        />
        <div className="relative z-20 max-w-[1440px] mx-auto px-10 h-full flex flex-col justify-center items-start">
          <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-[0.9] uppercase tracking-tighter">
            Твой стиль. <br /> Твой драйв. <br /> Твой <span className="text-blue-600">ВЫБОР.</span>
          </h1>
          <p className="text-2xl text-gray-200 mb-10 max-w-2xl font-bold italic">
            Надёжный сервис подбора автомобилей с пробегом. <br />
            Честная история и полная техническая диагностика.
          </p>
          <Link to="/catalog" className="bg-blue-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95">
            Перейти в каталог
          </Link>
        </div>
      </section>

      {/* ВЫБОР МАРКИ — Теперь кнопки рабочие и ведут в каталог */}
        <section className="py-16 bg-gray-50 border-b">
          <div className="max-w-[1440px] mx-auto px-10">
            <h2 className="text-center text-black-600 font-black uppercase tracking-widest mb-10 text-sm">Популярные марки</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {brands.map(brand => (
                <Link
                  key={brand}
                  to={`/catalog?brand_name=${brand}`}
                  className="group flex flex-col items-center justify-center bg-white border border-gray-200 p-6 rounded-2xl min-w-[140px] hover:border-blue-600 hover:shadow-lg transition-all active:scale-95"
                >
                <div className="w-12 h-12 mb-3 flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <img
                      // Мы берем название бренда, переводим в нижний регистр
                      // и берем только первое слово до пробела или дефиса
                      src={`/images/${brand.toLowerCase().split(/[ (/-]/)[0]}.svg`}
                      alt={brand}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        // Если картинка вдруг не найдется, заменяем её на первую букву
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                </div>
                <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {brand}
                </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      {/* ПРЕИМУЩЕСТВА — Крупные блоки, понятные иконки */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Честная проверка", desc: "Проверяем каждый автомобиль по 250 пунктам перед продажей.", icon: "✅" },
              { title: "Чистые документы", desc: "Никаких залогов, штрафов и проблем с регистрацией.", icon: "📄" },
              { title: "Быстрое оформление", desc: "Забронируйте авто онлайн и заберите его в тот же день.", icon: "⚡" }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-12 rounded-[32px] border-2 border-gray-100 hover:border-blue-200 transition-all group">
                <div className="text-6xl mb-8">{item.icon}</div>
                <h3 className="text-3xl font-black uppercase mb-4 text-gray-900">{item.title}</h3>
                <p className="text-xl text-gray-600 font-semibold leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* НОВИНКИ — Мощные заголовки и понятные ссылки */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex justify-between items-center mb-16 border-b-4 border-gray-900 pb-8">
            <h2 className="text-6xl font-black uppercase tracking-tighter text-gray-900">Новые поступления</h2>
            <Link to="/catalog" className="bg-gray-900 text-white py-4 px-8 rounded-xl font-black uppercase text-sm hover:bg-blue-600 transition-colors">
              Смотреть все →
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-4 gap-8">
               {[1,2,3,4].map(n => <div key={n} className="h-[450px] bg-gray-100 rounded-[32px] animate-pulse" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;