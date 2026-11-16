import React, { useEffect, useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Sprout,
  RefreshCw,
  TrendingUp,
  MapPin,
  Umbrella,
  Sun,
  LocateFixed
} from 'lucide-react';
import { Language, ValodLocalInfo } from '../types';

interface LocalValodWidgetProps {
  language: Language;
}

type WeatherStationId = 'valod' | 'vyara' | 'songadh' | 'bardoli' | 'surat' | 'gps';

const STATION_OPTIONS: { id: Exclude<WeatherStationId, 'gps'>; labelGu: string; labelEn: string }[] = [
  { id: 'valod', labelGu: 'વાલોડ', labelEn: 'Valod' },
  { id: 'vyara', labelGu: 'વ્યારા', labelEn: 'Vyara' },
  { id: 'songadh', labelGu: 'સોનગઢ', labelEn: 'Songadh' },
  { id: 'bardoli', labelGu: 'બારડોલી', labelEn: 'Bardoli' },
  { id: 'surat', labelGu: 'સુરત', labelEn: 'Surat' }
];

const DEFAULT_LOCAL_INFO: ValodLocalInfo = {
  stationId: 'valod',
  locationGu: 'વાલોડ, જિ. તાપી',
  locationEn: 'Valod, Tapi Dist.',
  updatedAt: 'લોડ થાય છે...',
  weatherSource: 'open_meteo',
  weatherSourceLabel: 'Live Meteorological Feed',
  weather: {
    tempC: 30,
    feelsLikeC: 31,
    conditionGu: 'લાઈવ હવામાન લોડ થાય છે...',
    conditionEn: 'Fetching live weather...',
    humidity: 43,
    windKmh: 6,
    rainChance: 0
  },
  forecastDays: [],
  mandiNameGu: 'વ્યારા & વાલોડ APMC માર્કેટ યાર્ડ',
  mandiNameEn: 'Vyara & Valod APMC Mandi',
  crops: [
    {
      id: 'paddy',
      nameGu: 'ડાંગર (ગુજરાત-૧૭ / જયા)',
      nameEn: 'Paddy (Gujarat-17)',
      varietyGu: 'ક્વોલિટી A',
      minPrice: 440,
      maxPrice: 535,
      modalPrice: 495,
      unitGu: '૨૦ કિલો',
      unitEn: '20 Kg',
      trend: 'up'
    },
    {
      id: 'sugarcane',
      nameGu: 'શેરડી (સુગર ફેક્ટરી)',
      nameEn: 'Sugarcane (Mill Rate)',
      varietyGu: 'રિકવરી ૧૧.૨%',
      minPrice: 3150,
      maxPrice: 3480,
      modalPrice: 3320,
      unitGu: '૧ ટન',
      unitEn: 'Per Ton',
      trend: 'up'
    },
    {
      id: 'vegetables',
      nameGu: 'શાકભાજી (ટામેટા, ભીંડા, ડુંગળી)',
      nameEn: 'Vegetables (Tomato, Okra)',
      varietyGu: 'તાજી આવક',
      minPrice: 380,
      maxPrice: 740,
      modalPrice: 560,
      unitGu: '૨૦ કિલો',
      unitEn: '20 Kg',
      trend: 'stable'
    }
  ]
};

