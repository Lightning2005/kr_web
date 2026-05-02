import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openGallery, setOpenGallery] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const navigate = useNavigate();

  // Обновленная логика проверки админа по требованию бэкенда
  const isAdmin = localStorage.getItem('access') && localStorage.getItem('is_staff') === 'true';

  useEffect(() => {
    // Добавляем timestamp к запросу, чтобы браузер не брал старые фото из кэша
    api.get(`cars/${id}/?t=${Date.now()}`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка:", err);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить этот автомобиль?")) {
      api.delete(`cars/${id}/`)
        .then(() => navigate('/catalog'))
        .catch(err => alert("Ошибка при удалении"));
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse">Загрузка данных...</div>;
  if (!car) return <div className="p-20 text-center font-black uppercase tracking-widest text-red-500">Автомобиль не найден</div>;

  // Собираем все фото в один массив для слайдера
  const allPhotos = [car.image, ...car.images.map(img => img.image)].filter(Boolean);
  const slides = allPhotos.map(src => ({ src }));

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-4 pb-32">

      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate('/catalog')}
          className="group flex items-center gap-3 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 hover:text-blue-600 transition-all"
        >
          <span className="text-xl group-hover:-translate-x-2 transition-transform">←</span> Назад в каталог
        </button>

        {isAdmin && (
          <div className="flex gap-2 p-1.5 bg-gray-900 rounded-[20px] shadow-2xl">
            <button
              onClick={() => navigate(`/edit-car/${id}`)}
              className="text-white px-6 py-3 rounded-[14px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all"
            >
              Редактировать
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 px-6 py-3 rounded-[14px] font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all"
            >
              Удалить
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        {/* ГАЛЕРЕЯ (7 КОЛОНОК) */}
        <div className="lg:col-span-7 space-y-6">
          <div
            onClick={() => { setPhotoIndex(0); setOpenGallery(true); }}
            className="w-full h-[600px] cursor-zoom-in overflow-hidden rounded-[40px] bg-gray-100 group relative shadow-2xl shadow-gray-200"
          >
            <img src={car.image} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all pointer-events-none"></div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {car.images.slice(0, 4).map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => { setPhotoIndex(idx + 1); setOpenGallery(true); }}
                className="h-[140px] cursor-zoom-in overflow-hidden rounded-[24px] bg-gray-100 group relative border-4 border-transparent hover:border-blue-600 transition-all shadow-lg"
              >
                <img src={photo.image} alt="thumb" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {idx === 3 && car.images.length > 4 && (
                  <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center text-white text-xs font-black uppercase backdrop-blur-sm">
                    Еще +{car.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ИНФОРМАЦИЯ (5 КОЛОНОК) */}
        <div className="lg:col-span-5 sticky top-10">
          <div className="mb-10">
             <span className="bg-blue-50 text-blue-600 font-black uppercase tracking-[0.3em] text-[9px] px-4 py-2 rounded-full">DriveSelect Certified</span>
             <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tighter leading-[0.9] mt-6">
                {car.brand} <br />
                <span className="text-gray-300">{car.model_name}</span>
             </h1>
             <div className="flex gap-4 mt-6">
                <p className="bg-gray-900 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px]">
                  {car.year} год
                </p>
                <p className="border-2 border-gray-100 px-4 py-2 rounded-xl font-black text-gray-400 uppercase tracking-widest text-[10px]">
                  {car.mileage?.toLocaleString()} км
                </p>
             </div>
          </div>

          <div className="bg-gray-50 rounded-[40px] p-10 mb-10 border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Цена</span>
                <p className="text-5xl font-black text-gray-900 tracking-tighter">
                  {Number(car.price).toLocaleString()} <span className="text-blue-600">₽</span>
                </p>
             </div>
             <button className="w-full bg-blue-600 text-white py-6 rounded-[24px] font-black uppercase text-[12px] tracking-[0.2em] hover:bg-gray-900 transition-all shadow-2xl shadow-blue-500/20 active:scale-95 mb-6">
                Оформить покупку
             </button>
             <div className="text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Кредит без первого взноса</p>
                <p className="text-blue-600 font-black text-lg">от 14 200 ₽ / мес.</p>
             </div>
          </div>

          <div className="space-y-4 px-4">
            <h3 className="font-black uppercase text-[11px] tracking-widest text-gray-900 mb-6 flex items-center gap-4">
               Характеристики <div className="h-[2px] flex-1 bg-gray-100"></div>
            </h3>
            {[
              { label: 'Производитель', value: car.brand },
              { label: 'Модель', value: car.model_name },
              { label: 'Год выпуска', value: car.year },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4">
                <span className="text-gray-400 font-black uppercase text-[9px] tracking-widest">{item.label}</span>
                <span className="font-black text-gray-900 uppercase text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Lightbox
        open={openGallery}
        close={() => setOpenGallery(false)}
        index={photoIndex}
        slides={slides}
        plugins={[Zoom]}
      />
    </div>
  );
}

export default CarDetail;