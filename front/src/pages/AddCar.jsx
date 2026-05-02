import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AddCar() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    car_model: '',
    year: '',
    price: '',
    mileage: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    api.get('brands/')
      .then(res => {
        const data = res.data.results || res.data;
        setBrands(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки брендов:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      api.get(`carmodels/?brand=${selectedBrand}`)
        .then(res => {
          const data = res.data.results || res.data;
          setModels(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error("Ошибка загрузки моделей:", err));
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = localStorage.getItem('userAuth');
    const data = new FormData();
    data.append('car_model', parseInt(formData.car_model));
    data.append('year', parseInt(formData.year));
    data.append('price', parseFloat(formData.price));
    data.append('mileage', parseInt(formData.mileage));
    if (image) data.append('image', image);

    try {
      await api.post('cars/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Basic ${authData}`
        }
      });
      alert('Успешно опубликовано!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Server Response:", err.response?.data);
      alert('Ошибка при добавлении.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="font-black uppercase tracking-widest text-gray-400">Загрузка...</p>
    </div>
  );

  return (
    /* Добавили pb-24 чтобы футер не обрезался и контент дышал */
    <div className="max-w-[900px] mx-auto p-6 md:p-10 pb-24">

      <div className="text-center mb-12">
        <button onClick={() => navigate(-1)} className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-4 hover:underline transition-all">
          ← Назад в панель управления
        </button>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-gray-900">Новое объявление</h1>
      </div>

      {/* Основная форма */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 md:p-16 rounded-[60px] shadow-2xl shadow-blue-500/5 space-y-12 mb-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4 text-left">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Марка автомобиля</label>
            <select
              className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 focus:ring-0 transition-all cursor-pointer appearance-none text-gray-700"
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setFormData({...formData, car_model: ''});
              }}
              required
            >
              <option value="">Выберите марку</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="space-y-4 text-left">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Модель</label>
            <select
              className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 focus:ring-0 transition-all disabled:opacity-40 appearance-none text-gray-700"
              disabled={!selectedBrand}
              value={formData.car_model}
              onChange={(e) => setFormData({...formData, car_model: e.target.value})}
              required
            >
              <option value="">Выберите модель</option>
              {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4 text-left">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Год выпуска</label>
            <input type="number" placeholder="2024" className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 transition-all" required
              onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
          <div className="space-y-4 text-left">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Пробег (км)</label>
            <input type="number" placeholder="0" className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold focus:bg-white focus:border-blue-600 transition-all" required
              onChange={e => setFormData({...formData, mileage: e.target.value})} />
          </div>
          <div className="space-y-4 text-left">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Цена (₽)</label>
            <input type="number" placeholder="0" className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] p-5 font-bold text-blue-600 focus:bg-white focus:border-blue-600 transition-all" required
              onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4 text-left">
          <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] ml-6">Загрузка фото</label>
          <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[40px] p-16 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group overflow-hidden">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              required
              onChange={e => setImage(e.target.files[0])}
            />
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                📸
              </div>
              <p className="text-base font-black text-gray-800 uppercase tracking-tight">
                {image ? image.name : "Нажмите для выбора файла"}
              </p>
              <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-[0.2em]">PNG, JPG до 5 MB</p>
            </div>
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-7 rounded-[32px] font-black uppercase text-sm tracking-[0.2em] hover:bg-blue-700 active:scale-[0.97] transition-all shadow-2xl shadow-blue-500/40">
          Опубликовать в каталог
        </button>
      </form>

      {/* Инструкция: Сделали крупнее и заметнее */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { step: "01", title: "Выбор авто", desc: "Укажите марку и модель из нашей базы данных." },
          { step: "02", title: "Детали", desc: "Заполните год выпуска, пробег и вашу цену." },
          { step: "03", title: "Готово", desc: "Добавьте фото и ждите звонков покупателей." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] border border-gray-100 text-left hover:shadow-lg transition-all group">
            <span className="block text-2xl font-black text-blue-100 group-hover:text-blue-600 transition-colors mb-4">{item.step}</span>
            <h4 className="text-sm font-black uppercase text-gray-900 mb-2 tracking-tight">{item.title}</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddCar;