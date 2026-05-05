import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Мгновенно прокручиваем окно в координаты 0, 0
    window.scrollTo(0, 0);
  }, [pathname]); // Срабатывает каждый раз, когда меняется путь

  return null;
};

export default ScrollToTop;