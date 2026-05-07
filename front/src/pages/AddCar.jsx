import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

function AddCar() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: '',
    car_model: '',
    year: '',
    price: '',
    mileage: '',
    city: '',
    address: '',
    description: ''
  });
  const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // ВАЖНО: используем ключи, которые прописали в сериализаторе
        data.append('brand', formData.brand);
        data.append('car_model_name', formData.car_model); // поменяли ключ на car_model_name

        data.append('year', parseInt(formData.year));
        data.append('price', parseFloat(formData.price));
        data.append('mileage', parseInt(formData.mileage));
        data.append('city', formData.city);
        data.append('address', formData.address);
        data.append('description', formData.description);

        if (image) data.append('image', image);

        try {
          await api.post('cars/', data);
          toast.success('Успешно опубликовано!');
          navigate('/dashboard');
        } catch (err) {
          console.error("Server Response:", err.response?.data);
          toast.error('Ошибка: ' + JSON.stringify(err.response?.data));
        }
      };

  return (
    <div className="max-w-[900px] mx-auto p-6 md:p-10 pb-24">
        <Helmet>
            <title>Новое объявление | Drive Select</title>
        </Helmet>

      <div className="text-center mb-12">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-black uppercase text-[12px] tracking-widest mb-4 hover:underline transition-all"
        >
          ← Назад в панель управления
        </button>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-gray-900">Новое объявление</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 md:p-16 rounded-[60px] shadow-2xl shadow-blue-500/5 space-y-10 mb-16">

        {/* МАРКА И МОДЕЛЬ (ТЕКСТОВЫЕ ПОЛЯ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Марка автомобиля</label>
            <input
              type="text"
              placeholder="Например: Ford"
              className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 transition-all text-gray-700"
              required
              value={formData.brand}
              onChange={e => setFormData({...formData, brand: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Модель</label>
            <input
              type="text"
              placeholder="Например: Focus"
              className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 transition-all text-gray-700"
              required
              value={formData.car_model}
              onChange={e => setFormData({...formData, car_model: e.target.value})}
            />
          </div>
        </div>

        {/* ЧИСЛОВЫЕ ПОЛЯ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Год выпуска</label>
            <input type="number" placeholder="2024" className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 transition-all" required
              value={formData.year}
              onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Пробег (км)</label>
            <input type="number" placeholder="0" className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 transition-all" required
              value={formData.mileage}
              onChange={e => setFormData({...formData, mileage: e.target.value})} />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Цена (₽)</label>
            <input type="number" placeholder="0" className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold text-blue-600 focus:bg-white focus:border-blue-600 transition-all" required
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
        </div>

        {/* ГОРОД И АДРЕС */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Город</label>
            <input type="text" placeholder="Ростов-на-Дону" className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 transition-all" required
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Адрес осмотра</label>
            <input type="text" placeholder="Вавилова 59E" className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 transition-all" required
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
        </div>

        {/* ОПИСАНИЕ */}
        <div className="space-y-3 text-left">
          <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Описание автомобиля</label>
          <textarea
            rows="5"
            placeholder=""
            className="w-full bg-gray-50 border-2 border-transparent rounded-[32px] p-6 font-medium text-gray-700 focus:bg-white focus:border-blue-600 transition-all resize-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* ФОТО */}
        <div className="space-y-3 text-left">
          <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Основная фотография</label>
          <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[40px] p-10 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group overflow-hidden">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              required
              onChange={e => setImage(e.target.files[0])}
            />
            <div className="text-center relative z-10">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-3 mx-auto group-hover:scale-110 transition-all">
                📸
              </div>
              <p className="text-sm font-black text-gray-800 uppercase">
                {image ? image.name : "Выберите файл"}
              </p>
            </div>
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-7 rounded-[32px] font-black uppercase text-sm tracking-[0.2em] hover:bg-blue-700 active:scale-[0.97] transition-all shadow-2xl shadow-blue-500/40">
          Опубликовать объявление
        </button>
      </form>
    </div>
  );
}

export default AddCar;