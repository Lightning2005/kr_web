import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    brand: '',
    car_model_name: '',
    year: '',
    price: '',
    mileage: '',
    city: '',
    address: '',
    description: '',
    image: '',
  });

  const [mainImage, setMainImage] = useState(null);
  const [extraPhotos, setExtraPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    api.get(`cars/${id}/`)
      .then(res => {
        const data = res.data;
        setFormData({
          brand: data.brand_display || '',
          car_model_name: data.model_display || '',
          year: data.year || '',
          price: data.price || '',
          mileage: data.mileage || '',
          city: data.city || '',
          address: data.address || '',
          description: data.description || '',
          image: data.image || '',
        });
        setExistingPhotos(data.images || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки:", err);
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Удаление уже существующего фото из БД
  const deleteExistingPhoto = (photoId) => {
      toast((t) => (
        <div className="flex flex-col gap-4">
          <span className="text-center font-bold">Удалить это фото навсегда?</span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.post(`cars/${id}/delete-image/`, { image_id: photoId });
                  setExistingPhotos(existingPhotos.filter(p => p.id !== photoId));
                  toast.success("Фото удалено");
                } catch (err) {
                  toast.error("Не удалось удалить фото");
                }
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
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key !== 'image') data.append(key, formData[key]);
    });

    if (mainImage) data.append('image', mainImage);

    extraPhotos.forEach(file => {
      data.append('new_images', file);
    });

    try {
      await api.patch(`cars/${id}/`, data);
      navigate(`/car/${id}`);
    } catch (err) {
      console.error("Ошибка сохранения:", err.response?.data);
      alert("Ошибка при сохранении.");
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase">Загрузка...</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-10 pb-32">
        <Helmet>
            <title>
                {`Редактирование: ${formData.brand} ${formData.car_model_name} | Drive Select`}
            </title>
        </Helmet>
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
        Редактирование <span className="text-blue-600">автомобиля</span>
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <label className="block font-black uppercase text-[10px] tracking-[0.2em] text-gray-400">Главное изображение</label>
            <label htmlFor="main-img" className="relative block aspect-video rounded-[32px] overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 group cursor-pointer">
              {mainImage ? (
                <img src={URL.createObjectURL(mainImage)} className="w-full h-full object-cover" />
              ) : (
                <img src={formData.image} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                <p className="text-white font-black uppercase text-[10px] border-2 border-white/50 px-6 py-3 rounded-xl">Сменить фото</p>
              </div>
            </label>
            <input id="main-img" type="file" className="hidden" onChange={(e) => setMainImage(e.target.files[0])} />
          </div>

          <div className="space-y-4">
            <label className="block font-black uppercase text-[10px] tracking-[0.2em] text-gray-400">Дополнительные фото</label>
            <div className="grid grid-cols-3 gap-4">
              {existingPhotos.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img src={img.image} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => deleteExistingPhoto(img.id)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs">×</button>
                </div>
              ))}
              {extraPhotos.map((file, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-blue-500">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setExtraPhotos(extraPhotos.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-gray-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">×</button>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-[8px] text-white text-center font-black uppercase">New</div>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              onChange={(e) => setExtraPhotos([...extraPhotos, ...Array.from(e.target.files)])}
              className="block w-full text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100 file:font-black file:uppercase file:text-gray-600 hover:file:bg-gray-200 cursor-pointer"
            />
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="lg:col-span-7 bg-gray-50 p-10 lg:p-12 rounded-[48px] border border-gray-100">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] text-gray-400 ml-2">Марка</label>
              <input name="brand" value={formData.brand} onChange={handleInputChange} className="w-full bg-white rounded-[20px] p-5 font-bold outline-none shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] text-gray-400 ml-2">Модель</label>
              <input name="car_model_name" value={formData.car_model_name} onChange={handleInputChange} className="w-full bg-white rounded-[20px] p-5 font-bold outline-none shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] text-gray-400 ml-2">Год</label>
              <input name="year" type="number" value={formData.year} onChange={handleInputChange} className="w-full bg-white rounded-[20px] p-5 font-bold outline-none shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] text-gray-400 ml-2">Цена</label>
              <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full bg-white rounded-[20px] p-5 font-bold outline-none shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] text-gray-400 ml-2">Пробег</label>
              <input name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} className="w-full bg-white rounded-[20px] p-5 font-bold outline-none shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] text-gray-400 ml-2">Город</label>
              <input name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white rounded-[20px] p-5 font-bold outline-none shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] text-gray-400 ml-2">Адрес</label>
              <input name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white rounded-[20px] p-5 font-bold outline-none shadow-sm" />
            </div>
          </div>

          <div className="space-y-2 mb-12">
            <label className="font-black uppercase text-[10px] text-gray-400 ml-2">Описание</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} className="w-full bg-white rounded-[20px] p-5 font-bold outline-none shadow-sm resize-none" />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="flex-[2] bg-blue-600 text-white py-6 rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-gray-900 transition-all">Сохранить</button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-6 border-2 border-gray-200 rounded-[24px] font-black uppercase text-xs text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">Отмена</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditCar;