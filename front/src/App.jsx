import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Теперь данные грузятся сами при старте страницы
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cars/')
      setCars(response.data)
    } catch (error) {
      console.error("Ошибка:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black italic tracking-tighter">DRIVE DEALER</h1>
        <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium">Войти</button>
      </header>

      <main className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Актуальные предложения</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Загрузка каталога...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map(car => (
              <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Работа с изображением */}
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={car.image}
                    alt={car.model_name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=No+Photo' }}
                  />
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{car.brand}</p>
                      <h3 className="text-xl font-bold text-gray-900">{car.model_name}</h3>
                    </div>
                    <span className="bg-green-50 text-green-700 text-sm font-bold px-2 py-1 rounded">
                      {car.year}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {car.description || "Описание временно отсутствует."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-2xl font-black text-gray-900">
                      {Number(car.price).toLocaleString()} ₽
                    </span>
                    <button className="text-blue-600 font-semibold hover:underline">Детали</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App