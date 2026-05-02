import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Отправляем запрос на получение токена
      // Если у бэка другой путь (например 'login/'), замени здесь
      const response = await api.post('token/', {
        username: username,
        password: password
      });

      console.log("Ответ сервера:", response.data); // Посмотри в консоли структуру

      // Проверяем наличие access токена в ответе
      if (response.data && response.data.access) {
        localStorage.setItem('access', response.data.access);

        // userAuth оставляем только для отображения имени "admin"
        localStorage.setItem('userAuth', btoa(`${username}:${password}`));

        navigate('/dashboard');
      } else {
        setError('Сервер не вернул токен доступа.');
      }
    } catch (err) {
      console.error("Детали ошибки входа:", err.response?.data);
      setError(err.response?.data?.detail || 'Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black mb-6 text-center italic tracking-tighter">
          DRIVE<span className="text-blue-600">SELECT</span>
        </h2>
        <p className="text-center text-gray-400 mb-8 font-bold text-sm uppercase">Вход для персонала</p>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-center text-sm border border-red-100 font-bold">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Логин"
            className="w-full p-4 border border-gray-100 rounded-xl outline-none focus:border-blue-500 bg-gray-50 transition-all"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-4 border border-gray-100 rounded-xl outline-none focus:border-blue-500 bg-gray-50 transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
            ВОЙТИ В СИСТЕМУ
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;