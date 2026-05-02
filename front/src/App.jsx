import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [cars, setCars] = useState([])

  const fetchCars = () => {
    // Используем адрес с твоего скриншота image_c12d04.png
    axios.get('http://127.0.0.1:8000/api/cars/')
      .then(res => {
        setCars(res.data)
        console.log("Данные получены:", res.data)
      })
      .catch(err => {
        console.error("Ошибка:", err)
        alert("Проверь консоль браузера!")
      })
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>DRIVE DEALER</h1>
      <div style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
        <h2>Каталог автомобилей</h2>
        <button
          onClick={fetchCars}
          style={{ backgroundColor: '#00ccff', padding: '10px', cursor: 'pointer' }}
        >
          Смотреть каталог
        </button>

        <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
          {cars.map(car => (
            <div key={car.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <strong>{car.brand} {car.model_name}</strong> — {car.price} руб.
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App