import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CarCard from '../components/CarCard';

function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const brands = ['Lada (ВАЗ)', 'Nissan', 'Toyota', 'BMW', 'Mercedes-Benz', 'Hyundai', 'Kia', 'Ford'];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/cars/')
      .then(res => setFeaturedCars(res.data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative h-[650px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <img
          src="/images/bmw_5_1.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center"
          alt="BMW 5 Series"
        />
        <div className="relative z-20 max-w-[1200px] mx-auto px-6 h-full flex flex-col justify-center items-start">
          <h1 className="text-7xl font-black text-white mb-6 leading-tight uppercase italic tracking-tighter">
            Твой стиль. <br /> Твой драйв. <br /> Твой <span className="text-blue-600">SELECT.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-lg">
            Премиальный сервис подбора автомобилей с пробегом. <br />
            Только проверенные дилеры и прозрачные сделки.
          </p>
          <Link to="/catalog" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 transform hover:-translate-y-1">
            Открыть каталог
          </Link>
        </div>
      </section>

      {/* БРЕНДЫ */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map(brand => (
              <button key={brand} className="py-2 px-6 border border-gray-100 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all font-bold text-gray-500 text-sm">
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { title: "Проверка по 250 пунктам", desc: "Гарантируем идеальное техническое состояние", icon: "🛡️" },
            { title: "Юридическая чистота", desc: "Никаких залогов, штрафов и серых схем", icon: "💎" },
            { title: "Онлайн бронирование", desc: "Зарезервируй свой автомобиль в один клик", icon: "📱" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-2xl font-black mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* НОВИНКИ */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl font-black uppercase tracking-tighter">Свежий привоз</h2>
              <div className="h-1.5 w-24 bg-blue-600 mt-4"></div>
            </div>
            <Link to="/catalog" className="group text-lg font-bold flex items-center gap-2">
              Весь каталог
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;