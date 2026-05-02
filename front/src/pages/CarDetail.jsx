import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CarDetail() {
  const { id } = useParams(); // Достаем ID из пути /car/:id
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Запрос данных конкретной машины
    axios.get(`http://127.0.0.1:8000/api/cars/${id}/`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка при загрузке авто:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center">Загрузка...</div>;
  if (!car) return <div className="p-10 text-center">Автомобиль не найден</div>;

  // Объединяем фото для галереи
  const allPhotos = car ? [car.image, ...car.images.map(img => img.image)] : [];

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      {/* Кнопка назад */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:underline flex items-center gap-2"
      >
        ← Назад в каталог
      </button>

      {/* Заголовок и Цена */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase">
            {car.brand} {car.model_name}
          </h1>
          <p className="text-gray-500 text-lg">{car.year} г. • {car.mileage?.toLocaleString()} км</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-blue-600">{Number(car.price).toLocaleString()} ₽</p>
          <button className="mt-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Купить в кредит
          </button>
        </div>
      </div>

      {/* Галерея плиткой (как на референсе) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {allPhotos.map((photo, idx) => (
          <div key={idx} className={`relative overflow-hidden rounded-2xl bg-gray-100 ${idx === 0 ? 'md:col-span-2 md:row-span-2 h-[500px]' : 'h-[240px]'}`}>
            <img
              src={photo}
              alt={`${car.brand} ${idx}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Характеристики */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Характеристики</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          {[
            { label: 'Марка', value: car.brand },
            { label: 'Модель', value: car.model_name },
            { label: 'Год выпуска', value: car.year },
            { label: 'Пробег', value: `${car.mileage?.toLocaleString()} км` },
            // Сюда можно добавить больше полей из твоего бэкенда
          ].map((item, i) => (
            <div key={i} className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarDetail;