import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { YMaps, Map, Placemark, RouteButton } from '@pbe/react-yandex-maps';

function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState([55.751574, 37.573856]);
  const [openGallery, setOpenGallery] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');
  const navigate = useNavigate();

  const isAdmin = !!localStorage.getItem('userAuth');

  useEffect(() => {
    api.get(`cars/${id}/?t=${Date.now()}`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
        if (res.data.address) geocodeAddress(res.data.address);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const geocodeAddress = (address) => {
    fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=88726589-d978-43f1-9494-0130f40d6542&format=json&geocode=${encodeURIComponent(address)}`)
      .then(res => res.json())
      .then(data => {
        const pos = data.response.GeoObjectCollection.featureMember[0]?.GeoObject?.Point?.pos;
        if (pos) {
          const [lon, lat] = pos.split(' ').map(Number);
          setCoords([lat, lon]);
        }
      });
  };

  if (loading || !car) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          {/* Пульсирующий логотип или кружок */}
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
            Синхронизация данных...
          </div>
        </div>
      );
    }
  const allPhotos = [car.image, ...car.images.map(img => img.image)].filter(Boolean);
  const slides = allPhotos.map(src => ({ src }));

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">

      {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/catalog')}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
        >
          ← Назад в каталог
        </button>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit-car/${id}`)}
              className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
            >
              Редактировать
            </button>
            <button
              onClick={() => { if(window.confirm("Удалить этот автомобиль?")) api.delete(`cars/${id}/`).then(() => navigate('/catalog')) }}
              className="px-6 py-2.5 border-2 border-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all"
            >
              Удалить
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

        {/* ЛЕВАЯ ЧАСТЬ: ГАЛЕРЕЯ */}
        <div className="lg:col-span-2">
          <div
            onClick={() => { setPhotoIndex(0); setOpenGallery(true); }}
            className="w-full aspect-[16/10] rounded-[32px] overflow-hidden cursor-zoom-in bg-gray-100 shadow-2xl"
          >
            <img src={car.image} className="w-full h-full object-cover" alt="Main" />
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            {allPhotos.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                onClick={() => { setPhotoIndex(idx + 1); setOpenGallery(true); }}
                className="aspect-video rounded-2xl overflow-hidden cursor-pointer hover:ring-4 ring-blue-600/20 transition-all border border-gray-100 shadow-md"
              >
                <img src={img} className="w-full h-full object-cover" alt="Thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: КАРТОЧКА */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tighter">
              {car.brand} <span className="text-blue-600">{car.model_name || car.car_model?.name}</span>
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-8">{car.year} год выпуска</p>

            <div className="mb-10">
               <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest block mb-1">Стоимость</span>
               <div className="text-5xl font-black text-slate-900 tracking-tighter">
                 {Number(car.price).toLocaleString()} <span className="text-blue-600 text-3xl">₽</span>
               </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20">
                Оставить заявку
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
               <div>
                  <span className="text-[9px] font-black text-gray-300 uppercase block mb-1">Пробег</span>
                  <span className="text-sm font-black text-slate-700">{car.mileage?.toLocaleString()} км</span>
               </div>
               <div>
                  <span className="text-[9px] font-black text-gray-300 uppercase block mb-1">Город</span>
                  <span className="text-sm font-black text-slate-700">{car.city || car.address?.split(',')[0] || 'Москва'}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ТАБЫ */}
      <div className="mt-10">
        <div className="flex gap-10 border-b border-gray-100 mb-8">
          {[
            { id: 'specs', label: 'Характеристики' },
            { id: 'description', label: 'Описание' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[12px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'}`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>

        <div className="max-w-4xl">
          {activeTab === 'specs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
               {[
                 { l: 'Марка', v: car.brand },
                 { l: 'Модель', v: car.model_name || car.car_model?.name },
                 { l: 'Год выпуска', v: car.year },
                 { l: 'Пробег', v: `${car.mileage?.toLocaleString()} км` },
                 { l: 'Город', v: car.city },
                 { l: 'Адрес осмотра', v: car.address },
                 { l: 'Тип продавца', v: 'Автосалон' },
               ].map((s, i) => (
                 <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{s.l}</span>
                    <span className="text-slate-900 text-[11px] font-black uppercase">{s.v}</span>
                 </div>
               ))}
            </div>
          ) : (
            <div className="prose prose-slate max-w-none pb-4">
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line font-medium">
                {car.description || "Информация уточняется."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* КАРТА МЕСТОПОЛОЖЕНИЯ - ИСПРАВЛЕНО ДЛЯ ЗАПОЛНЕНИЯ БЛОКА */}
      <div className="mt-10">
         <div className="text-center mb-6">
            <h3 className="text-xl font-black uppercase tracking-[0.4em] text-slate-900">Место осмотра</h3>
            <div className="h-1 w-16 bg-blue-600 mx-auto mt-2 rounded-full"></div>
         </div>
         {/* Контейнер карты с фиксированной высотой и overflow-hidden */}
         <div className="h-[450px] w-full rounded-[40px] overflow-hidden border-[8px] border-white shadow-2xl shadow-gray-200 relative bg-gray-100">
            <YMaps>
              <Map
                state={{ center: coords, zoom: 15 }}
                width="100%"
                height="100%"
                className="w-full h-full absolute inset-0"
                options={{
                  autoFitToViewport: 'always', // Помогает карте адаптироваться к размеру
                }}
              >
                <Placemark geometry={coords} />
                <RouteButton options={{ float: 'right' }} />
              </Map>
            </YMaps>
         </div>
      </div>

      <Lightbox open={openGallery} close={() => setOpenGallery(false)} index={photoIndex} slides={slides} plugins={[Zoom]} />
    </div>
  );
}

export default CarDetail;