export const LocalValodWidget: React.FC<LocalValodWidgetProps> = ({ language }) => {
  const isGu = language === 'gu';
  const [info, setInfo] = useState<ValodLocalInfo>(DEFAULT_LOCAL_INFO);
  const [station, setStation] = useState<WeatherStationId>('valod');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const fetchLocalInfo = async (
    targetStation: WeatherStationId = station,
    coords: { lat: number; lng: number } | null = gpsCoords,
    forceRefresh: boolean = false
  ) => {
    setLoading(true);
    setGpsError(null);
    try {
      const params = new URLSearchParams();
      params.set('station', targetStation);
      if (targetStation === 'gps' && coords) {
        params.set('lat', String(coords.lat));
        params.set('lng', String(coords.lng));
      }
      if (forceRefresh) {
        params.set('force', '1');
      }
      const res = await fetch(`/api/local/valod-info?${params.toString()}`);
      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      const json = await res.json();
      if (json?.quotaExceeded) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      if (json?.success && json.data) {
        setInfo(json.data);
      }
    } catch {
      // keep existing state on transient error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalInfo('valod', null, false);
  }, []);

  const handleSelectStation = (id: Exclude<WeatherStationId, 'gps'>) => {
    setStation(id);
    fetchLocalInfo(id, null, false);
  };

  const handleUseMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setGpsError(isGu ? 'આ બ્રાઉઝરમાં GPS ઉપલબ્ધ નથી' : 'GPS unavailable in browser');
      return;
    }
    setLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4))
        };
        setGpsCoords(coords);
        setStation('gps');
        fetchLocalInfo('gps', coords, true);
      },
      () => {
        setLoading(false);
        setGpsError(isGu ? 'લોકેશન પરવાનગી મળી નથી' : 'Location permission denied');
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  return (
    <section
      aria-label="Valod Weather and Vyara Mandi Bhav"
      className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-lg"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Accurate Live Local Weather Block */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between gap-3">
          {/* Header + Controls */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {info.weather.iconUrl ? (
                <img
                  src={info.weather.iconUrl}
                  alt={info.weather.conditionEn}
                  className="w-7 h-7 shrink-0"
                />
              ) : (
                <CloudSun className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white truncate font-['Noto_Sans_Gujarati',sans-serif]">
                  {isGu ? 'લાઈવ ચોક્કસ હવામાન' : 'Live Accurate Weather'}
                </h3>
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="truncate">{isGu ? info.locationGu : info.locationEn}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={loading}
                className={`p-2 rounded-lg border transition ${
                  station === 'gps'
                    ? 'bg-red-600/20 border-red-500/50 text-red-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                }`}
                title={isGu ? 'મારું GPS લોકેશન વાપરો' : 'Use My GPS Location'}
              >
                <LocateFixed className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => fetchLocalInfo(station, gpsCoords, true)}
                disabled={loading}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                title={isGu ? 'લાઈવ હવામાન તાજું કરો' : 'Refresh Live Weather'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Interactive Station Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
            {STATION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectStation(opt.id)}
                className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition ${
                  station === opt.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {isGu ? opt.labelGu : opt.labelEn}
              </button>
            ))}
          </div>

          {gpsError && (
            <p className="text-[11px] text-amber-400">{gpsError}</p>
          )}

          {/* Primary Temperature + Real Metrics */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
                  {info.weather.tempC}°C
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {isGu ? `અનુભવ ${info.weather.feelsLikeC}°` : `Feels ${info.weather.feelsLikeC}°`}
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium mt-0.5 font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? info.weather.conditionGu : info.weather.conditionEn}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300 tabular-nums text-right">
              <span className="flex items-center justify-end gap-1" title={isGu ? 'ભેજ' : 'Humidity'}>
                <Droplets className="w-3 h-3 text-sky-400" />
                {info.weather.humidity}%
              </span>
              <span className="flex items-center justify-end gap-1" title={isGu ? 'પવન' : 'Wind'}>
                <Wind className="w-3 h-3 text-teal-400" />
                {info.weather.windKmh} km/h{info.weather.windDirection ? ` ${info.weather.windDirection}` : ''}
              </span>
              <span className="flex items-center justify-end gap-1" title={isGu ? 'વરસાદની શક્યતા' : 'Rain Probability'}>
                <Umbrella className="w-3 h-3 text-indigo-400" />
                {info.weather.rainChance}%
              </span>
              {typeof info.weather.uvIndex === 'number' && (
                <span className="flex items-center justify-end gap-1" title="UV Index">
                  <Sun className="w-3 h-3 text-amber-400" />
                  UV {info.weather.uvIndex}
                </span>
              )}
            </div>
          </div>

          {/* Compact 3-Day Live Forecast Strip */}
          {info.forecastDays && info.forecastDays.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
              {info.forecastDays.map((day) => (
                <div key={day.dateIso} className="bg-slate-900/70 rounded-lg px-2 py-1.5">
                  <div className="flex items-center justify-between text-slate-400 font-semibold">
                    <span>{isGu ? day.dayLabelGu : day.dayLabelEn}</span>
                    {day.rainChance > 0 && (
                      <span className="text-sky-400 tabular-nums">{day.rainChance}%</span>
                    )}
                  </div>
                  <div className="text-slate-100 font-bold tabular-nums font-mono mt-0.5">
                    {Math.round(day.maxC)}° / <span className="text-slate-400 font-normal">{Math.round(day.minC)}°</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observation Timestamp & Live Feed Attribution */}
          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 pt-0.5">
            <span>{info.weatherSourceLabel || 'Live Weather'}</span>
            <span className="tabular-nums font-mono">
              {isGu ? `અપડેટ: ${info.updatedAt} IST` : `Obs: ${info.updatedAt} IST`}
            </span>
          </div>
        </div>

        {/* Vyara & Valod Mandi Bhav Block */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3 className="text-xs font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'વ્યારા & વાલોડ માર્કેટ યાર્ડ (Mandi Bhav)' : 'Vyara & Valod Mandi Crop Prices'}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              {isGu ? `અપડેટ: ${info.updatedAt}` : `Updated: ${info.updatedAt}`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 items-stretch">
            {info.crops.map((crop) => (
              <div
                key={crop.id}
                className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between gap-1"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-slate-100 font-['Noto_Sans_Gujarati',sans-serif] leading-snug">
                    {isGu ? crop.nameGu : crop.nameEn}
                  </span>
                  {crop.trend === 'up' && (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2 pt-1">
                  <span className="text-sm font-extrabold text-emerald-400 tabular-nums font-mono">
                    ₹{crop.minPrice}–{crop.maxPrice}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    / {isGu ? crop.unitGu : crop.unitEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
