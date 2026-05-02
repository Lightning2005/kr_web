import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    brand: '',
    model_name: '',
    year: '',
    price: '',
    mileage: '',
    image: '', // Храним URL текущего главного фото
  });

  const [mainImage, setMainImage] = useState(null);
  const [extraPhotos, setExtraPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    api.get(`cars/${id}/`)
      .then(res => {
        const data = res.data;
        setFormData({
          brand: data.brand,
          model_name: data.model_name,
          year: data.year,
          price: data.price,
          mileage: data.mileage,
          image: data.image, // Получаем URL с бэкенда
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
      await api.patch(`cars/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/car/${id}`);
    } catch (err) {
      alert("Ошибка при сохранении");
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest animate-pulse text-gray-400">Загрузка данных...</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-10 pb-32">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
        Редактирование <span className="text-blue-600">автомобиля</span>
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        {/* ЛЕВАЯ КОЛОНКА: ГАЛЕРЕЯ */}
        <div className="lg:col-span-5 space-y-10">

          {/* ГЛАВНОЕ ФОТО */}
            <div className="space-y-4">
              <label className="block font-black uppercase text-[10px] tracking-[0.2em] text-gray-400">
                Главное изображение
              </label>

              {/* Теперь это label, привязанный к скрытому инпуту через htmlFor */}
              <label
                htmlFor="main-image-input"
                className="relative block aspect-video rounded-[32px] overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 group cursor-pointer"
              >
                {mainImage ? (
                  <img src={URL.createObjectURL(mainImage)} className="w-full h-full object-cover" alt="Preview" />
                ) : formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Current" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase text-[10px]">
                    Нажмите, чтобы загрузить
                  </div>
                )}

                {/* Слой с надписью, который теперь пропускает клики или ловит их как часть label */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                  <p className="text-white font-black uppercase text-[10px] tracking-widest border-2 border-white/50 px-6 py-3 rounded-xl">
                    Изменить файл
                  </p>
                </div>
              </label>

              {/* Сам инпут скрываем, так как label сверху полностью его заменяет */}
              <input
                id="main-image-input"
                type="file"
                onChange={(e) => setMainImage(e.target.files[0])}
                className="hidden"
              />

              {/* Опционально: маленькая подпись под картинкой, если файл выбран */}
              {mainImage && (
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter ml-2">
                  Подготовлен к загрузке: {mainImage.name}
                </p>
              )}
            </div>

          {/* ДОПОЛНИТЕЛЬНЫЕ ФОТО */}
          <div className="space-y-4">
            <label className="block font-black uppercase text-[10px] tracking-[0.2em] text-gray-400">Дополнительные фото</label>
            <div className="grid grid-cols-3 gap-4">
              {/* Текущие */}
              {existingPhotos.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group shadow-sm">
                  <img src={img.image} className="w-full h-full object-cover" alt="existing" />
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <span className="bg-white text-green-600 font-black text-[8px] px-2 py-1 rounded-md shadow-sm">OK</span>
                  </div>
                </div>
              ))}
              {/* Новые выбранные */}
              {extraPhotos.map((file, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden bg-blue-50 border-2 border-blue-200">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60" alt="new" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-blue-600 text-white font-black text-[8px] px-2 py-1 rounded-md uppercase">New</span>
                  </div>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              onChange={(e) => setExtraPhotos(Array.from(e.target.files))}
              className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-100 file:text-gray-900 hover:file:bg-gray-200 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: ХАРАКТЕРИСТИКИ */}
        <div className="lg:col-span-7 bg-gray-50 p-10 lg:p-12 rounded-[48px] border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] tracking-widest text-gray-400 ml-2">Марка</label>
              <input name="brand" value={formData.brand} onChange={handleInputChange} className="w-full bg-white border-2 border-transparent focus:border-blue-600 rounded-[20px] p-5 font-bold outline-none transition-all shadow-sm" placeholder="Напр. Ford" />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] tracking-widest text-gray-400 ml-2">Модель</label>
              <input name="model_name" value={formData.model_name} onChange={handleInputChange} className="w-full bg-white border-2 border-transparent focus:border-blue-600 rounded-[20px] p-5 font-bold outline-none transition-all shadow-sm" placeholder="Напр. Focus" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] tracking-widest text-gray-400 ml-2">Год выпуска</label>
              <input name="year" type="number" value={formData.year} onChange={handleInputChange} className="w-full bg-white border-2 border-transparent focus:border-blue-600 rounded-[20px] p-5 font-bold outline-none transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] tracking-widest text-gray-400 ml-2">Цена (₽)</label>
              <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full bg-white border-2 border-transparent focus:border-blue-600 rounded-[20px] p-5 font-bold outline-none transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-[10px] tracking-widest text-gray-400 ml-2">Пробег (км)</label>
              <input name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} className="w-full bg-white border-2 border-transparent focus:border-blue-600 rounded-[20px] p-5 font-bold outline-none transition-all shadow-sm" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" className="flex-[2] bg-blue-600 text-white py-6 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-900 transition-all shadow-2xl shadow-blue-500/20 active:scale-95">
              Сохранить изменения
            </button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-6 border-2 border-gray-200 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] text-gray-400 hover:bg-white hover:text-gray-900 hover:border-gray-900 transition-all">
              Отмена
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

export default EditCar;