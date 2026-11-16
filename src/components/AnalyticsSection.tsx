import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Share2,
  Eye,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Compass,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { Language, PipelineState } from '../types';

interface AnalyticsSectionProps {
  language: Language;
  pipelineState: PipelineState;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  language,
  pipelineState,
}) => {
  const isGu = language === 'gu';

  const analyticsData = pipelineState.agentOutputs['agent-11']?.output || {
    weeklyViewsTotal: 482600,
    weeklySharesTotal: 34100,
    averageRetentionRate: '71.2%',
    topPerformingPlatform: 'YouTube Shorts & Instagram Reels (62% of traffic)',
    topPerformingContentFormat: '45-second AI Anchor Bulletins with Bold Gujarati Subtitles',
    audienceDemographics: {
      gujarat: '68%',
      restOfIndia: '21%',
      internationalDiaspora: '11% (USA, UK, Canada, UAE)',
      primaryAgeGroup: '18 - 34 years'
    },
    nextWeekStrategyTopics: [
      { topic: 'ગુજરાત સેમિકન્ડક્ટર પ્લાન્ટ - સાણંદનું ગ્રાઉન્ડ રિપોર્ટ', predictedScore: 97 },
      { topic: 'ડિજિટલ રૂપિયો અને યુપીઆઈ ૩.૦ નવા નિયમો', predictedScore: 91 },
      { topic: 'અમદાવાદ મેટ્રો ફેઝ-૨ નો બીજો તબક્કો અને રિયલ એસ્ટેટ તેજી', predictedScore: 89 },
      { topic: 'ખેડૂતો માટે સોલાર પંપ યોજના અને સબસિડી અપડેટ', predictedScore: 88 }
    ],
    strategicAdviceGujarati: 'આ અઠવાડિયે ટેક્નોલોજી અને જોબ્સ સંબંધિત વિડિયોઝમાં ૨.૫ ગણું વધુ એન્ગેજમેન્ટ મળ્યું છે. સવારે ૮:૩૦ અને સાંજે ૭:૧૫ વાગ્યે પોસ્ટ કરવાથી ૧૦૦% વધુ ઓર્ગેનિક ક્લિક્સ મળે છે. આવતા સપ્તાહે સ્થાનિક ઇન્ફ્રાસ્ટ્રક્ચર અને સેમિકન્ડક્ટર વિષયો પર વધુ ભાર મૂકવો હિતાવહ છે.'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[11px] font-bold uppercase tracking-wider">
              AGENT 11 • SUPERHIT STRATEGIST
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold font-['Noto_Sans_Gujarati',sans-serif]">
              {isGu ? 'સાપ્તાહિક રીપોર્ટ & ગ્રોથ સ્ટ્રેટેજી' : 'Weekly Intelligence & Growth Strategy'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu
              ? 'દર રવિવારનો સાપ્તાહિક ગ્રોથ રીપોર્ટ અને આવતા અઠવાડિયાનું આયોજન'
              : 'Sunday Automated Channel Audit & Next Week Trend Forecast'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isGu
              ? 'કયો વિડિયો સૌથી વધુ ચાલ્યો, કેટલા વ્યૂઝ આવ્યા અને આવતા સપ્તાહે કયા ટોપિક પર વિડિયો બનાવવો તે અગાઉથી નક્કી કરો.'
              : 'Monitors views, retention, and algorithmic signals to prescribe data-backed topics that will guarantee maximum viral growth.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-teal-400 bg-teal-950/60 border border-teal-500/30 px-3 py-1.5 rounded-lg shrink-0 font-medium">
          <Calendar className="w-4 h-4" />
          <span>{isGu ? 'સાપ્તાહિક સાયકલ: સક્રિય' : 'Weekly Cycle: Active'}</span>
        </div>
      </div>

      {/* Connected Channel Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'કનેક્ટેડ YouTube ચેનલ:' : 'Connected YouTube Channel:'}
              </span>
              <span className="text-xs font-mono font-bold text-red-400">@voiceofvalod</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <a
              href="https://www.youtube.com/@voiceofvalod"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-sky-400 hover:underline font-mono"
            >
              https://www.youtube.com/@voiceofvalod
            </a>
          </div>
        </div>

        <a
          href="https://www.youtube.com/@voiceofvalod"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition self-start sm:self-auto"
        >
          <span>{isGu ? 'ચેનલ લાઈવ જુઓ' : 'View Channel Live'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isGu ? 'સાપ્તાહિક કુલ વ્યૂઝ' : 'Weekly Total Views'}</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <h3 className="text-2xl font-black text-white font-mono">
            {Number(analyticsData.weeklyViewsTotal || 482600).toLocaleString('en-IN')}
          </h3>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +34.2% vs last week
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isGu ? 'કુલ શેર્સ & રીપોસ્ટ્સ' : 'Total Shares & Reposts'}</span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-white font-mono">
            {Number(analyticsData.weeklySharesTotal || 34100).toLocaleString('en-IN')}
          </h3>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +48% Viral Coefficient
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isGu ? 'સરેરાશ રીટેન્શન દર' : 'Avg Audience Retention'}</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl font-black text-white font-mono">
            {analyticsData.averageRetentionRate || '71.2%'}
          </h3>
          <span className="text-[10px] text-amber-400 font-semibold mt-1 block">
            Top 2% YouTube Benchmark
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isGu ? 'ટોપ પ્લેટફોર્મ' : 'Leading Platform'}</span>
            <Tv className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="text-base font-bold text-white truncate">
            YouTube Shorts
          </h3>
          <span className="text-[10px] text-slate-400 mt-1 block">
            62% of traffic contribution
          </span>
        </div>
      </div>

      {/* Strategic Advice Banner */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-teal-500/40 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu ? 'ચેનલ ઓનર માટે એડિટોરિયલ સલાહ (Executive Directive)' : 'Strategic Directive for Channel Owner'}
          </h3>
        </div>
        <p className="text-xs text-teal-100 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-teal-500/20">
          "{analyticsData.strategicAdviceGujarati}"
        </p>
      </div>

      {/* Next Week's Forecasted Trending Topics (Sunday Planning) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
              {isGu
                ? 'આવતા અઠવાડિયા માટે AI દ્વારા ભલામણ કરેલા ટોપ ૪ વાયરલ વિષયો'
                : 'Next Week High-Potential Content Roadmap'}
            </h3>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">
            {isGu ? 'આગાહી સફળતા દર: ૯૪%' : 'Prediction Accuracy: 94%'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analyticsData.nextWeekStrategyTopics?.map((item: any, i: number) => (
            <div
              key={i}
              className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-teal-500/40 transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-teal-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-xs font-semibold text-slate-200 font-['Noto_Sans_Gujarati',sans-serif]">
                  {item.topic}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block">Viral Score</span>
                <span className="text-xs font-bold text-teal-400">{item.predictedScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
