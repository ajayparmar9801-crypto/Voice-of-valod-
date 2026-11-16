import React, { useEffect, useState } from 'react';
import {
  X,
  Rocket,
  CheckCircle2,
  Send,
  Building2,
  User,
  Phone,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Language, ZentrixLead, ZentrixLeadService } from '../types';

interface ZentrixLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialService?: ZentrixLeadService;
  onLeadSubmitted: (lead: ZentrixLead) => void;
}

const SERVICE_OPTIONS: {
  id: ZentrixLeadService;
  labelGu: string;
  labelEn: string;
}[] = [
  { id: 'Website', labelGu: 'વેબસાઇટ / બિઝનેસ એપ', labelEn: 'Website / SaaS App' },
  { id: 'Social Media Ads', labelGu: 'સોશિયલ મીડિયા એડ્સ', labelEn: 'Social Media Ads' },
  { id: 'AI Tool', labelGu: 'AI ઓટોમેશન ટૂલ', labelEn: 'AI Automation Tool' },
  { id: 'News Advertisement', labelGu: 'Voice of Valod જાહેરાત', labelEn: 'News Advertisement' }
];

export const ZentrixLeadModal: React.FC<ZentrixLeadModalProps> = ({
  isOpen,
  onClose,
  language,
  initialService = 'Website',
  onLeadSubmitted
}) => {
  const isGu = language === 'gu';
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('વાલોડ / તાપી');
  const [service, setService] = useState<ZentrixLeadService>(initialService);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<ZentrixLead | null>(null);

  useEffect(() => {
    if (isOpen) {
      setService(initialService);
      setErrorMsg(null);
    }
  }, [isOpen, initialService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!businessName.trim() || !ownerName.trim() || !phone.trim()) {
      setErrorMsg(
        isGu
          ? 'કૃપા કરીને બિઝનેસનું નામ, માલિકનું નામ અને મોબાઇલ/WhatsApp નંબર ભરો.'
          : 'Please enter Business/Shop Name, Owner Name, and Mobile/WhatsApp Number.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/zentrix/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          ownerName: ownerName.trim(),
          phone: phone.trim(),
          location: location.trim() || 'વાલોડ / તાપી',
          service
        })
      });
      const json = await res.json();
      if (!res.ok || !json?.success || !json.lead) {
        throw new Error(json?.messageGu || json?.error || 'Could not save inquiry');
      }

      onLeadSubmitted(json.lead);
      setSubmittedLead(json.lead);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setBusinessName('');
    setOwnerName('');
    setPhone('');
    setLocation('વાલોડ / તાપી');
    setSubmittedLead(null);
    setErrorMsg(null);
    onClose();
  };

  const whatsAppPreFilledUrl = submittedLead
    ? `https://api.whatsapp.com/send?phone=919426249922&text=${encodeURIComponent(
        `🚀 *Zentrix Digital x Voice of Valod Inquiry*\n\n` +
          `🏢 *Business/Shop:* ${submittedLead.businessName}\n` +
          `👤 *Owner:* ${submittedLead.ownerName}\n` +
          `📱 *Mobile:* ${submittedLead.phone}\n` +
          `📍 *Location:* ${submittedLead.location || 'Valod / Tapi'}\n` +
          `⚡ *Service Needed:* ${submittedLead.service}\n\n` +
          `નમસ્તે Zentrix Digital ટીમ, કૃપા કરીને મને આ સેવા માટે કોટેશન અને વિગતો મોકલો.`
      )}`
    : '#';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Hire Zentrix Digital"
    >
      <div className="bg-[#071528] border-2 border-amber-500/60 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/assets/voice-of-valod-zentrix-logo.svg"
              alt="Zentrix Digital Logo"
              className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-500/40 object-contain shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Rocket className="w-3.5 h-3.5 shrink-0" />
                {isGu ? 'Zentrix Digital બિઝનેસ ગ્રોથ પાર્ટનર' : 'Zentrix Digital • Growth Partner'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] leading-tight mt-0.5">
                {isGu ? 'ફ્રી કોટેશન મેળવો / જાહેરાત આપો' : 'Hire Zentrix Digital / Get a Quote'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedLead ? (
          <div className="space-y-4 py-2">
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  {isGu
                    ? 'તમારી ઇન્ક્વાયરી Owner Studio માં સેવ થઈ ગઈ છે!'
                    : 'Your inquiry is saved in the Owner Studio Dashboard!'}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
                {isGu
                  ? `${submittedLead.businessName} (${submittedLead.service}) માટેની વિનંતી પ્રાપ્ત થઈ છે. ઝડપી રિપ્લાય માટે નીચેના બટનથી સીધો WhatsApp મેસેજ મોકલો.`
                  : `We received your request for ${submittedLead.businessName} (${submittedLead.service}). Tap below to send directly via WhatsApp for instant response.`}
              </p>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">{isGu ? 'બિઝનેસ:' : 'Business:'}</span>
                <span className="font-bold text-white">{submittedLead.businessName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">{isGu ? 'માલિક:' : 'Owner:'}</span>
                <span className="font-semibold text-white">{submittedLead.ownerName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">{isGu ? 'મોબાઇલ:' : 'Phone:'}</span>
                <span className="font-mono text-amber-300">{submittedLead.phone}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">{isGu ? 'સેવા:' : 'Service:'}</span>
                <span className="font-bold text-red-400">{submittedLead.service}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <a
                href={whatsAppPreFilledUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>{isGu ? '💬 Send on WhatsApp (૧-ક્લિક મોકલો)' : '💬 Send on WhatsApp'}</span>
              </a>
              <button
                type="button"
                onClick={resetAndClose}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                {isGu ? 'બંધ કરો' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <p className="text-xs text-slate-300 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
              {isGu
                ? 'વાલોડ, તાપી અને દક્ષિણ ગુજરાતની દુકાનો, શોરૂમ, શાળા/કોલેજ અને કંપનીઓ માટે આધુનિક વેબસાઇટ, AI ટૂલ્સ અને સોશિયલ મીડિયા માર્કેટિંગ.'
                : 'Launch custom websites, AI automation tools, and high-ROI digital ad campaigns for businesses across Valod, Tapi & South Gujarat.'}
            </p>

            {/* Business / Shop Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isGu ? 'બિઝનેસ / દુકાન / સંસ્થાનું નામ *' : 'Business / Shop / Institute Name *'}</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={isGu ? 'દા.ત. પટેલ મોબાઇલ ઝોન / જલારામ એગ્રો વાલોડ' : 'e.g. Patel Auto Care, Valod'}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-['Noto_Sans_Gujarati',sans-serif]"
                required
              />
            </div>

            {/* Owner Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isGu ? 'માલિકનું નામ *' : 'Owner Name *'}</span>
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={isGu ? 'તમારું પૂરું નામ' : 'Your Full Name'}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-['Noto_Sans_Gujarati',sans-serif]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isGu ? 'મોબાઇલ / WhatsApp નંબર *' : 'Mobile / WhatsApp Number *'}</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{isGu ? 'શહેર / તાલુકો' : 'City / Taluka'}</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="વાલોડ / વ્યારા / બારડોલી / સુરત"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-['Noto_Sans_Gujarati',sans-serif]"
              />
            </div>

            {/* Service Needed */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isGu ? 'તમારે કઈ સેવા જોઈએ છે?' : 'Service Needed:'}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setService(opt.id)}
                    className={`min-h-[42px] px-3 py-2 rounded-xl border text-left text-xs font-bold transition ${
                      service === opt.id
                        ? 'bg-gradient-to-r from-red-600/90 to-amber-600/90 text-white border-amber-400 shadow'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-['Noto_Sans_Gujarati',sans-serif]">
                      {isGu ? opt.labelGu : opt.labelEn}
                    </span>
                    <span className="text-[10px] opacity-80 font-normal">
                      {opt.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-500/50 text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Rocket className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? (isGu ? 'સેવ થાય છે...' : 'Submitting...')
                    : (isGu ? 'કોટેશન મોકલો & સેવ કરો' : 'Submit & Get Quote')}
                </span>
              </button>
              <button
                type="button"
                onClick={resetAndClose}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition"
              >
                {isGu ? 'રદ કરો' : 'Cancel'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
