import React from 'react';
import { Users, Eye, Smartphone, Monitor, Share2, TrendingUp, RefreshCw } from 'lucide-react';
import { Language, SiteTrafficStats } from '../types';

interface SiteTrafficWidgetProps {
  language: Language;
  stats: SiteTrafficStats | null;
  onRefresh?: () => void;
}

export const SiteTrafficWidget: React.FC<SiteTrafficWidgetProps> = ({
  language,
  stats,
  onRefresh,
}) => {
  const isGu = language === 'gu';

  const safeStats: SiteTrafficStats = stats || {
    liveVisitors: 1,
    todayVisits: 1,
    totalPageViews: 1,
    whatsappShares: 0,
    videoExports: 0,
    mobilePct: 68,
    desktopPct: 32,
    recentHours: [],
    pageViewsByTab: {},
    updatedAt: '--:--',
  };

  const maxHits = Math.max(1, ...safeStats.recentHours.map((h) => h.hits));

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <TrendingUp className="w-4 h-4 text-red-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] truncate">
            {isGu ? 'વેબસાઇટ લાઈવ ટ્રાફિક & વાચકો' : 'Live Website Traffic & Readers'}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="tabular-nums font-mono">{safeStats.updatedAt}</span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh Traffic"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Key Live Traffic Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{isGu ? 'લાઈવ ઓનલાઈન' : 'Live Online'}</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-400 tabular-nums">
            {safeStats.liveVisitors}
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{isGu ? 'આજની વિઝિટ' : "Today's Visits"}</span>
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tabular-nums">
            {safeStats.todayVisits}
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{isGu ? 'કુલ પેજ વ્યૂઝ' : 'Total Page Views'}</span>
            <Eye className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-amber-300 tabular-nums">
            {safeStats.totalPageViews}
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{isGu ? 'મોબાઈલ / ડેસ્કટોપ' : 'Mobile / Desktop'}</span>
            <Smartphone className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 tabular-nums pt-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <Smartphone className="w-3 h-3" /> {safeStats.mobilePct}%
            </span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1 text-sky-400">
              <Monitor className="w-3 h-3" /> {safeStats.desktopPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Compact Hourly Activity Bars + Shares Counter */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-end gap-1.5 h-10 flex-1 max-w-md">
          {safeStats.recentHours.map((slot) => {
            const pct = Math.max(12, Math.round((slot.hits / maxHits) * 100));
            return (
              <div key={slot.label} className="flex-1 flex flex-col items-center gap-1 group" title={`${slot.label}: ${slot.hits} hits`}>
                <div className="w-full bg-slate-800/80 rounded-sm h-7 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-red-600 to-rose-400 rounded-sm transition-all duration-300"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-mono tabular-nums">{slot.label.slice(0, 2)}h</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
          <span className="inline-flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 tabular-nums">
            <Share2 className="w-3 h-3 text-emerald-400" />
            <span>{isGu ? 'WhatsApp શેર:' : 'Shares:'}</span>
            <strong className="text-white">{safeStats.whatsappShares}</strong>
          </span>
        </div>
      </div>
    </section>
  );
};
