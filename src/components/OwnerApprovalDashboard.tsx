import React, { useState } from 'react';
import {
  Check,
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Video,
  Share2,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Film,
  Crown,
  Rocket,
  Building2,
  Phone,
  Send
} from 'lucide-react';
import { Language, NewsFeedItem, ZentrixLead, ZentrixLeadService } from '../types';

interface OwnerApprovalDashboardProps {
  language: Language;
  newsItems: NewsFeedItem[];
  onApproveItem: (itemId: string) => void;
  onRejectItem: (itemId: string) => void;
  onOpenInYouTubeStudio: (item: NewsFeedItem) => void;
  onOpenCitizenReporter: () => void;
  zentrixLeads?: ZentrixLead[];
  onUpdateLeadStatus?: (id: string, status: ZentrixLead['status']) => void;
  onOpenZentrixModal?: (service?: ZentrixLeadService) => void;
}

export const OwnerApprovalDashboard: React.FC<OwnerApprovalDashboardProps> = ({
  language,
  newsItems,
  onApproveItem,
  onRejectItem,
  onOpenInYouTubeStudio,
  onOpenCitizenReporter,
  zentrixLeads = [],
  onUpdateLeadStatus,
  onOpenZentrixModal,
}) => {
  const isGu = language === 'gu';
  const [filterView, setFilterView] = useState<'all' | 'pending' | 'approved' | 'leads'>('all');

  const pendingItems = newsItems.filter(i => i.status === 'pending_approval');
  const approvedItems = newsItems.filter(i => i.status === 'approved');
  const youtubeQueueItems = approvedItems.filter(i => i.inYouTubeQueue);

  const shareUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://ais-pre-sajhrqsw6d6z42o42jxtg4-62116456201.asia-northeast1.run.app';

  const buildWhatsAppShareLink = (item: NewsFeedItem) => {
    const text = `🔴 *વોઇસ ઓફ વાલોડ ન્યૂઝ (${item.aiConfidenceScore}% AI Verified)*\n\n📰 *${item.titleGujarati}*\n📍 ${item.location}\n\n${item.summaryGujarati}\n\n📲 સંપૂર્ણ સમાચાર & લાઈવ વિડિયો જુઓ:\n${shareUrl}\n\n📺 YouTube: https://www.youtube.com/@voiceofvalod`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Control Center Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Crown className="w-4 h-4" />
            <span>{isGu ? 'ઓનર અપ્રૂવલ & સ્ટુડિયો કંટ્રોલ' : 'Owner Approval & Studio Control'}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu
              ? 'AI ફેક્ટ-ચેક વેરિફિકેશન, ઓનર મંજૂરી અને YouTube વિડિયો કતાર'
              : 'AI Fact-Check Gate, Owner Approval & YouTube Studio Queue'}
          </h2>
          <p className="text-xs text-slate-400">
            {isGu
              ? 'સિટિઝન રિપોર્ટર અને ૧૨-એજન્ટ પાઈપલાઈનના તમામ સમાચાર ઓનરની મંજૂરી બાદ જ લાઈવ ફીડ અને YouTube સ્ટુડિયોમાં જશે.'
              : 'All Citizen Reporter & 12-Agent pipeline news requires Owner approval before going live on the feed and YouTube Video Studio.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCitizenReporter}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>{isGu ? '+ સિટિઝન રિપોર્ટ ઉમેરો' : '+ New Citizen Report'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">
              {isGu ? 'ઓનર મંજૂરી બાકી' : 'Pending Owner Approval'}
            </span>
            <span className="text-2xl font-extrabold text-amber-400 tabular-nums">
              {pendingItems.length}
            </span>
          </div>
          <Clock className="w-6 h-6 text-amber-400/80" />
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">
              {isGu ? 'લાઈવ પબ્લિશ્ડ સમાચાર' : 'Live Approved News'}
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              {approvedItems.length}
            </span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400/80" />
        </div>

        <div className="bg-slate-900 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">
              {isGu ? 'YouTube વિડિયો કતાર' : 'YouTube Video Queue'}
            </span>
            <span className="text-2xl font-extrabold text-red-400 tabular-nums">
              {youtubeQueueItems.length}
            </span>
          </div>
          <Video className="w-6 h-6 text-red-400/80" />
        </div>

        <button
          type="button"
          onClick={() => setFilterView('leads')}
          className="bg-gradient-to-br from-[#071528] to-slate-900 border border-amber-400/40 hover:border-amber-400 rounded-xl p-4 flex items-center justify-between text-left transition"
        >
          <div>
            <span className="text-xs text-amber-300 font-semibold block">
              {isGu ? 'Zentrix બિઝનેસ લીડ્સ' : 'Zentrix Business Leads'}
            </span>
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {zentrixLeads.length}
            </span>
          </div>
          <Rocket className="w-6 h-6 text-amber-400" />
        </button>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-fit overflow-x-auto">
        {[
          { id: 'all', labelGu: `બધું (${newsItems.length})`, labelEn: `All (${newsItems.length})` },
          { id: 'pending', labelGu: `મંજૂરી બાકી (${pendingItems.length})`, labelEn: `Pending (${pendingItems.length})` },
          { id: 'approved', labelGu: `લાઈવ & YouTube કતાર (${approvedItems.length})`, labelEn: `Approved (${approvedItems.length})` },
          { id: 'leads', labelGu: `🚀 Zentrix લીડ્સ (${zentrixLeads.length})`, labelEn: `🚀 Zentrix Leads (${zentrixLeads.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterView(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              filterView === tab.id
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isGu ? tab.labelGu : tab.labelEn}
          </button>
        ))}
      </div>

      {/* SECTION 1: PENDING OWNER APPROVAL */}
      {(filterView === 'all' || filterView === 'pending') && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 font-['Noto_Sans_Gujarati',sans-serif]">
            <AlertCircle className="w-4 h-4" />
            <span>
              {isGu ? 'મંજૂરી માટે બાકી સમાચાર (Pending Owner Approval)' : 'Pending Owner Approval Queue'}
            </span>
          </h3>

          {pendingItems.length === 0 ? (
            <div className="bg-slate-900/70 border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400 space-y-2">
              <p>
                {isGu
                  ? 'હાલ કોઈ સમાચાર મંજૂરી માટે બાકી નથી. "૧૨-એજન્ટ સાઇકલ" ચલાવો અથવા સિટિઝન રિપોર્ટ સબમિટ કરો.'
                  : 'No items awaiting approval right now. Run the 12-Agent Cycle or submit a Citizen Report.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 space-y-3 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Unboxed Clean Metadata Header + AI Verified Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="font-semibold text-amber-300">
                          {item.sourceType === 'citizen_reporter'
                            ? (isGu ? 'સિટિઝન રિપોર્ટર' : 'Citizen Reporter')
                            : (isGu ? '૧૨-એજન્ટ પાઈપલાઈન' : '12-Agent Pipeline')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {item.location}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{item.createdAt}</span>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold tabular-nums">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {item.aiConfidenceScore}% AI Verified
                      </span>
                    </div>

                    <div className="flex gap-3 items-start">
                      {item.photoDataUrl && (
                        <img
                          src={item.photoDataUrl}
                          alt={item.titleGujarati}
                          className="w-20 h-20 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      )}
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] leading-snug">
                          {isGu ? item.titleGujarati : item.titleEnglish}
                        </h4>
                        <p className="text-xs text-slate-300 font-['Noto_Sans_Gujarati',sans-serif] line-clamp-3 leading-relaxed">
                          {item.summaryGujarati}
                        </p>
                      </div>
                    </div>

                    {/* AI Fact Check Verdict */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300">
                      <span className="text-emerald-400 font-semibold block text-[11px] mb-0.5">
                        {isGu ? 'AI ફેક્ટ-ચેક તારણ:' : 'AI Fact-Check Verdict:'}
                      </span>
                      <span className="font-['Noto_Sans_Gujarati',sans-serif]">
                        {isGu ? item.factCheckVerdictGu : item.factCheckVerdictEn}
                      </span>
                    </div>
                  </div>

                  {/* Owner Actions */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onApproveItem(item.id)}
                      className="flex-1 min-h-[42px] px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isGu ? 'Approve & Publish (મંજૂર કરો)' : 'Approve & Publish'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectItem(item.id)}
                      className="min-h-[42px] px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <X className="w-4 h-4" />
                      <span>{isGu ? 'નકારો' : 'Reject'}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: APPROVED LIVE FEED & YOUTUBE STUDIO QUEUE */}
      {(filterView === 'all' || filterView === 'approved') && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 font-['Noto_Sans_Gujarati',sans-serif]">
            <Sparkles className="w-4 h-4" />
            <span>
              {isGu
                ? 'લાઈવ અપ્રૂવ્ડ ન્યૂઝ ફીડ & YouTube વિડિયો જનરેટર કતાર'
                : 'Live Approved News Feed & YouTube Video Generator Queue'}
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvedItems.map((item) => (
              <article
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="text-emerald-400 font-semibold">
                        {isGu ? '● લાઈવ પબ્લિશ્ડ' : '● Live Published'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.location}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold tabular-nums">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {item.aiConfidenceScore}% AI Verified
                    </span>
                  </div>

                  <div className="flex gap-3 items-start">
                    {item.photoDataUrl && (
                      <img
                        src={item.photoDataUrl}
                        alt={item.titleGujarati}
                        className="w-20 h-20 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                    )}
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] leading-snug">
                        {isGu ? item.titleGujarati : item.titleEnglish}
                      </h4>
                      <p className="text-xs text-slate-300 font-['Noto_Sans_Gujarati',sans-serif] line-clamp-3 leading-relaxed">
                        {item.summaryGujarati}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenInYouTubeStudio(item)}
                    className="flex-1 min-h-[42px] px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>{isGu ? '🎬 YouTube વિડિયો બનાવો' : '🎬 Generate YouTube Video'}</span>
                  </button>

                  <a
                    href={buildWhatsAppShareLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[42px] px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isGu ? 'WhatsApp શેર' : 'WhatsApp Share'}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ZENTRIX DIGITAL BUSINESS LEADS */}
      {(filterView === 'all' || filterView === 'leads') && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 font-['Noto_Sans_Gujarati',sans-serif]">
              <Rocket className="w-4 h-4" />
              <span>
                {isGu
                  ? `Zentrix Digital બિઝનેસ ઇન્ક્વાયરી & લીડ્સ (${zentrixLeads.length})`
                  : `Zentrix Digital Business Leads & Ad Inquiries (${zentrixLeads.length})`}
              </span>
            </h3>
            {onOpenZentrixModal && (
              <button
                type="button"
                onClick={() => onOpenZentrixModal('Website')}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition"
              >
                {isGu ? '+ નવી ઇન્ક્વાયરી ઉમેરો' : '+ Add Quote / Inquiry'}
              </button>
            )}
          </div>

          {zentrixLeads.length === 0 ? (
            <div className="bg-slate-900/70 border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
              {isGu
                ? 'હજુ સુધી કોઈ બિઝનેસ લીડ આવી નથી. જ્યારે વાચકો "Get a Quote" અથવા "Advertise With Us" ફોર્મ ભરશે ત્યારે અહીં દેખાશે.'
                : 'No business leads yet. Inquiries submitted via "Get a Quote" or "Advertise With Us" will appear here.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zentrixLeads.map((lead) => {
                const digitsOnly = lead.phone.replace(/\D/g, '');
                const waTarget = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
                const replyHref = `https://api.whatsapp.com/send?phone=${waTarget}&text=${encodeURIComponent(
                  `નમસ્તે ${lead.ownerName}જી, Zentrix Digital × Voice of Valod તરફથી! "${lead.businessName}" માટે તમારી ${lead.service} ઇન્ક્વાયરી મળી છે.`
                )}`;
                return (
                  <article
                    key={lead.id}
                    className="bg-slate-900 border border-amber-500/35 rounded-xl p-4 space-y-3 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                          {lead.service}
                        </span>
                        <span className="text-slate-400 tabular-nums">{lead.createdAt}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-['Noto_Sans_Gujarati',sans-serif]">
                          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{lead.businessName}</span>
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                          <span>👤 {lead.ownerName}</span>
                          <span className="flex items-center gap-1 font-mono text-emerald-300">
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </span>
                          {lead.location && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin className="w-3.5 h-3.5 text-red-400" />
                              {lead.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                        {(['new', 'contacted', 'converted'] as ZentrixLead['status'][]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => onUpdateLeadStatus?.(lead.id, st)}
                            className={`px-2 py-1 rounded font-semibold capitalize transition ${
                              lead.status === st
                                ? st === 'converted'
                                  ? 'bg-emerald-600 text-white'
                                  : st === 'contacted'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-red-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <a
                        href={replyHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[36px] px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isGu ? 'WhatsApp જવાબ' : 'Reply on WhatsApp'}</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
