import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Используем наш настроенный api с JWT
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
        .then(() => navigate('/'))
        .catch(err => alert("Ошибка при удалении"));
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Загрузка...</div>;
  if (!car) return <div className="p-20 text-center font-bold">Автомобиль не найден</div>;

  const allPhotos = [car.image, ...car.images.map(img => img.image)].filter(Boolean);
  const slides = allPhotos.map(src => ({ src }));

  return (
    <div className="max-w-[1200px] mx-auto p-6 pb-20">
      <button onClick={() => navigate('/')} className="mb-8 text-gray-400 hover:text-blue-600 flex items-center gap-2 font-bold uppercase text-xs tracking-widest transition-colors">
        ← Назад в каталог
      </button>

      {/* Админ-панель на странице авто */}
      {isAdmin && (
        <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-center">
          <span className="text-blue-600 font-black text-xs uppercase ml-2">Управление:</span>
          <button
            onClick={() => navigate(`/edit-car/${id}`)}
            className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-600 hover:text-white transition-all"
          >
            Изменить данные
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
          >
            Удалить авто
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">
            {car.brand} {car.model_name}
          </h1>
          <p className="text-gray-400 text-xl font-medium">{car.year} г. • {car.mileage?.toLocaleString()} км</p>
        </div>
        <div className="text-left md:text-right w-full md:w-auto">
          <p className="text-4xl font-black text-blue-600 mb-3">{Number(car.price).toLocaleString()} ₽</p>
          <button className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wide hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            Забронировать
          </button>
        </div>
      </div>

      {/* Сетка галереи */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {allPhotos.slice(0, 3).map((photo, idx) => (
          <div
            key={idx}
            onClick={() => { setPhotoIndex(idx); setOpenGallery(true); }}
            className={`cursor-zoom-in relative overflow-hidden rounded-3xl bg-gray-100 shadow-sm group ${idx === 0 ? 'md:col-span-2 md:row-span-2 h-[400px] md:h-[600px]' : 'h-[290px]'}`}
          >
            <img src={photo} alt="car" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            {idx === 2 && allPhotos.length > 3 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black text-2xl">
                +{allPhotos.length - 3} ФОТО
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Лайтбокс для просмотра */}
      <Lightbox
        open={openGallery}
        close={() => setOpenGallery(false)}
        index={photoIndex}
        slides={slides}
        plugins={[Zoom]}
        zoom={{
            maxZoomPixelRatio: 5, // Увеличивает в 5 раз от оригинального размера (было 1)
            scrollToZoom: true,   // Позволяет зумить колесиком мыши
            doubleTapDelay: 300,  // Задержка для двойного клика (зум по клику)
            doubleClickDelay: 300,
            doubleClickMaxStops: 2, // Сколько шагов зума при двойном клике
            keyboardMoveStep: 50,   // Шаг перемещения стрелками в зуме
            }}
      />

      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-black uppercase mb-8 tracking-tight text-gray-900">Характеристики</h2>
          <div className="space-y-4">
            {[
              { label: 'Марка', value: car.brand },
              { label: 'Модель', value: car.model_name },
              { label: 'Год выпуска', value: car.year },
              { label: 'Пробег', value: `${car.mileage?.toLocaleString()} км` },
            ].map((item, i) => (
              <div key={i} className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{item.label}</span>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col justify-center">
            <h3 className="font-black uppercase text-sm mb-2 text-blue-600">Особое предложение</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">Этот {car.brand} прошел полную техническую проверку по 140 пунктам. Доступна мгновенная бронь через сайт.</p>
        </div>
      </div>
    </div>
  );
}

export default CarDetail;