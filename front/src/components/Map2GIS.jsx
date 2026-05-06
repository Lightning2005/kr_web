import { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';

const DGIS_KEY = '6aa0d981-a06b-4a46-b14a-beecf2b6fad9';
const DEFAULT_CENTER = [82.92043, 55.030199]; // Новосибирск

async function geocodeAddress(address, city = '') {
  const query = city ? `${city}, ${address}` : address;
  const url = `https://catalog.api.2gis.com/3.0/items/geocode?q=${encodeURIComponent(query)}&fields=items.point&key=${DGIS_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const point = data?.result?.items?.[0]?.point;
    if (point) {
      console.log('Геокодер нашёл:', point.lon, point.lat);
      return [point.lon, point.lat];
    } else {
      console.warn('Адрес не найден:', query);
    }
  } catch (e) {
    console.error('Геокодирование не удалось:', e);
  }
  return null;
}

const Map2GIS = ({
  zoom = 16,
  hotelName = 'АВТОВЫБОР',
  address = '',
  city = '',
  showRouteButton = true,
}) => {
  const mapContainerRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  // Геокодирование адреса
  useEffect(() => {
    if (!address) {
      setCoords(DEFAULT_CENTER);
      return;
    }
    geocodeAddress(address, city).then(result => {
      if (result) {
        setCoords(result);
        setGeoError(false);
      } else {
        setGeoError(true);
        setCoords(DEFAULT_CENTER);
      }
    });
  }, [address, city]);

  // Карта
  useEffect(() => {
    if (!coords || !mapContainerRef.current) return;
    let map;
    load().then((mapgl) => {
      if (!mapContainerRef.current) return;
      map = new mapgl.Map(mapContainerRef.current, {
        center: coords,
        zoom: zoom,
        key: DGIS_KEY,
        style: 'c0d0aa03-372d-4340-9721-a3f2d22a8c3d',
      });
      new mapgl.Marker(map, { coordinates: coords });
    });
    return () => {
      if (map) map.destroy();
    };
  }, [coords]);

  // Геолокация пользователя
  const getUserLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.longitude, pos.coords.latitude]);
        setLocating(false);
      },
      (err) => {
        alert('Не удалось определить местоположение. Ошибка: ' + err.message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

    const openRoute = () => {
      if (geoError) {
        const query = city ? `${city}, ${address}` : address;
        window.open(`https://2gis.ru/search/${encodeURIComponent(query)}`, '_blank');
        return;
      }

      const [lon, lat] = coords;

      // Добавляем параметр состояния карты: ?m=lon,lat/zoom
      // %2C — это запятая, %2F — это слеш
      const mapState = `?m=${lon}%2C${lat}%2F${zoom}`;

      let url;
      if (userLocation) {
        const [startLon, startLat] = userLocation;
        url = `https://2gis.ru/directions/points/${startLon}%2C${startLat}%7C${lon}%2C${lat}${mapState}`;
      } else {
        url = `https://2gis.ru/directions/points/%7C${lon}%2C${lat}${mapState}`;
      }

      console.log('Открываем маршрут:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
    };

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full min-h-[450px] rounded-[32px] overflow-hidden"
        ref={mapContainerRef}
      />
      {showRouteButton && coords && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <button
            onClick={openRoute}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl"
          >
            Построить маршрут
          </button>
          {geoError && (
            <p className="text-red-500 text-xs bg-white px-3 py-1 rounded-full">
              Адрес не найден. Маршрут до центра города
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Map2GIS;