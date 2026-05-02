import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AddCar() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  const [formData, setFormData] = useState({
    car_model: '', // Сюда пойдет ID модели
    year: '',
    price: '',
    mileage: ''
  });
  const [image, setImage] = useState(null);

  // 1. Загружаем бренды при старте
  useEffect(() => {
    api.get('brands/').then(res => setBrands(res.data));
  }, []);

  // 2. Загружаем модели, когда выбрана конкретная марка
  useEffect(() => {
    if (selectedBrand) {
      api.get(`carmodels/?brand=${selectedBrand}`).then(res => setModels(res.data));
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = localStorage.getItem('userAuth');

    const data = new FormData();
    // Бэкенд ждет ID модели (целое число)
    data.append('car_model', parseInt(formData.car_model));
    data.append('year', parseInt(formData.year));
    data.append('price', parseFloat(formData.price));
    data.append('mileage', parseInt(formData.mileage));
    if (image) data.append('image', image);

    try {
      await api.post('cars/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Обязательно передаем авторизацию здесь
          'Authorization': `Basic ${authData}`
        }
      });
      alert('Успешно опубликовано!');
      navigate('/');
    } catch (err) {
      // Выведи в консоль точный ответ сервера, чтобы понять причину
      console.error("Server Response:", err.response?.data);
      alert('Ошибка при добавлении. Посмотри детали в консоли (F12)');
    }
  };

  return (
    <div className="max-w-[500px] mx-auto p-10 bg-white shadow-xl mt-10 rounded-2xl">
      <h1 className="text-2xl font-black mb-6 text-center tracking-tighter">НОВОЕ ОБЪЯВЛЕНИЕ</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Выбор марки */}
        <select
          className="w-full p-3 border rounded-xl"
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setFormData({...formData, car_model: ''}); // Сброс модели при смене марки
          }}
          required
        >
          <option value="">Выберите марку</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        {/* Выбор модели (активен только после марки) */}
        <select
          className="w-full p-3 border rounded-xl disabled:bg-gray-50"
          disabled={!selectedBrand}
          value={formData.car_model}
          onChange={(e) => setFormData({...formData, car_model: e.target.value})}
          required
        >
          <option value="">Выберите модель</option>
          {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Год" className="p-3 border rounded-xl" required
            onChange={e => setFormData({...formData, year: e.target.value})} />
          <input type="number" placeholder="Пробег" className="p-3 border rounded-xl" required
            onChange={e => setFormData({...formData, mileage: e.target.value})} />
        </div>

        <input type="number" placeholder="Цена (₽)" className="w-full p-3 border rounded-xl font-bold" required
          onChange={e => setFormData({...formData, price: e.target.value})} />

        <div className="border-2 border-dashed border-gray-200 p-6 rounded-xl text-center">
          <input type="file" accept="image/*" required
            onChange={e => setImage(e.target.files[0])} />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-black hover:bg-blue-700 active:scale-95 transition-all">
          ОПУБЛИКОВАТЬ
        </button>
      </form>
    </div>
  );
}

export default AddCar;