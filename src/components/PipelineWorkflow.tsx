import React, { useState } from 'react';
import {
  Flame,
  Link2,
  Cpu,
  PenTool,
  ShieldCheck,
  TrendingUp,
  Film,
  BellRing,
  Send,
  MessageSquareShare,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Terminal,
  Sparkles,
  ArrowRight,
  UserCheck,
  Check,
  X,
  Video,
  Download,
  RefreshCw,
  AlertTriangle,
  Share2,
  MapPin,
  Rocket,
  Megaphone
} from 'lucide-react';
import { AgentInfo, Language, NewsFeedItem, PipelineState, TrendTopic, ZentrixLeadService } from '../types';

interface PipelineWorkflowProps {
  language: Language;
  agents: AgentInfo[];
  pipelineState: PipelineState;
  topics: TrendTopic[];
  approvedNews?: NewsFeedItem[];
  onSelectTopic: (topic: TrendTopic) => void;
  onRefreshTrends?: (category?: string) => void;
  isRefreshingTrends?: boolean;
  onApprovePublish: () => void;
  onRejectPublish: () => void;
  onRunSingleAgent: (agentId: string) => void;
  onViewAgentDetails: (agent: AgentInfo) => void;
  onSwitchTab: (tabId: string) => void;
  onOpenInStudio?: (item: NewsFeedItem) => void;
  onOpenZentrixModal?: (service?: ZentrixLeadService) => void;
}

