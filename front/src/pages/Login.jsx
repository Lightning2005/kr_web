import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Helmet } from 'react-helmet-async';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('token/', {
        username: username,
        password: password
      });

      if (response.data && response.data.access) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('userAuth', btoa(`${username}:${password}`));
        navigate('/catalog');
      } else {
        setError('Сервер не вернул токен доступа.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Неверный логин или пароль');
    }
  };

  return (
    /*
       Используем min-h-[calc(100vh-header_height-footer_height)].
       Учитывая py-20 и h-24, нам нужно вычесть около 400px,
       чтобы футер поднялся в зону видимости.
    */
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-450px)] px-4">
        <Helmet>
            <title>Вход в систему | Drive Select</title>
        </Helmet>

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-50 mt-10 transition-all"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
            DRIVE<span className="text-blue-600">SELECT</span>
          </h2>
          <p className="text-gray-400 mt-2 font-black text-[9px] uppercase tracking-[0.3em]">
            Вход для персонала
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-center text-[10px] border border-red-100 font-bold uppercase">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="ml-4 font-black uppercase text-[9px] text-gray-400 tracking-widest">Логин</label>
            <input
              type="text"
              placeholder="admin"
              className="w-full p-4 bg-[#eff4ff] border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold mt-1 text-gray-900 placeholder-gray-400"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="ml-4 font-black uppercase text-[9px] text-gray-400 tracking-widest">Пароль</label>
            <input
              type="password"
              placeholder="•••••"
              className="w-full p-4 bg-[#eff4ff] border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold mt-1 text-gray-900 placeholder-gray-400"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-blue-500/20 mt-6 active:scale-95"
          >
            Войти в систему
          </button>
        </div>

        <p className="text-center mt-10 text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
          © 2026 DRIVE<span className="text-blue-500/50">SELECT</span> SYSTEMS
        </p>
      </form>

      {/*
          ХАК: Если в твоем Footer.jsx прописан mt-20, он всегда будет толкать футер вниз.
          Добавляем невидимый распорку, чтобы компенсировать это, либо убедись,
          что в файле App.jsx контент обернут в flex-grow.
      */}
    </div>
  );
}

export default Login;