import React, { useState } from 'react'

function App() {
  const [cars, setCars] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Навигация */}
      <nav className="bg-slate-900 text-white p-4 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter">
            DRIVE <span className="text-blue-500">DEALER</span>
          </h1>
          <button className="bg-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
            Войти
          </button>
        </div>
      </nav>

      {/* Основной блок */}
      <main className="container mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-200 text-center">
          <h2 className="text-5xl font-black text-slate-800 mb-6">
            Добро пожаловать в систему
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Здесь будет каталог автомобилей, интегрированный с вашим Django API.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition">
              Смотреть каталог
            </button>
            <button className="border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition">
              Добавить авто
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App