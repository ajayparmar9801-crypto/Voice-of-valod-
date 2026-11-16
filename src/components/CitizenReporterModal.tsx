import React, { useState, useRef } from 'react';
import {
  Camera,
  MapPin,
  Send,
  X,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
  User
} from 'lucide-react';
import { Language, NewsFeedItem } from '../types';

interface CitizenReporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSubmitVerifiedItem: (item: NewsFeedItem) => void;
  onGoToOwnerDashboard: () => void;
}

const VALOD_TAPI_LOCATIONS = [
  'વાલોડ (Valod), તાપી',
  'વ્યારા (Vyara), તાપી',
  'બાજીપુરા (Bajipura), વાલોડ',
  'બુહારી (Buhari), વાલોડ',
  'અલગાટ (Algat), વાલોડ',
  'સોનગઢ (Songadh), તાપી',
  'ડોલવણ (Dolvan), તાપી',
  'ઉચ્છલ / નિઝર, તાપી'
];

export const CitizenReporterModal: React.FC<CitizenReporterModalProps> = ({
  isOpen,
  onClose,
  language,
  onSubmitVerifiedItem,
  onGoToOwnerDashboard,
}) => {
  const isGu = language === 'gu';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState(VALOD_TAPI_LOCATIONS[0]);
  const [category, setCategory] = useState('Valod & Tapi');
  const [reporterName, setReporterName] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedItem, setSubmittedItem] = useState<NewsFeedItem | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg(isGu ? 'ફોટો 4MB થી નાનો હોવો જોઈએ.' : 'Photo size must be under 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoDataUrl(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) {
      setErrorMsg(isGu ? 'કૃપા કરીને સમાચારનું શીર્ષક અને સંપૂર્ણ વિગત લખો.' : 'Please enter both headline and news details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/citizen-report/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          details,
          location,
          category,
          reporterName: reporterName || (isGu ? 'વાલોડ નાગરિક' : 'Local Citizen'),
          photoDataUrl
        })
      });

      const data = await res.json();
      if (data?.success && data.item) {
        setSubmittedItem(data.item);
        onSubmitVerifiedItem(data.item);
      } else {
        setErrorMsg(data?.messageGu || data?.error || 'Submission failed.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error while verifying report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setTitle('');
    setDetails('');
    setReporterName('');
    setPhotoDataUrl('');
    setSubmittedItem(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-900 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4 text-red-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white truncate font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'સિટિઝન રિપોર્ટર (Citizen Reporter)' : 'Citizen Reporter Submission'}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {isGu ? 'વાલોડ & તાપીના સ્થાનિક સમાચાર ફોટો સાથે મોકલો' : 'Submit local Valod & Tapi news with photo & location'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="min-h-[40px] min-w-[40px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {submittedItem ? (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    {isGu ? 'AI ફેક્ટ-ચેક સફળ!' : 'AI Fact-Check Passed!'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-500/30 tabular-nums">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {submittedItem.aiConfidenceScore}% AI Verified
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                  {submittedItem.titleGujarati}
                </h4>
                <p className="text-xs text-slate-300 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
                  {submittedItem.factCheckVerdictGu}
                </p>
                <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-amber-300">
                  <span>{isGu ? 'સ્થિતિ: ઓનર મંજૂરી બાકી (Pending Owner Approval)' : 'Status: Pending Owner Approval'}</span>
                  <span>{submittedItem.location}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onGoToOwnerDashboard();
                  }}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg transition"
                >
                  {isGu ? '👑 ઓનર અપ્રૂવલ ડેશબોર્ડ ખોલો' : '👑 Open Owner Approval Tab'}
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  {isGu ? 'બંધ કરો' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-['Noto_Sans_Gujarati',sans-serif]">
                  {isGu ? 'સમાચારનું શીર્ષક (Headline) *' : 'News Headline *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isGu ? 'દા.ત. વાલોડ બજારમાં નવા ઓવરબ્રિજનું કામ શરૂ...' : 'e.g. Valod Market road repair work begins...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-['Noto_Sans_Gujarati',sans-serif]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{isGu ? 'સ્થળ / ગામ (Location)' : 'Location'}</span>
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-['Noto_Sans_Gujarati',sans-serif]"
                  >
                    {VALOD_TAPI_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>{isGu ? 'તમારું નામ (Reporter Name)' : 'Your Name'}</span>
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder={isGu ? 'દા.ત. રાકેશ પટેલ' : 'e.g. Rakesh Patel'}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-['Noto_Sans_Gujarati',sans-serif]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isGu ? 'કેટેગરી (Category)' : 'Category'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'Valod & Tapi', labelGu: 'વાલોડ & તાપી' },
                    { id: 'Agriculture', labelGu: 'ખેતી & યાર્ડ' },
                    { id: 'Weather & Civic', labelGu: 'હવામાન / રસ્તા' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`py-2 px-2 rounded-lg text-[11px] font-semibold border transition ${
                        category === cat.id
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {isGu ? cat.labelGu : cat.id}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-['Noto_Sans_Gujarati',sans-serif]">
                  {isGu ? 'સમાચારની સંપૂર્ણ વિગત (Details) *' : 'Full News Report Details *'}
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={isGu ? 'ઘટના ક્યારે બની, સ્થાનિક લોકોને શું અસર થશે તેની વિગત લખો...' : 'Describe what happened, time, and local impact...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed"
                  required
                />
              </div>

              {/* Photo Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isGu ? 'ઘટનાનો ફોટો ઉમેરો (Photo Upload)' : 'Attach Ground Photo (Optional)'}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>{isGu ? (photoDataUrl ? 'બીજો ફોટો પસંદ કરો' : '📷 ફોટો અપલોડ કરો') : (photoDataUrl ? 'Change Photo' : '📷 Choose Photo')}</span>
                  </button>
                  {photoDataUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={photoDataUrl}
                        alt="Citizen Report Preview"
                        className="w-14 h-10 object-cover rounded-lg border border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoDataUrl('')}
                        className="text-xs text-rose-400 hover:text-rose-300 underline"
                      >
                        {isGu ? 'હટાવો' : 'Remove'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-['Noto_Sans_Gujarati',sans-serif]">
                  {isGu
                    ? 'સબમિટ કર્યા પછી AI ફેક્ટ-ચેક એજન્ટ સમાચારની ચકાસણી કરશે અને ઓનર અપ્રૂવલ માટે મોકલશે.'
                    : 'Upon submission, the AI Fact-Check Agent verifies the report and queues it for Owner Approval before publishing.'}
                </span>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isGu ? 'AI ફેક્ટ-ચેક ચાલુ છે...' : 'Verifying via AI Agent...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isGu ? 'સમાચાર મોકલો & AI ચકાસણી કરો' : 'Submit & Run AI Fact-Check'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                >
                  {isGu ? 'રદ કરો' : 'Cancel'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
