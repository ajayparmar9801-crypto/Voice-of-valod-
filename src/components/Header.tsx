import React from 'react';
import { Play, Globe, Radio, Bell, RefreshCw, Camera, Flame, Eye } from 'lucide-react';
import { Language, PipelineState, SiteTrafficStats } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  pipelineState: PipelineState;
  onStartPipeline: () => void;
  onResetPipeline: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  breakingHeadlines?: string[];
  pendingApprovalCount?: number;
  onOpenCitizenReporter?: () => void;
  trafficStats?: SiteTrafficStats | null;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  pipelineState,
  onStartPipeline,
  onResetPipeline,
  activeTab,
  setActiveTab,
  breakingHeadlines = [],
  pendingApprovalCount = 0,
  onOpenCitizenReporter,
  trafficStats = null,
}) => {
  const isGu = language === 'gu';

  const defaultHeadlines = isGu
    ? [
        'વાલોડ APMC માર્કેટ યાર્ડમાં ડાંગર અને શેરડીના ભાવમાં તેજી — ખેડૂતોમાં ખુશીનો માહોલ',
        'તાપી જિલ્લાના વાલોડ-વ્યારા હાઈવે પર નવા બ્રિજ અને રોડ નવીનીકરણના કામને મંજૂરી',
        'ગાંધીનગર GIFT City માં ૫૦,૦૦૦ નવી નોકરીઓની મોટી જાહેરાત — એન્કર માયા લાઈવ બુલેટિન',
      ]
    : [
        'Valod & Vyara APMC Mandi sees steady rise in Paddy & Sugarcane prices',
        'Valod–Vyara highway upgrade and new bridge project approved in Tapi district',
        'GIFT City Gandhinagar announces 50,000 new fintech jobs — Live with Anchor Maya',
      ];

  const tickerItems = breakingHeadlines.length > 0 ? breakingHeadlines : defaultHeadlines;
  const tickerText = tickerItems.join('   •   🔴   ');

  return (
    <header className="bg-slate-900 border-b border-slate-800 md:sticky md:top-0 z-40 shadow-xl w-full overflow-hidden">
      {/* Scrolling Red Breaking News Ticker Bar */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white border-b border-red-500/60 flex items-center h-8 overflow-hidden">
        <div className="bg-slate-950/95 text-red-400 font-extrabold text-[11px] px-2.5 sm:px-3.5 h-full flex items-center gap-1.5 shrink-0 border-r border-red-500/40 z-10 tracking-wide">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <Flame className="w-3.5 h-3.5 text-amber-400 hidden sm:inline" />
          <span className="font-['Noto_Sans_Gujarati',sans-serif] whitespace-nowrap">
            {isGu ? 'બ્રેકિંગ ન્યૂઝ' : 'BREAKING NEWS'}
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="animate-news-marquee text-xs font-semibold tracking-wide font-['Noto_Sans_Gujarati',sans-serif] px-4">
            <span>🔴 {tickerText}</span>
            <span className="mx-8">•</span>
            <span>🔴 {tickerText}</span>
          </div>
        </div>
      </div>

      {/* Top status bar (responsive wrapping, language toggle always visible) */}
      <div className="bg-slate-950 px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="font-semibold text-red-400 tracking-wider uppercase text-[10px] sm:text-[11px] flex items-center gap-1 truncate">
            <Radio className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {isGu ? 'ઓટોનોમસ ન્યૂઝરૂમ લાઈવ' : 'AUTONOMOUS NEWSROOM LIVE'}
            </span>
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline text-[11px]">
            {isGu ? '૧૨ સ્વાયત્ત AI એજન્ટો સક્રિય' : '12 Autonomous AI Agents Active'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {trafficStats && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-[11px] font-semibold tabular-nums">
              <Eye className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{isGu ? `લાઈવ: ${trafficStats.liveVisitors}` : `Live: ${trafficStats.liveVisitors}`}</span>
              <span className="text-slate-500">|</span>
              <span>{isGu ? `આજ: ${trafficStats.todayVisits}` : `Today: ${trafficStats.todayVisits}`}</span>
            </div>
          )}

          <a
            href="https://www.youtube.com/@voiceofvalod"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-700/50 text-[11px] transition font-medium"
            title="Official YouTube Channel: @voiceofvalod"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-semibold">@voiceofvalod</span>
            <span className="text-[10px] text-emerald-400">● Live</span>
          </a>

          {(pipelineState.awaitingApproval || pendingApprovalCount > 0) && (
            <button
              type="button"
              onClick={() => setActiveTab('owner_control')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40 text-[10px] sm:text-[11px] transition"
            >
              <Bell className="w-3 h-3" />
              <span>
                {isGu
                  ? `અપ્રૂવલ બાકી (${Math.max(pendingApprovalCount, pipelineState.awaitingApproval ? 1 : 0)})`
                  : `Pending (${Math.max(pendingApprovalCount, pipelineState.awaitingApproval ? 1 : 0)})`}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onLanguageChange(isGu ? 'en' : 'gu')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 transition font-semibold text-[11px] shrink-0"
            title="Toggle English / ગુજરાતી"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="whitespace-nowrap">{isGu ? 'English / ગુજરાતી' : 'ગુજરાતી / English'}</span>
          </button>
        </div>
      </div>

      {/* Main branding & responsive action controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/assets/voice-of-valod-zentrix-logo.svg"
            alt="Voice of Valod Zentrix Digital Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain bg-[#071528] shadow-lg shadow-red-500/20 ring-2 ring-red-500/50 shrink-0 p-0.5"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Noto_Sans_Gujarati',sans-serif] truncate">
                {isGu ? 'વોઇસ ઓફ વાલોડ ન્યૂઝ' : 'Voice of Valod News'}
              </h1>
              <span className="text-[10px] sm:text-[11px] font-semibold bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 whitespace-nowrap">
                Local News... Smartly!
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              {isGu
                ? 'એન્કર માયા (Maya) સાથે લાઈવ બુલેટિન • ૧૨ સ્વાયત્ત ન્યૂઝરૂમ એજન્ટો'
                : 'Live bulletins with Anchor Maya • 12 Autonomous Newsroom Agents'}
            </p>
          </div>
        </div>

        {/* Action buttons: 2-col responsive grid on mobile, inline flex on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
          {onOpenCitizenReporter && (
            <button
              type="button"
              onClick={onOpenCitizenReporter}
              className="min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold transition shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'સિટિઝન રિપોર્ટર' : 'Citizen Reporter'}
              </span>
            </button>
          )}

          <a
            href="https://www.youtube.com/@voiceofvalod"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600/15 hover:bg-red-600/25 text-red-300 hover:text-white border border-red-500/40 text-xs font-semibold transition shadow-sm group"
            title="Open YouTube Channel @voiceofvalod"
          >
            <svg className="w-4 h-4 fill-current text-red-500 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="truncate font-mono text-[11px] text-red-300">@voiceofvalod</span>
          </a>

          <button
            type="button"
            onClick={onResetPipeline}
            disabled={pipelineState.isRunning}
            className="min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span>{isGu ? 'રીસેટ' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={onStartPipeline}
            disabled={pipelineState.isRunning}
            className={`col-span-2 sm:col-span-1 min-h-[40px] flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-lg transition ${
              pipelineState.isRunning
                ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30 ring-2 ring-red-500/20 active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 shrink-0 ${pipelineState.isRunning ? 'animate-spin' : 'fill-current'}`} />
            <span className="whitespace-nowrap font-['Noto_Sans_Gujarati',sans-serif]">
              {pipelineState.isRunning
                ? isGu ? 'પાઈપલાઈન ચાલુ છે...' : 'Pipeline Running...'
                : isGu ? '૧૨-એજન્ટ સાઇકલ' : '12-Agent Cycle'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 text-xs">
        {[
          { id: 'pipeline', labelGu: '🚀 લાઈવ પાઈપલાઈન (12 Nodes)', labelEn: '🚀 Live Pipeline (12 Nodes)' },
          {
            id: 'owner_control',
            labelGu: '👑 ઓનર અપ્રૂવલ & સ્ટુડિયો',
            labelEn: '👑 Owner Approval & Studio',
            badge: pendingApprovalCount,
          },
          { id: 'workspace', labelGu: '🎬 એન્કર માયા & YouTube સ્ટુડિયો', labelEn: '🎬 Anchor Maya & YouTube Studio' },
          { id: 'audit', labelGu: '⏱️ ઓડિટ લોગ (Timeline)', labelEn: '⏱️ Audit Log' },
          { id: 'agents', labelGu: '🤖 ૧૨ એજન્ટોની ટીમ', labelEn: '🤖 12 Agents Team' },
          { id: 'factcheck', labelGu: '🛡️ ફેક્ટ-ચેક (Agent 8)', labelEn: '🛡️ Fact-Check (Agent 8)' },
          { id: 'autoreply', labelGu: '💬 ઓટો-રિપ્લાય (Agent 10)', labelEn: '💬 Auto-Reply (Agent 10)' },
          { id: 'analytics', labelGu: '📊 સાપ્તાહિક રીપોર્ટ (Agent 11)', labelEn: '📊 Analytics (Agent 11)' },
          { id: 'integrations', labelGu: '⚙️ n8n / Webhooks', labelEn: '⚙️ n8n / Webhooks' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2.5 font-medium whitespace-nowrap border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === tab.id
                ? 'border-red-500 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{isGu ? tab.labelGu : tab.labelEn}</span>
            {typeof tab.badge === 'number' && tab.badge > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] tabular-nums">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </header>
  );
};

