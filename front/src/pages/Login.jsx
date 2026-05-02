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
    try {
      // Для курсовой используем Basic Auth или просто проверку
      // В реальном ТЗ подразумевается JWT, но начнем с простого
      const response = await api.get('cars/', {
        auth: { username, password }
      });

      if (response.status === 200) {
        localStorage.setItem('userAuth', btoa(`${username}:${password}`));
        navigate('/');
      }
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black mb-6 text-center">ВХОД ДЛЯ СОТРУДНИКОВ</h2>
        {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Логин"
          className="w-full p-4 mb-4 border rounded-xl outline-none focus:border-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-4 mb-6 border rounded-xl outline-none focus:border-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;