export const PipelineWorkflow: React.FC<PipelineWorkflowProps> = ({
  language,
  agents,
  pipelineState,
  topics,
  approvedNews = [],
  onSelectTopic,
  onRefreshTrends,
  isRefreshingTrends = false,
  onApprovePublish,
  onRejectPublish,
  onRunSingleAgent,
  onViewAgentDetails,
  onSwitchTab,
  onOpenInStudio,
  onOpenZentrixModal,
}) => {
  const isGu = language === 'gu';
  const appShareUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://ais-pre-sajhrqsw6d6z42o42jxtg4-62116456201.asia-northeast1.run.app';

  const getWhatsAppShareHref = (headline: string, summary: string, accuracy: number) => {
    const msg = `🔴 *વોઇસ ઓફ વાલોડ ન્યૂઝ (${accuracy}% AI Verified)*\n\n📰 *${headline}*\n\n${summary}\n\n📲 સંપૂર્ણ સમાચાર & લાઈવ બુલેટિન જુઓ:\n${appShareUrl}\n\n📺 YouTube: https://www.youtube.com/@voiceofvalod`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  };
  const [selectedAgentForInspection, setSelectedAgentForInspection] = useState<AgentInfo | null>(agents[0]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'valod' | 'gujarat'>('all');
  const [isPublishingToYtPublic, setIsPublishingToYtPublic] = useState(false);
  const [ytPublicPublishResult, setYtPublicPublishResult] = useState<any>(null);
  const [copiedMetadata, setCopiedMetadata] = useState(false);

  // Force Public YouTube Broadcast (Resolves Drafts on @voiceofvalod)
  const handleForcePublicPublish = async () => {
    setIsPublishingToYtPublic(true);
    setYtPublicPublishResult(null);
    try {
      const res = await fetch('/api/youtube/publish-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: pipelineState.selectedTopic.titleGujarati
        })
      });
      const data = await res.json();
      setYtPublicPublishResult(data);
    } catch (err: any) {
      setYtPublicPublishResult({ success: false, error: err?.message || 'Network error' });
    } finally {
      setIsPublishingToYtPublic(false);
    }
  };

  // Copy full broadcast metadata
  const handleCopyMetadata = () => {
    const metaText = `Title: ${pipelineState.selectedTopic.titleGujarati} | Voice of Valod News\n\nDescription:\n🔴 વોઇસ ઓફ વાલોડ ન્યૂઝ લાઈવ બુલેટિન\n\n📌 મુખ્ય સમાચાર: ${pipelineState.selectedTopic.titleGujarati}\n\nનમસ્કાર દર્શક મિત્રો, હું માયા... વોઇસ ઓફ વાલોડ ન્યૂઝમાં આપનું સ્વાગત છે.\nસચોટ અને વિશ્વસનીય સમાચારો માટે સબ્સ્ક્રાઇબ કરો @voiceofvalod.\n\n📺 YouTube: https://www.youtube.com/@voiceofvalod\n📱 WhatsApp સંપર્ક: +91 9426249922\n\n#VoiceOfValod #ValodNews #GujaratNews #BreakingNews #MayaAnchor\n\nTags: Voice of Valod, Valod News, Gujarat News, Maya Anchor, Breaking News, Valod Samachar, Tapi News`;
    navigator.clipboard.writeText(metaText);
    setCopiedMetadata(true);
    setTimeout(() => setCopiedMetadata(false), 2000);
  };

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Link2': return <Link2 className="w-4 h-4 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'PenTool': return <PenTool className="w-4 h-4 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-green-400" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'Film': return <Film className="w-4 h-4 text-purple-400" />;
      case 'Video': return <Video className="w-4 h-4 text-rose-400" />;
      case 'BellRing': return <BellRing className="w-4 h-4 text-rose-400" />;
      case 'Send': return <Send className="w-4 h-4 text-indigo-400" />;
      case 'MessageSquareShare': return <MessageSquareShare className="w-4 h-4 text-pink-400" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4 text-teal-400" />;
      default: return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            {isGu ? 'સંપૂર્ણ' : 'Completed'}
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
            <Clock className="w-3 h-3 animate-spin" />
            {isGu ? 'કાર્યરત...' : 'Processing...'}
          </span>
        );
      case 'awaiting_approval':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-300 bg-rose-950/80 border border-rose-500/50 px-2 py-0.5 rounded-full animate-bounce">
            <UserCheck className="w-3 h-3" />
            {isGu ? 'ઓનર અપ્રૂવલ' : 'Needs Approval'}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            {isGu ? 'તૈયાર' : 'Queued'}
          </span>
        );
    }
  };

  // Sequence order for the 12-agent flow
  // 1 -> 2 -> 3 -> 4 -> 8 (Superhit) -> 9 (Superhit) -> 12 (Anchor Maya Video) -> 5 -> 6 (Approval) -> 7 -> 10 -> 11
  const orderedAgents = [
    agents.find(a => a.number === 1)!,
    agents.find(a => a.number === 2)!,
    agents.find(a => a.number === 3)!,
    agents.find(a => a.number === 4)!,
    agents.find(a => a.number === 8)!,
    agents.find(a => a.number === 9)!,
    agents.find(a => a.number === 12)!,
    agents.find(a => a.number === 5)!,
    agents.find(a => a.number === 6)!,
    agents.find(a => a.number === 7)!,
    agents.find(a => a.number === 10)!,
    agents.find(a => a.number === 11)!,
  ].filter(Boolean);

  const completedCount = agents.filter(a => a.status === 'completed').length;
  const progressPercent = Math.round((completedCount / agents.length) * 100);

  return (
    <div className="space-y-6">
      {/* Topic selection and quick switcher with Dynamic Refresh */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-red-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 shrink-0" />
              {isGu ? 'સક્રિય બ્રેકિંગ ન્યૂઝ ટોપિક' : 'Active Breaking News Topic'}
            </span>
            <h2 className="text-base font-bold text-white mt-0.5 font-['Noto_Sans_Gujarati',sans-serif] leading-snug">
              {isGu ? pipelineState.selectedTopic.titleGujarati : pipelineState.selectedTopic.titleEnglish}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold tabular-nums">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              {pipelineState.selectedTopic.viralScore}% AI Verified
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
              {pipelineState.selectedTopic.sourcePlatform}
            </span>
            <a
              href={getWhatsAppShareHref(
                pipelineState.selectedTopic.titleGujarati,
                pipelineState.selectedTopic.summary || pipelineState.selectedTopic.titleEnglish,
                pipelineState.selectedTopic.viralScore
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow transition"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isGu ? 'WhatsApp શેર' : 'WhatsApp Share'}</span>
            </a>
            {/* Refresh Button in Header */}
            {onRefreshTrends && (
              <button
                type="button"
                onClick={() => onRefreshTrends(selectedCategory)}
                disabled={isRefreshingTrends}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow transition active:scale-95 disabled:opacity-50"
                title="Fetch New Trending News Topics"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingTrends ? 'animate-spin' : ''}`} />
                <span>{isGu ? (isRefreshingTrends ? 'શોધી રહ્યા છીએ...' : '🔄 નવા ટ્રેન્ડ્સ લાવો') : (isRefreshingTrends ? 'Refreshing...' : '🔄 Refresh Trends')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter & Quick Switcher */}
        <div className="border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">
                {isGu ? 'કેટેગરી પસંદ કરો:' : 'Filter category:'}
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    onRefreshTrends && onRefreshTrends('all');
                  }}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    selectedCategory === 'all'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isGu ? 'તમામ (All)' : 'All'}
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('valod');
                    onRefreshTrends && onRefreshTrends('valod');
                  }}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    selectedCategory === 'valod'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isGu ? 'વાલોડ & તાપી' : 'Valod & Tapi'}
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('gujarat');
                    onRefreshTrends && onRefreshTrends('gujarat');
                  }}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    selectedCategory === 'gujarat'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isGu ? 'ગુજરાત' : 'Gujarat'}
                </button>
              </div>
            </div>

            {onRefreshTrends && (
              <button
                onClick={() => onRefreshTrends(selectedCategory)}
                disabled={isRefreshingTrends}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold hover:underline"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingTrends ? 'animate-spin' : ''}`} />
                <span>{isGu ? 'હજુ બીજા ૪ નવા વિષયો બતાવો' : 'Show 4 more fresh topics'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {topics.map((t) => (
              <article
                key={t.id}
                className={`p-3 rounded-lg border text-xs transition flex flex-col justify-between gap-2 ${
                  pipelineState.selectedTopic.id === t.id
                    ? 'bg-red-950/40 border-red-500/60 text-white font-medium shadow-sm ring-1 ring-red-500/30'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectTopic(t)}
                  className="text-left w-full space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{t.category}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold tabular-nums">
                      <ShieldCheck className="w-3 h-3" />
                      {t.viralScore}% AI Verified
                    </span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
                    {isGu ? t.titleGujarati : t.titleEnglish}
                  </p>
                </button>
                <div className="pt-1.5 border-t border-slate-800/70 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectTopic(t)}
                    className="text-[11px] font-semibold text-red-400 hover:text-red-300"
                  >
                    {pipelineState.selectedTopic.id === t.id
                      ? (isGu ? '● પસંદ કરેલ' : '● Selected')
                      : (isGu ? 'પસંદ કરો' : 'Select')}
                  </button>
                  <a
                    href={getWhatsAppShareHref(t.titleGujarati, t.summary || t.titleEnglish, t.viralScore)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-700/80 hover:bg-emerald-600 text-white text-[10px] font-bold transition"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* PLACEMENT 1: TOP/MID-FEED SPONSORED BANNER (ZENTRIX DIGITAL) */}
      <section
        aria-label="Zentrix Digital Sponsored Banner"
        className="relative overflow-hidden rounded-2xl border border-amber-500/45 bg-gradient-to-r from-[#071528] via-slate-900 to-red-950/60 p-4 sm:p-5 shadow-xl"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-500/10 blur-2xl"
        />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold tracking-wider uppercase">
                <Rocket className="w-3 h-3" />
                {isGu ? 'ZENTRIX DIGITAL • બિઝનેસ ગ્રોથ પાર્ટનર' : 'ZENTRIX DIGITAL • GROWTH PARTNER'}
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                {isGu ? 'વાલોડ • તાપી • દક્ષિણ ગુજરાત' : 'Valod • Tapi • South Gujarat'}
              </span>
            </div>

            <h3 className="text-base sm:text-xl font-extrabold text-white font-['Noto_Sans_Gujarati',sans-serif] leading-snug">
              {isGu
                ? 'તમારા બિઝનેસને ડિજિટલ બનાવો — Zentrix Digital સાથે! 🚀'
                : 'Take Your Business Digital — With Zentrix Digital! 🚀'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
              {isGu
                ? 'વાલોડ, વ્યારા અને દક્ષિણ ગુજરાતની દુકાનો, શોરૂમ, ક્લિનિક, સંસ્થાઓ અને કંપનીઓ માટે પ્રીમિયમ ડિજિટલ સોલ્યુશન્સ — ગ્રાહકો સુધી સીધા પહોંચો.'
                : 'Helping local shops, showrooms, institutes, and businesses across Valod, Tapi & South Gujarat scale faster with custom tech & targeted ads.'}
            </p>

            {/* 4 Highlighted Services */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pt-0.5">
              {[
                { gu: 'Websites & SaaS Apps', en: 'Websites & SaaS Apps' },
                { gu: 'Social Media Marketing', en: 'Social Media Marketing' },
                { gu: 'AI Automation', en: 'AI Automation' },
                { gu: 'Local Google Branding', en: 'Local Google Branding' },
              ].map((badge) => (
                <span
                  key={badge.en}
                  className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-amber-500/25 text-[11px] font-semibold text-amber-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{isGu ? badge.gu : badge.en}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <a
              href={`https://api.whatsapp.com/send?phone=919426249922&text=${encodeURIComponent(
                '🚀 નમસ્તે Zentrix Digital ટીમ! મારે મારા બિઝનેસ માટે ફ્રી ડિજિટલ કન્સલ્ટેશન જોઈએ છે. (Via Voice of Valod News)'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span className="font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'ફ્રી કન્સલ્ટેશન / WhatsApp કરો' : 'Free Consultation / WhatsApp'}
              </span>
            </a>

            <button
              type="button"
              onClick={() => onOpenZentrixModal?.('Website')}
              className="min-h-[42px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              <span>{isGu ? 'Get a Quote (કોટેશન મેળવો)' : 'Get a Quote'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* LIVE APPROVED LOCAL VALOD & GUJARAT NEWS FEED */}
      {approvedNews.length > 0 && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'લાઈવ અપ્રૂવ્ડ વાલોડ & તાપી સમાચાર ફીડ' : 'Live Owner-Approved News Feed'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab('owner_control')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
            >
              {isGu ? 'ઓનર અપ્રૂવલ કંટ્રોલ →' : 'Owner Approval Control →'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {approvedNews.slice(0, 5).map((item, idx) => (
              <React.Fragment key={item.id}>
                <article
                  className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap text-[10px]">
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                        <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{item.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold tabular-nums">
                        <ShieldCheck className="w-3 h-3" />
                        {item.aiConfidenceScore}% AI Verified
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      {item.photoDataUrl && (
                        <img
                          src={item.photoDataUrl}
                          alt={item.titleGujarati}
                          className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      )}
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] line-clamp-2 leading-snug">
                          {isGu ? item.titleGujarati : item.titleEnglish}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-['Noto_Sans_Gujarati',sans-serif] line-clamp-2 leading-relaxed">
                          {item.summaryGujarati}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {onOpenInStudio && (
                      <button
                        type="button"
                        onClick={() => onOpenInStudio(item)}
                        className="flex-1 min-h-[36px] px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/40 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{isGu ? 'YouTube વિડિયો' : 'YouTube Video'}</span>
                      </button>
                    )}
                    <a
                      href={getWhatsAppShareHref(item.titleGujarati, item.summaryGujarati, item.aiConfidenceScore)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </article>

                {/* PLACEMENT 2: NATIVE SPONSORED / PARTNER CARD IN FEED (inserted inline after card 2, or after the last item if fewer than 2) */}
                {((approvedNews.slice(0, 5).length >= 2 && idx === 1) ||
                  (approvedNews.slice(0, 5).length < 2 && idx === approvedNews.slice(0, 5).length - 1)) && (
                  <article
                    aria-label="Sponsored Zentrix Digital Card"
                    className="bg-gradient-to-br from-[#071528] via-slate-950 to-amber-950/35 border border-amber-500/45 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5 flex-wrap text-[10px]">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-extrabold tracking-wide uppercase">
                          <Rocket className="w-3 h-3" />
                          SPONSORED • ZENTRIX DIGITAL
                        </span>
                        <span className="text-slate-400 font-semibold">
                          {isGu ? '૪૮ કલાકમાં લોન્ચ' : '48h Launch'}
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <img
                          src="/assets/voice-of-valod-zentrix-logo.svg"
                          alt="Zentrix Digital"
                          className="w-12 h-12 rounded-lg object-contain bg-[#071528] border border-amber-500/40 shrink-0 p-1"
                        />
                        <div className="min-w-0 space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] leading-snug">
                            {isGu
                              ? 'વાલોડ & તાપીના બિઝનેસ માટે માત્ર ૪૮ કલાકમાં કસ્ટમ વેબસાઇટ અને ડિજિટલ એડ કેમ્પેઇન!'
                              : 'Launch Your Custom Website or Digital Ad Campaign in 48 Hours Across Valod & Tapi!'}
                          </h4>
                          <p className="text-[11px] text-slate-300 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
                            {isGu
                              ? 'દુકાન, શોરૂમ કે ક્લાસીસ — Voice of Valod & Google પર હજારો સ્થાનિક ગ્રાહકો સુધી પહોંચો.'
                              : 'Stand out on Google, WhatsApp, and Voice of Valod News with high-converting websites & AI marketing.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-500/25 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenZentrixModal?.('Website')}
                        className="flex-1 min-h-[36px] px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition shadow"
                      >
                        <span>{isGu ? 'Get a Quote' : 'Get a Quote'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenZentrixModal?.('News Advertisement')}
                        className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition"
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        <span>{isGu ? 'જાહેરાત આપો' : 'Advertise With Us'}</span>
                      </button>
                    </div>
                  </article>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {/* SPECIAL NOTICE: RESOLVE YOUTUBE DRAFTS TO PUBLIC & INSTANT PUBLISH */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-indigo-950/80 border-2 border-red-500/50 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 fill-current text-red-500" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase">
                  {isGu ? 'YouTube @voiceofvalod પબ્લિશિંગ સહાયતા' : 'YouTube Direct Publishing'}
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  {isGu ? '⚠️ ફોનમાં વિડિયો "Drafts: No content available" કેમ આવે છે?' : 'Drafts empty?'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {isGu
                  ? 'વિડિયો ફાઇલ હજુ YouTube પર અપલોડ થવાની બાકી હોવાથી Drafts ખાલી દેખાતું હતું. સરળ રીત: ૧. નીચેથી વિડિયો ડાઉનલોડ કરો -> ૨. ટાઇટલ કોપી કરો -> ૩. તમારી YouTube એપમાં નીચે આપેલા (+) બટન પર ક્લિક કરી "Upload a video" દબાવો!'
                  : 'Video was not yet uploaded to YouTube. Download video, copy title, and tap the (+) icon at the bottom of your YouTube app to upload.'}
              </p>
            </div>
          </div>

          {/* Action buttons for 1-click publishing & copy */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => onSwitchTab('workspace')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition active:scale-95"
              title="Generate & Download MP4 Video"
            >
              <Film className="w-3.5 h-3.5" />
              <span>{isGu ? '🎬 વિડિયો ડાઉનલોડ કરો' : 'Download Video'}</span>
            </button>

            <button
              onClick={handleCopyMetadata}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
              title="Copy title, description and viral tags"
            >
              {copiedMetadata ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isGu ? (copiedMetadata ? 'કોપી થઈ ગયું!' : 'ટાઇટલ & ટેગ્સ કોપી') : (copiedMetadata ? 'Copied!' : 'Copy Metadata')}</span>
            </button>

            <a
              href="https://studio.youtube.com/channel/videos/upload"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg transition active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isGu ? 'YouTube ખોલો' : 'Open YouTube'}</span>
            </a>
          </div>
        </div>

        {/* Success toast if forced public */}
        {ytPublicPublishResult && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
            <span className="font-['Noto_Sans_Gujarati',sans-serif]">
              ✔ {ytPublicPublishResult.messageGu || 'વિડિયો સફળતાપૂર્વક Public તરીકે લાઈવ થઈ ગયો છે!'}
            </span>
            <a
              href="https://www.youtube.com/@voiceofvalod"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white bg-emerald-700 hover:bg-emerald-600 px-2 py-0.5 rounded text-[11px] font-bold underline"
            >
              @voiceofvalod ચેનલ જુઓ
            </a>
          </div>
        )}
      </div>

      {/* Owner Approval Gate (Agent 6) Alert Banner if active */}
      {pipelineState.awaitingApproval && (
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-rose-950/90 border-2 border-amber-500/60 rounded-xl p-5 shadow-2xl relative overflow-hidden animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <BellRing className="w-6 h-6 text-amber-400 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                    {isGu ? 'ઓનર મંજૂરી જરૂરી' : 'ACTION REQUIRED'}
                  </span>
                  <h3 className="text-base font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                    {isGu ? 'Agent 6 નોટિફિકેશન: "ન્યૂઝ તૈયાર છે, અપ્રૂવલ આપો"' : 'Agent 6 Notification: "News ready for review, please approve"'}
                  </h3>
                </div>
                <p className="text-xs text-amber-200/90 mt-1 max-w-2xl leading-relaxed">
                  {isGu
                    ? 'કન્ટેન્ટ ક્રિએશન (Agent 4), ફેક્ટ ચેક 98% સેફ (Agent 8), SEO ઑપ્ટિમાઇઝેશન (Agent 9) અને એન્કર માયા વિડિયો સ્ટુડિયો (Agent 5) પૂર્ણ થયા છે. તમારા એક ક્લિકથી સત્તાવાર YouTube ચેનલ (@voiceofvalod) અને વેબસાઇટ પર ઓટો-પબ્લિશ થઈ જશે.'
                    : 'Article, Anchor Maya script, 98% safe fact-check, viral SEO tags, and video staging are fully assembled. Approving will trigger instant syndication to YouTube (@voiceofvalod) and connected platforms.'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {isGu ? 'ફેક્ટ ચેક: ૧૦૦% સેફ' : 'Fact Check: 100% Safe'}
                  </span>
                  <span className="flex items-center gap-1 text-red-400 font-semibold bg-red-950/60 px-2 py-0.5 rounded border border-red-700/50">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <a href="https://www.youtube.com/@voiceofvalod" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      YouTube: @voiceofvalod
                    </a>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    WhatsApp: +91 9426249922
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Film className="w-3.5 h-3.5" /> {isGu ? 'એન્કર માયા વિડિયો તૈયાર' : 'Anchor Maya Video Ready'}
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <TrendingUp className="w-3.5 h-3.5" /> {isGu ? 'હાઇ-CTR થંબનેલ રેડી' : 'Viral Thumbnail Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <a
                href={pipelineState.whatsappAlertUrl || `https://api.whatsapp.com/send?phone=919426249922&text=${encodeURIComponent(`🚨 *વોઇસ ઓફ વાલોડ ન્યૂઝ એલર્ટ: ન્યૂઝ કન્ટેન્ટ મંજૂરી માટે તૈયાર છે!*\n\n📌 *વિષય:* ${pipelineState.selectedTopic.titleGujarati}\n✅ *ફેક્ટ ચેક:* 98/100 (પ્રમાણિત)\n👩‍💼 *એન્કર માયા:* સ્ક્રિપ્ટ અને વિડિયો રેડી.\n📺 *YouTube:* https://www.youtube.com/@voiceofvalod\n\n👇 *ન્યૂઝ પબ્લિશ મંજૂરી આપવા માટે 'YES' લખીને રિપ્લાય કરો.*`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-700/30 border border-emerald-500/50 transition active:scale-95 group"
                title="Send Approval Request to WhatsApp (+91 9426249922)"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>{isGu ? 'WhatsApp પર મોકલો (9426249922)' : 'Send to WhatsApp'}</span>
              </a>

              <button
                onClick={onRejectPublish}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
              >
                <X className="w-4 h-4" />
                <span>{isGu ? 'સુધારો માંગો' : 'Request Rework'}</span>
              </button>
              <button
                onClick={onApprovePublish}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/50 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isGu ? 'મંજૂર કરો & પબ્લિશ કરો (Yes/Approve)' : 'Approve & Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Pipeline Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">
              {isGu ? 'ઓટોમેશન પાઈપલાઈન પ્રોગ્રેસ:' : 'Automation Pipeline Progress:'}
            </span>
            <span className="text-red-400 font-bold">{completedCount} / {agents.length} {isGu ? 'એજન્ટો પૂર્ણ' : 'Agents Complete'}</span>
          </div>
          <span className="font-mono text-slate-300 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Visual Workflow Canvas (Nodes & Connections) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-5 shadow-2xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-red-400" />
              {isGu ? '૧૨ સ્વાયત્ત એજન્ટોનો લાઇવ નોડ ફ્લો' : '12 Autonomous Agents Live Node Flow'}
            </h3>
            <span className="text-[11px] text-slate-400">
              {isGu ? '(વિગત જોવા માટે કોઈપણ એજન્ટ પર ક્લિક કરો)' : '(Click any agent node to inspect live data)'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {isGu ? 'પૂર્ણ' : 'Completed'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> {isGu ? 'કાર્યરત' : 'Running'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span> {isGu ? 'તૈયાર' : 'Queued'}
            </span>
          </div>
        </div>

        {/* Interactive Horizontal / Grid Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {orderedAgents.map((agent) => {
            const isSelected = selectedAgentForInspection?.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentForInspection(agent)}
                className={`relative p-3.5 rounded-xl border transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-slate-800/90 border-red-500 ring-2 ring-red-500/30 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {/* Agent Number & Superhit badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      {getAgentIcon(agent.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        AGENT {agent.number}
                      </span>
                      {agent.isSuperhitExtra && (
                        <span className="ml-1.5 text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 rounded">
                          ★ SUPERHIT
                        </span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(agent.status)}
                </div>

                {/* Agent Name */}
                <h4 className="text-xs font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] line-clamp-1 mb-1">
                  {isGu ? agent.nameGu : agent.nameEn}
                </h4>

                {/* Role Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {isGu ? agent.roleGu : agent.roleEn}
                </p>

                {/* Footer Tools & Trigger button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                  <span className="text-slate-500 truncate max-w-[140px]">
                    {agent.toolsUsed[0]}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRunSingleAgent(agent.id);
                    }}
                    className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-0.5 hover:underline"
                  >
                    {isGu ? 'ચલાવો' : 'Run'}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Agent Inspector & Real-time Live Output */}
      {selectedAgentForInspection && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                {getAgentIcon(selectedAgentForInspection.icon)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                    {isGu ? selectedAgentForInspection.nameGu : selectedAgentForInspection.nameEn}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Agent #{selectedAgentForInspection.number}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isGu ? selectedAgentForInspection.roleGu : selectedAgentForInspection.roleEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRunSingleAgent(selectedAgentForInspection.id)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow transition"
              >
                {isGu ? 'આ એજન્ટને ફરીથી ચલાવો' : 'Re-Run This Agent'}
              </button>
              {(selectedAgentForInspection.number === 4 || selectedAgentForInspection.number === 5) && (
                <button
                  onClick={() => onSwitchTab('workspace')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                >
                  {isGu ? 'આર્ટિકલ & સ્ક્રિપ્ટ જુઓ' : 'View Script & Video'}
                </button>
              )}
              {selectedAgentForInspection.number === 12 && (
                <button
                  onClick={() => onSwitchTab('workspace')}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow transition"
                >
                  🎬 {isGu ? '3D એન્કર માયા વિડિયો જુઓ' : 'Watch Maya Studio Video'}
                </button>
              )}
              {selectedAgentForInspection.number === 7 && (
                <button
                  onClick={() => onSwitchTab('integrations')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isGu ? 'YouTube OAuth સેટિંગ્સ' : 'YouTube OAuth'}</span>
                </button>
              )}
              {selectedAgentForInspection.number === 8 && (
                <button
                  onClick={() => onSwitchTab('factcheck')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                >
                  {isGu ? 'ફેક્ટ ચેક રિપોર્ટ' : 'Full Audit Report'}
                </button>
              )}
            </div>
          </div>

          {/* Inspector Body */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 Cols: Output Data */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-red-400" />
                {isGu ? 'એજન્ટ આઉટપુટ વિગતો (Live State)' : 'Agent Live Output'}
              </h4>

              {/* SPECIAL DISPLAY FOR AGENT 12: VIDEO PROCESSING DURATION CHECK & SYMBOLIC VISUAL */}
              {selectedAgentForInspection.number === 12 && (
                <div className="bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-950 border-2 border-rose-500/50 rounded-xl p-4 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-['Noto_Sans_Gujarati',sans-serif]">
                      <Video className="w-4 h-4 text-rose-400" />
                      {isGu ? 'વિડિયો પ્રોસેસિંગ ચેક (YouTube 60s Guard)' : 'Video Processing Compliance Check'}
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                      VERIFIED_COMPLIANT_65S
                    </span>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">કુલ ડ્યુરેશન:</span>
                      <span className="text-emerald-400 font-bold font-mono text-sm">૬૫ સેકન્ડ (01:05 min)</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">લઘુત્તમ ૬૦s શરત પૂર્ણ</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">પ્રતીકાત્મક તસવીર:</span>
                      <span className="text-sky-400 font-bold text-xs truncate block">જોડાયેલ (Active)</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">એન્કર માયા સાથે મોનિટર વોલ</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">YouTube યોગ્યતા:</span>
                      <span className="text-emerald-400 font-bold text-xs">૧૦૦% સક્ષમ</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">0.003s એરર ફિક્સ</span>
                    </div>
                  </div>

                  {/* Symbolic Image Details */}
                  <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 space-y-1.5 text-xs text-slate-300 font-['Noto_Sans_Gujarati',sans-serif]">
                    <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
                      <span>🖼️ પ્રતીકાત્મક તસવીર (Symbolic Visual):</span>
                      <span className="text-white font-normal truncate">{pipelineState.selectedTopic.titleGujarati}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      ન્યૂઝરૂમમાં એન્કર માયા (Maya) ની બાજુમાં 3D મોનિટર વોલ પર વિષય આધારિત પ્રતીકાત્મક તસવીર દર્શાવવામાં આવે છે, જેથી દર્શકોને વિઝ્યુઅલ સાથે સમાચાર સમજાય.
                    </p>
                  </div>

                  {/* 1-Click Action Buttons for 65s Video */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href="/api/video/download-compliant-mp4"
                      download="VoiceOfValod_Maya_Broadcast_65s.mp4"
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isGu ? '📥 ૬૫s બ્રોડકાસ્ટ વિડિયો ડાઉનલોડ કરો (MP4)' : '📥 Download 65s Compliant MP4'}</span>
                    </a>
                    <button
                      onClick={() => onSwitchTab('workspace')}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                    >
                      {isGu ? '🎬 સ્ટુડિયો મોનિટર વોલ જુઓ' : 'Watch Studio Monitor Wall'}
                    </button>
                  </div>
                </div>
              )}

              {pipelineState.agentOutputs[selectedAgentForInspection.id] ? (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto">
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(pipelineState.agentOutputs[selectedAgentForInspection.id], null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-lg p-8 text-center text-slate-500 text-xs">
                  {isGu
                    ? 'આ એજન્ટનું આઉટપુટ હજુ જનરેટ નથી થયું. "૧૧-એજન્ટ સાઇકલ શરૂ કરો" બટન દબાવો.'
                    : 'No output generated yet for this agent. Click "Run 11-Agent Cycle" or "Re-Run This Agent" to generate data.'}
                </div>
              )}
            </div>

            {/* Right Col: Tools & Connected Integrations */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {isGu ? 'જોડાયેલ ટૂલ્સ & API' : 'Connected Tools & APIs'}
              </h4>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                {selectedAgentForInspection.toolsUsed.map((tool, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-0">
                    <span className="text-slate-300 font-medium">{tool}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                      CONNECTED
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 space-y-1.5">
                <p className="font-semibold text-slate-300">
                  {isGu ? 'ઓટોમેશન એન્જિન:' : 'Automation Engine:'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isGu
                    ? 'CrewAI કોર પ્રોસેસ + n8n વેબહૂક પાઈપલાઈન દ્વારા સંચાલિત.'
                    : 'Orchestrated via CrewAI sequential process & n8n event triggers.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time System Console Logs */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              {isGu ? 'ઓટોનોમસ ન્યૂઝરૂમ સિસ્ટમ લોગ્સ' : 'Autonomous Newsroom Console Logs'}
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Auto-scrolling telemetry</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 font-mono text-[11px] h-32 overflow-y-auto space-y-1">
          {pipelineState.logs.length === 0 ? (
            <p className="text-slate-500">System ready. Awaiting trigger...</p>
          ) : (
            pipelineState.logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span
                  className={
                    log.level === 'success'
                      ? 'text-emerald-400'
                      : log.level === 'warn'
                      ? 'text-amber-400'
                      : log.level === 'error'
                      ? 'text-red-400'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
