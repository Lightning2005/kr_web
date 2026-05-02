import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

data.append('owner', 1);

function AddCar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '',
    model_name: '',
    year: '',
    price: '',
    mileage: ''
  });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ТЗ требует multipart/form-data для передачи фото
    const data = new FormData();
    data.append('brand', formData.brand);
    data.append('model_name', formData.model_name);
    data.append('year', formData.year);
    data.append('price', formData.price);
    data.append('mileage', formData.mileage);
    if (image) data.append('image', image);

    try {
      const authData = localStorage.getItem('userAuth');
      await api.post('cars/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Basic ${authData}`
        }
      });
      alert('Автомобиль успешно добавлен!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении. Проверь консоль.');
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6 text-center">ДОБАВИТЬ АВТО</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Марка" required className="w-full p-2 border"
          onChange={e => setFormData({...formData, brand: e.target.value})} />

        <input type="text" placeholder="Модель" required className="w-full p-2 border"
          onChange={e => setFormData({...formData, model_name: e.target.value})} />

        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="Год" required className="p-2 border"
            onChange={e => setFormData({...formData, year: e.target.value})} />
          <input type="number" placeholder="Цена" required className="p-2 border"
            onChange={e => setFormData({...formData, price: e.target.value})} />
          <input type="number" placeholder="Пробег" required className="p-2 border"
            onChange={e => setFormData({...formData, mileage: e.target.value})} />
        </div>

        <div className="border p-4 bg-gray-50">
          <p className="text-sm mb-2 text-gray-500 text-center uppercase font-bold">Выберите фото</p>
          <input type="file" accept="image/*" required className="w-full"
            onChange={e => setImage(e.target.files[0])} />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white p-3 font-bold hover:bg-green-700">
          СОХРАНИТЬ В КАТАЛОГ
        </button>
      </form>
    </div>
  );
}

export default AddCar;