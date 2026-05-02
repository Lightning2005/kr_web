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

  const isAdmin = !!localStorage.getItem('access');

  useEffect(() => {
    api.get(`cars/${id}/`)
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

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest animate-pulse">Загрузка...</div>;
  if (!car) return <div className="p-20 text-center font-black uppercase tracking-widest text-red-500">Автомобиль не найден</div>;

  const allPhotos = [car.image, ...car.images.map(img => img.image)].filter(Boolean);
  const slides = allPhotos.map(src => ({ src }));

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-4 pb-32">

      {/* КНОПКА НАЗАД И АДМИНКА (В ОДНУ СТРОКУ) */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/catalog')}
          className="group flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all"
        >
          <span className="text-lg">←</span> Назад
        </button>

        {isAdmin && (
          <div className="flex gap-2 p-1 bg-gray-900 rounded-xl shadow-lg">
            <button onClick={() => navigate(`/edit-car/${id}`)} className="text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all">Редактировать</button>
            <button onClick={handleDelete} className="text-red-500 px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-red-500/10 transition-all">Удалить</button>
          </div>
        )}
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ: ДВЕ КОЛОНКИ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* ЛЕВАЯ КОЛОНКА: ГАЛЕРЕЯ */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onClick={() => { setPhotoIndex(0); setOpenGallery(true); }}
            className="w-full h-[500px] cursor-zoom-in overflow-hidden rounded-[32px] bg-gray-100 group relative shadow-2xl shadow-gray-200"
          >
            <img src={allPhotos[0]} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {allPhotos.slice(1, 5).map((photo, idx) => (
              <div
                key={idx + 1}
                onClick={() => { setPhotoIndex(idx + 1); setOpenGallery(true); }}
                className="h-[120px] cursor-zoom-in overflow-hidden rounded-2xl bg-gray-100 group relative border-2 border-transparent hover:border-blue-600 transition-all"
              >
                <img src={photo} alt="thumb" className="w-full h-full object-cover" />
                {idx === 3 && allPhotos.length > 5 && (
                  <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center text-white text-xs font-black uppercase backdrop-blur-sm">
                    +{allPhotos.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: ИНФО */}
        <div className="lg:col-span-5 sticky top-8">
          <div className="flex flex-col gap-2 mb-6">
             <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">В наличии</span>
             <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                {car.brand} <span className="text-gray-300">{car.model_name}</span>
             </h1>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
                {car.year} год • {car.mileage?.toLocaleString()} км
             </p>
          </div>

          <div className="bg-gray-50 rounded-[32px] p-8 mb-8 border border-gray-100">
             <div className="flex justify-between items-end mb-6">
                <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Цена автомобиля</span>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">
                  {Number(car.price).toLocaleString()} <span className="text-blue-600">₽</span>
                </p>
             </div>
             <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-blue-500/20 active:scale-95 mb-4">
                Забронировать сейчас
             </button>
             <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">Кредит от 15 400 ₽ / мес.</p>
          </div>

          {/* ХАРАКТЕРИСТИКИ */}
          <div className="space-y-4 px-2">
            <h3 className="font-black uppercase text-[11px] tracking-widest text-gray-900 mb-6 flex items-center gap-3">
               Параметры <div className="h-[2px] flex-1 bg-gray-100"></div>
            </h3>
            {[
              { label: 'Марка', value: car.brand },
              { label: 'Модель', value: car.model_name },
              { label: 'Год выпуска', value: car.year },
              { label: 'Пробег', value: `${car.mileage?.toLocaleString()} км` },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-black uppercase text-[9px] tracking-widest">{item.label}</span>
                <span className="font-black text-gray-900 uppercase">{item.value}</span>
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