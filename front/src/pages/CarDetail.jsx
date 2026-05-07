import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Map2GIS from '../components/Map2GIS';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openGallery, setOpenGallery] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');

  // Состояние для связи основного слайдера и галереи миниатюр
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const isAdmin = !!localStorage.getItem('userAuth');

  useEffect(() => {
    api.get(`cars/${id}/?t=${Date.now()}`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading || !car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
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
      {car && (
        <Helmet>
          <title>
            {`${car.brand_display || car.brand} ${car.model_display || car.car_model_name} — Drive Select`}
          </title>
        </Helmet>
      )}

      {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/catalog')}
          className="text-[12px] font-black uppercase tracking-[0.2em] text-black   -600 hover:text-blue-600 transition-colors"
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
              onClick={() => {
                toast((t) => (
                  <div className="flex flex-col gap-4">
                    <span className="text-center font-bold">Удалить этот автомобиль?</span>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          toast.dismiss(t.id);
                          api.delete(`cars/${id}/`)
                            .then(() => {
                              toast.success("Автомобиль удалён");
                              navigate('/catalog');
                            })
                            .catch(() => toast.error("Ошибка при удалении"));
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                      >
                        Да, удалить
                      </button>
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ), {
                  duration: 5000,
                  position: 'top-center',
                });
              }}
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

          {/* Главный слайдер */}
          <div className="relative group mb-6">
            <Swiper
              spaceBetween={0}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[Navigation, Thumbs]}
              onSlideChange={(swiper) => setPhotoIndex(swiper.activeIndex)}
              className="w-full aspect-[16/10] rounded-[32px] overflow-hidden bg-gray-100 shadow-2xl"
            >
              {allPhotos.map((img, idx) => (
                <SwiperSlide key={idx} onClick={() => setOpenGallery(true)} className="cursor-zoom-in">
                  <img src={img} className="w-full h-full object-cover" alt={`Slide ${idx}`} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Кастомные кнопки переключения (как на референсе) */}
            <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:hidden text-slate-900 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:hidden text-slate-900 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {/* Галерея миниатюр (Thumbnails) */}
          <div className="px-1">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={12}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumbnails-slider !pb-4 cursor-grab active:cursor-grabbing"
              breakpoints={{
                640: { slidesPerView: 5 },
                1024: { slidesPerView: 5 }
              }}
            >
              {allPhotos.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className={`aspect-video rounded-2xl overflow-hidden transition-all duration-300 border-2 cursor-pointer
                      ${photoIndex === idx
                        ? 'border-blue-600 shadow-lg scale-[0.98]'
                        : 'border-transparent hover:border-blue-200'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Thumb" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: КАРТОЧКА */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tighter">
              {car.brand_display || car.brand} <span className="text-blue-600">{car.model_display || car.car_model_name || car.model_name}</span>
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
                { l: 'Марка', v: car.brand_display || car.brand },
                { l: 'Модель', v: car.model_display || car.model_name || car.car_model?.name },
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

      {/* КАРТА */}
      <div className="mt-10">
        <div className="text-center mb-6">
          <h3 className="text-xl font-black uppercase tracking-[0.4em] text-slate-900">Место осмотра</h3>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-2 rounded-full"></div>
        </div>
        <div className="h-[450px] w-full rounded-[40px] overflow-hidden border-[8px] border-white shadow-2xl shadow-gray-200 relative bg-gray-100">
          <Map2GIS
            address={car.address}
            city={car.city}
            hotelName={`${car.brand_display || car.brand} ${car.model_display || car.car_model_name}`}
          />
        </div>
      </div>

      {/* LIGHTBOX */}
      <Lightbox
        open={openGallery}
        close={() => setOpenGallery(false)}
        index={photoIndex}
        slides={slides}
        plugins={[Zoom]}
        plugins={[Zoom]}
        zoom={{
            maxZoomPixelRatio: 5,
            scrollToZoom: true,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveStep: 50,
        }}
      />
    </div>
  );
}

export default CarDetail;