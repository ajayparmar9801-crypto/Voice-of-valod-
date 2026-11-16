import React, { useState, useEffect } from 'react';
import {
  Download,
  Terminal,
  Send,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Cpu,
  Radio,
  Eye,
  EyeOff,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Key,
  Lock,
  XCircle,
  FileText
} from 'lucide-react';
import { Language, TrendTopic } from '../types';

interface IntegrationSettingsProps {
  language: Language;
  onCustomTopicSubmit: (topic: Partial<TrendTopic>) => void;
}

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  language,
  onCustomTopicSubmit,
}) => {
  const isGu = language === 'gu';

  // Telegram direct connection states
  const [telegramBotToken, setTelegramBotToken] = useState(() => {
    return localStorage.getItem('ai_news_telegram_token') || '8853665520:AAEOSLn4VtJTYfwAJSWzv-zJO9j8nbaiAf4';
  });
  const [telegramChatId, setTelegramChatId] = useState(() => {
    return localStorage.getItem('ai_news_telegram_chatid') || '';
  });
  const [showToken, setShowToken] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramResult, setTelegramResult] = useState<any>(null);
  const [isVerifyingConnection, setIsVerifyingConnection] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isDiscoveringChatId, setIsDiscoveringChatId] = useState(false);
  const [discoverResult, setDiscoverResult] = useState<any>(null);
  const [showGetUpdatesGuide, setShowGetUpdatesGuide] = useState(false);
  const [showStepGuide, setShowStepGuide] = useState(true);

  // Generic Webhook states
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'Telegram' | 'Slack' | 'WhatsApp'>('Telegram');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Custom Topic Form state
  const [customTitleGu, setCustomTitleGu] = useState('');
  const [customTitleEn, setCustomTitleEn] = useState('');
  const [customCategory, setCustomCategory] = useState('Gujarat');

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // YouTube Channel state (@voiceofvalod) & OAuth Diagnostics
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState(() => {
    return localStorage.getItem('vov_youtube_channel_url') || 'https://www.youtube.com/@voiceofvalod';
  });
  const [youtubeHandle, setYoutubeHandle] = useState('@voiceofvalod');
  const [youtubePrivacy, setYoutubePrivacy] = useState<'public' | 'unlisted'>('public');
  const [copiedYtUrl, setCopiedYtUrl] = useState(false);
  const [testYtPublishResult, setTestYtPublishResult] = useState<any>(null);
  const [isTestingYtPublish, setIsTestingYtPublish] = useState(false);

  // Real YouTube OAuth 2.0 State & Diagnostics
  const [ytTokenStatus, setYtTokenStatus] = useState<'active' | 'expired' | 'checking'>('active');
  const [ytRemainingSecs, setYtRemainingSecs] = useState<number>(3600);
  const [isVerifyingYt, setIsVerifyingYt] = useState(false);
  const [isRefreshingYt, setIsRefreshingYt] = useState(false);
  const [isTestingYtUpload, setIsTestingYtUpload] = useState(false);
  const [ytVerifyResult, setYtVerifyResult] = useState<any>(null);
  const [ytErrorLog, setYtErrorLog] = useState<any>(null);
  const [ytUploadSuccess, setYtUploadSuccess] = useState<any>(null);
  const [isSimulatingYtFailure, setIsSimulatingYtFailure] = useState(false);

  // Poll / Fetch YouTube OAuth Status on Mount
  const fetchYtStatus = async () => {
    try {
      const res = await fetch('/api/youtube/status');
      const data = await res.json();
      if (data.success) {
        setYtTokenStatus(data.tokenStatus);
        setYtRemainingSecs(data.remainingSeconds);
        if (data.lastUploadError) {
          setYtErrorLog(data.lastUploadError);
        }
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchYtStatus();
  }, []);

  const copyYtUrl = () => {
    navigator.clipboard.writeText(youtubeChannelUrl);
    setCopiedYtUrl(true);
    setTimeout(() => setCopiedYtUrl(false), 2000);
  };

  // Verify YouTube Connection & Check Token Health
  const handleVerifyYtConnection = async () => {
    setIsVerifyingYt(true);
    setYtVerifyResult(null);
    setYtUploadSuccess(null);
    try {
      const res = await fetch('/api/youtube/verify-connection', { method: 'POST' });
      const data = await res.json();
      if (res.status === 401 || !data.success) {
        setYtTokenStatus('expired');
        setYtErrorLog(data.errorLog || {
          statusCode: 401,
          errorCode: 'UNAUTHORIZED_TOKEN_EXPIRED',
          reason: data.error || 'The YouTube OAuth access token has expired.',
          suggestedAction: 'Refresh OAuth Token to restore publishing access.',
          timestamp: new Date().toISOString()
        });
        setYtVerifyResult({
          success: false,
          error: data.error,
          messageGu: data.messageGu || 'YouTube કનેક્શન નિષ્ફળ: Token એક્સપાયર થયો છે.'
        });
      } else {
        setYtTokenStatus('active');
        setYtErrorLog(null);
        setYtVerifyResult(data);
      }
    } catch (err: any) {
      setYtVerifyResult({ success: false, error: err?.message || 'Network error' });
    } finally {
      setIsVerifyingYt(false);
    }
  };

  // Refresh YouTube OAuth Token (Fixes 401 Unauthorized)
  const handleRefreshYtToken = async () => {
    setIsRefreshingYt(true);
    try {
      const res = await fetch('/api/youtube/refresh-token', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setYtTokenStatus('active');
        setYtRemainingSecs(3600);
        setYtErrorLog(null);
        setIsSimulatingYtFailure(false);
        setYtVerifyResult({
          success: true,
          status: 'connected',
          messageGu: data.messageGu,
          refreshedAt: data.refreshedAt,
          token: data.accessTokenMasked
        });
      }
    } catch (err: any) {
      setYtErrorLog({
        statusCode: 500,
        errorCode: 'TOKEN_REFRESH_NETWORK_ERROR',
        reason: err?.message || 'Failed to contact YouTube token endpoint',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRefreshingYt(false);
    }
  };

  // Test Real YouTube Video Upload to @voiceofvalod
  const handleTestYtUpload = async () => {
    setIsTestingYtUpload(true);
    setYtUploadSuccess(null);
    try {
      const res = await fetch('/api/youtube/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: customTitleGu || 'ગાંધીનગર GIFT City માં ૫૦,૦૦૦ નોકરીઓ | વોઇસ ઓફ વાલોડ',
          privacy: youtubePrivacy,
          simulateFailure: isSimulatingYtFailure
        })
      });
      const data = await res.json();
      if (res.status === 401 || !data.success) {
        setYtTokenStatus('expired');
        setYtErrorLog(data.errorLog);
        setYtUploadSuccess(null);
      } else {
        setYtTokenStatus('active');
        setYtErrorLog(null);
        setYtUploadSuccess(data);
      }
    } catch (err: any) {
      setYtErrorLog({
        statusCode: 500,
        errorCode: 'UPLOAD_CONNECTION_ERROR',
        reason: err?.message || 'Network error uploading to YouTube',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTestingYtUpload(false);
    }
  };

  // Toggle Simulated YouTube Token Expiry / Failure
  const handleToggleSimulateFailure = async () => {
    const nextFail = !isSimulatingYtFailure;
    setIsSimulatingYtFailure(nextFail);
    try {
      await fetch('/api/youtube/simulate-failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ makeFail: nextFail })
      });
      await fetchYtStatus();
    } catch {}
  };

  const handleTestYtPublish = () => {
    handleTestYtUpload();
  };

  // WhatsApp API Credentials & Owner Approval State
  const [whatsappPhone, setWhatsappPhone] = useState(() => {
    return localStorage.getItem('ai_news_whatsapp_phone') || '9426249922';
  });
  const [waProvider, setWaProvider] = useState<'cloud_api' | 'twilio'>(() => {
    return (localStorage.getItem('ai_news_wa_provider') as any) || 'cloud_api';
  });
  const [waCloudApiKey, setWaCloudApiKey] = useState(() => {
    return localStorage.getItem('ai_news_wa_cloud_api_key') || 'EAAG9...EAAZB';
  });
  const [waCloudPhoneId, setWaCloudPhoneId] = useState(() => {
    return localStorage.getItem('ai_news_wa_cloud_phone_id') || '104829182749102';
  });
  const [waCloudWabaId, setWaCloudWabaId] = useState(() => {
    return localStorage.getItem('ai_news_wa_cloud_waba_id') || '294819401827391';
  });
  const [waTwilioSid, setWaTwilioSid] = useState(() => {
    return localStorage.getItem('ai_news_wa_twilio_sid') || 'AC982716301827361928371928371928';
  });
  const [waTwilioAuthToken, setWaTwilioAuthToken] = useState(() => {
    return localStorage.getItem('ai_news_wa_twilio_auth_token') || '';
  });
  const [showWaSecret, setShowWaSecret] = useState(false);
  const [isVerifyingWaCreds, setIsVerifyingWaCreds] = useState(false);
  const [waCredsResult, setWaCredsResult] = useState<any>(null);
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [waResult, setWaResult] = useState<any>(null);
  const [copiedWaMsg, setCopiedWaMsg] = useState(false);

  const handleSaveWhatsapp = () => {
    localStorage.setItem('ai_news_whatsapp_phone', whatsappPhone.trim());
  };

  // Save and Verify WhatsApp API Credentials (Meta Cloud API / Twilio)
  const handleSaveAndVerifyWaCredentials = async () => {
    setIsVerifyingWaCreds(true);
    setWaCredsResult(null);

    localStorage.setItem('ai_news_wa_provider', waProvider);
    localStorage.setItem('ai_news_wa_cloud_api_key', waCloudApiKey.trim());
    localStorage.setItem('ai_news_wa_cloud_phone_id', waCloudPhoneId.trim());
    localStorage.setItem('ai_news_wa_cloud_waba_id', waCloudWabaId.trim());
    localStorage.setItem('ai_news_wa_twilio_sid', waTwilioSid.trim());
    localStorage.setItem('ai_news_wa_twilio_auth_token', waTwilioAuthToken.trim());
    localStorage.setItem('ai_news_whatsapp_phone', whatsappPhone.trim());

    try {
      const res = await fetch('/api/whatsapp/verify-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: waProvider,
          apiKey: waCloudApiKey.trim(),
          phoneNumberId: waCloudPhoneId.trim(),
          wabaId: waCloudWabaId.trim(),
          accountSid: waTwilioSid.trim(),
          authToken: waTwilioAuthToken.trim(),
          authorizedPhone: whatsappPhone.trim()
        })
      });
      const data = await res.json();
      setWaCredsResult(data);
    } catch (err: any) {
      setWaCredsResult({ success: false, error: err?.message || 'Error verifying credentials' });
    } finally {
      setIsVerifyingWaCreds(false);
    }
  };

  const handleTestWhatsapp = async () => {
    setIsSendingWa(true);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: whatsappPhone.trim(),
          topicTitle: customTitleGu || 'ગાંધીનગર GIFT City માં ૫૦,૦૦૦ નોકરીઓ | વોઇસ ઓફ વાલોડ',
          actionUrl: window.location.href
        })
      });
      const data = await res.json();
      setWaResult(data);
      if (data.waDirectUrl) {
        window.open(data.waDirectUrl, '_blank');
      }
    } catch (err: any) {
      setWaResult({ success: false, error: err.message });
    } finally {
      setIsSendingWa(false);
    }
  };

  // Save Telegram config to localStorage
  const handleSaveTelegram = () => {
    localStorage.setItem('ai_news_telegram_token', telegramBotToken.trim());
    localStorage.setItem('ai_news_telegram_chatid', telegramChatId.trim());
  };

  // Test Connection: Verifies authorization and reachability via Telegram API
  const testConnection = async () => {
    if (!telegramBotToken.trim()) {
      setVerificationResult({
        success: false,
        authorized: false,
        messageGu: 'કૃપા કરીને Bot Token દાખલ કરો.'
      });
      return;
    }

    handleSaveTelegram();
    setIsVerifyingConnection(true);
    setVerificationResult(null);

    try {
      const res = await fetch('/api/telegram/verify-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: telegramBotToken.trim(),
          chatId: telegramChatId.trim(),
        })
      });

      const data = await res.json();
      setVerificationResult(data);
    } catch (e: any) {
      setVerificationResult({
        success: false,
        authorized: false,
        messageGu: 'સર્વર સાથે કનેક્ટ કરવામાં ક્ષતિ આવી: ' + (e?.message || '')
      });
    } finally {
      setIsVerifyingConnection(false);
    }
  };

  // Auto-discover Chat ID via Telegram getUpdates endpoint
  const handleAutoDiscoverChatId = async () => {
    if (!telegramBotToken.trim()) {
      setDiscoverResult({
        success: false,
        found: false,
        messageGu: 'પહેલાં Bot Token દાખલ કરો.'
      });
      return;
    }

    setIsDiscoveringChatId(true);
    setDiscoverResult(null);

    try {
      const res = await fetch('/api/telegram/get-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: telegramBotToken.trim()
        })
      });

      const data = await res.json();
      setDiscoverResult(data);

      if (data.success && data.found && data.primaryChatId) {
        setTelegramChatId(data.primaryChatId);
        localStorage.setItem('ai_news_telegram_chatid', data.primaryChatId);
      }
    } catch (e: any) {
      setDiscoverResult({
        success: false,
        found: false,
        messageGu: 'getUpdates કોલમાં ક્ષતિ આવી: ' + (e?.message || '')
      });
    } finally {
      setIsDiscoveringChatId(false);
    }
  };

  // Real Telegram API test message
  const testTelegramReal = async () => {
    if (!telegramBotToken.trim() || !telegramChatId.trim()) {
      setTelegramResult({
        success: false,
        adviceGu: 'કૃપા કરીને Bot Token અને Chat ID બંને દાખલ કરો.'
      });
      return;
    }

    handleSaveTelegram();
    setIsTestingTelegram(true);
    setTelegramResult(null);

    try {
      const res = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: telegramBotToken.trim(),
          chatId: telegramChatId.trim(),
          topicTitle: customTitleGu || 'ગાંધીનગર GIFT City માં ૫૦,૦૦૦ નોકરીઓ',
          message: `🚨 *વોઇસ ઓફ વાલોડ ન્યૂઝ - બોટ કનેક્શન સફળ!*\n\nતમારો Telegram Bot સફળતાપૂર્વક Voice of Valod News સાથે કનેક્ટ થઈ ગયો છે.\n\n📌 *વિષય:* GIFT City FinTech Hub & 50,000 Jobs\n✅ *ફેક્ટ ચેક:* 98/100 (પ્રમાણિત)\n🎬 *એન્કર માયા વિડિયો અને સ્ક્રિપ્ટ:* તૈયાર છે\n\nઆગામી વખતે જ્યારે પણ Agent 6 ન્યૂઝ બનાવશે ત્યારે તમને આ બોટ પર સીધો મેસેજ મળશે! ✨`
        })
      });

      const data = await res.json();
      setTelegramResult(data);
    } catch (e: any) {
      setTelegramResult({
        success: false,
        error: e?.message,
        adviceGu: 'સર્વર કનેક્શનમાં ક્ષતિ આવી. ઈન્ટરનેટ કનેક્શન ચેક કરો.'
      });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const testWebhook = async () => {
    setIsTestingWebhook(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/webhook/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: selectedChannel,
          webhookUrl: webhookUrl.trim(),
          payload: {
            text: `🚨 Voice of Valod News Alert: News Ready for Approval!`,
            topic: customTitleGu || 'GIFT City Mega Announcement',
            status: 'AWAITING_OWNER_DECISION'
          }
        })
      });

      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({ success: false, error: e?.message });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitleGu.trim() && !customTitleEn.trim()) return;

    onCustomTopicSubmit({
      titleGujarati: customTitleGu || customTitleEn,
      titleEnglish: customTitleEn || customTitleGu,
      category: customCategory,
      viralScore: 95,
      sourcePlatform: 'Custom Breaking Input',
      summary: customTitleGu,
      sampleKeywords: ['Breaking News', 'Live Update', 'Gujarat']
    });

    setCustomTitleGu('');
    setCustomTitleEn('');
  };

  const crewAiCodeSnippet = `# CrewAI 11-Agent Newsroom Pipeline with Telegram Alert
from crewai import Agent, Task, Crew, Process
import requests

TELEGRAM_BOT_TOKEN = "${telegramBotToken || 'YOUR_BOT_TOKEN'}"
TELEGRAM_CHAT_ID = "${telegramChatId || 'YOUR_CHAT_ID'}"

def send_telegram_approval(topic_title, fact_score):
    """Agent 6: Communicator alert function"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": f"🚨 AI સમાચાર એલર્ટ: '{topic_title}' તૈયાર છે!\\nફેક્ટ સ્કોર: {fact_score}/100.\\nReply YES to publish.",
        "parse_mode": "Markdown"
    }
    return requests.post(url, json=payload).json()

# 1. Trend Finder
trend_finder = Agent(
    role="Trend Finder (ટ્રેન્ડ શોધક)",
    goal="Scan X, Reddit & Google Trends for viral breaking news.",
    backstory="Algorithmic trend scout monitoring high-velocity search surges.",
    verbose=True
)

# 2. Fact-Checker & Policy Guard
fact_checker = Agent(
    role="Fact-Checker & Policy Guard (નકલી ન્યૂઝ રોકનાર)",
    goal="Verify facts against primary records and ensure 100% monetization safety.",
    backstory="Ombudsman ensuring zero copyright strikes and authentic journalism.",
    verbose=True
)

# 3. Content Creator
content_creator = Agent(
    role="Content Creator (ગુજરાતી લેખક)",
    goal="Write compelling articles and AI news anchor scripts in Gujarati.",
    backstory="Senior broadcast scriptwriter.",
    verbose=True
)

# Initialize Crew
crew = Crew(
    agents=[trend_finder, fact_checker, content_creator],
    tasks=[],
    process=Process.sequential
)
crew.kickoff()`;

  const copyCode = () => {
    navigator.clipboard.writeText(crewAiCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyCurl = () => {
    const curlCommand = `curl -X POST "https://api.telegram.org/bot${telegramBotToken || '<YOUR_BOT_TOKEN>'}/sendMessage" \\
  -H "Content-Type: application/json" \\
  -d '{"chat_id": "${telegramChatId || '<YOUR_CHAT_ID>'}", "text": "AI સમાચાર એલર્ટ: ટેસ્ટ સફળ!"}'`;
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider">
            SYSTEM ARCHITECTURE & INTEGRATIONS
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-300 font-semibold font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu ? 'ટેલિગ્રામ બોટ, n8n.io અને CrewAI કનેક્શન્સ' : 'Telegram Bot, n8n.io & CrewAI Management'}
          </span>
        </div>
        <h2 className="text-lg font-bold text-white mt-1 font-['Noto_Sans_Gujarati',sans-serif]">
          {isGu
            ? 'તમારો બનાવેલો Telegram Bot કઈ રીતે કનેક્ટ કરવો?'
            : 'How to Connect Your Telegram Bot & Automation Engine'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isGu
            ? 'તમે BotFather માં બોટ બનાવી લીધો છે? હવે ફક્ત ૨ વિગતો (Bot Token અને Chat ID) નાખીને સીધો તમારા ફોન પર લાઈવ એલર્ટ મેળવો.'
            : 'Easily link your Telegram Bot Token & Chat ID to receive instant mobile approval alerts from Agent 6.'}
        </p>
      </div>

      {/* CARD 0: OFFICIAL YOUTUBE CHANNEL CONNECTOR (@voiceofvalod) */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-950 border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-lg">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase">
                  AGENT 7 & 9 DIRECT PUBLISHER
                </span>
                <span className="text-xs text-slate-400">|</span>
                {ytTokenStatus === 'active' ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 🟢 OAuth 2.0 સક્રિય (Active)
                  </span>
                ) : (
                  <span className="text-xs text-rose-400 font-semibold flex items-center gap-1 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" /> 🔴 Token Expired (401 Unauthorized)
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-mono">
                  {ytTokenStatus === 'active' ? `Valid for ~${Math.max(1, Math.floor(ytRemainingSecs / 60))}m` : 'Refresh Required'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'સત્તાવાર YouTube ચેનલ: Voice of Valod (@voiceofvalod)' : 'Official YouTube Channel: Voice of Valod (@voiceofvalod)'}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Refresh Button in Header */}
            <button
              type="button"
              onClick={handleRefreshYtToken}
              disabled={isRefreshingYt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
              title="Refresh YouTube OAuth Token"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingYt ? 'animate-spin' : ''}`} />
              <span>{isRefreshingYt ? 'Refreshing...' : '🔄 Refresh OAuth Token'}</span>
            </button>

            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition group"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isGu ? 'ચેનલ જુઓ' : 'Visit Channel'}</span>
            </a>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          {/* Channel Info Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Channel Handle</span>
              <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5 mt-0.5">
                <span className="text-red-400">@</span>voiceofvalod
              </span>
              <span className="text-[10px] text-emerald-400 mt-1 block">✔ Verified News Channel</span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Direct YouTube URL</span>
              <div className="flex items-center justify-between mt-0.5">
                <a
                  href={youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-sky-400 hover:underline truncate"
                >
                  {youtubeChannelUrl}
                </a>
                <button
                  onClick={copyYtUrl}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition ml-2 shrink-0"
                  title="Copy Channel Link"
                >
                  {copiedYtUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Full Access & 4K Upload Stream</span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Broadcast News Anchor</span>
              <span className="text-sm font-bold text-rose-300 font-['Noto_Sans_Gujarati',sans-serif] block mt-0.5">
                એન્કર માયા (Anchor Maya)
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">No AI Mention • Natural Voice</span>
            </div>
          </div>

          {/* DIAGNOSTIC SUITE & API CONTROL TOOLBAR */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-red-400" />
                  <span>{isGu ? 'YouTube API કનેક્શન તપાસ અને OAuth ટૂલ્સ' : 'YouTube API Connection Diagnostics & OAuth Tools'}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-['Noto_Sans_Gujarati',sans-serif]">
                  {isGu
                    ? 'જો YouTube વિડિયો પબ્લિશિંગ ફેલ થાય (401 Unauthorized), તો અહીંથી સીધું કનેક્શન ચકાસો અને ૧-ક્લિકમાં OAuth Token Refresh કરો.'
                    : 'If video upload fails with 401 Unauthorized, diagnose connection and refresh OAuth token in 1 click.'}
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Scopes:</span>
                <span className="text-[10px] font-mono bg-slate-900 border border-slate-700 text-sky-300 px-2 py-0.5 rounded">
                  youtube.upload
                </span>
                <span className="text-[10px] font-mono bg-slate-900 border border-slate-700 text-purple-300 px-2 py-0.5 rounded">
                  youtube.readonly
                </span>
              </div>
            </div>

            {/* Diagnostic Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Button 1: Check Connection */}
              <button
                type="button"
                onClick={handleVerifyYtConnection}
                disabled={isVerifyingYt}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className={`w-3.5 h-3.5 text-sky-400 ${isVerifyingYt ? 'animate-spin' : ''}`} />
                <span>{isVerifyingYt ? 'ચકાસી રહ્યું છે...' : isGu ? '🔍 Check Connection' : 'Check API Connection'}</span>
              </button>

              {/* Button 2: Refresh OAuth Token */}
              <button
                type="button"
                onClick={handleRefreshYtToken}
                disabled={isRefreshingYt}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingYt ? 'animate-spin' : ''}`} />
                <span>{isRefreshingYt ? 'ટોકન રીફ્રેશ થઈ રહ્યું છે...' : isGu ? '🔄 Refresh OAuth Token' : '🔄 Refresh OAuth Token'}</span>
              </button>

              {/* Button 3: Test Real Upload */}
              <button
                type="button"
                onClick={handleTestYtUpload}
                disabled={isTestingYtUpload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/50 text-xs font-bold transition active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>{isTestingYtUpload ? 'અપલોડ થઈ રહ્યું છે...' : isGu ? '▶️ Test Video Upload' : '▶️ Test Video Upload'}</span>
              </button>

              {/* Button 4: Simulate Failure (to test error flow & recovery) */}
              <button
                type="button"
                onClick={handleToggleSimulateFailure}
                className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                  isSimulatingYtFailure
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
                title="Simulate token expiration to test error handling and recovery"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isSimulatingYtFailure ? '🧪 401 Failure Active (Simulated)' : '🧪 Simulate Token Expire'}</span>
              </button>
            </div>

            {/* ERROR LOG VIEWER: RENDERED PROMINENTLY WHEN TOKEN EXPIRED OR UPLOAD FAILS */}
            {ytErrorLog && (
              <div className="mt-3 p-4 rounded-xl bg-gradient-to-br from-rose-950/80 to-slate-950 border-2 border-red-500/80 shadow-2xl text-xs space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/30 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 font-bold text-xs">
                      ✕
                    </span>
                    <div>
                      <h5 className="font-bold text-red-300 text-xs flex items-center gap-2">
                        <span>⚠️ YouTube Publishing Failed: 401 Unauthorized (OAuth Token Expired)</span>
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px] font-mono border border-red-500/30">
                          HTTP 401
                        </span>
                      </h5>
                      <span className="text-[11px] text-slate-300 font-mono">
                        Target Channel: <span className="text-white font-semibold">@voiceofvalod</span>
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Refresh & Retry Button directly inside error card */}
                  <button
                    type="button"
                    onClick={async () => {
                      await handleRefreshYtToken();
                      await handleTestYtUpload();
                    }}
                    disabled={isRefreshingYt}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition active:scale-95 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingYt ? 'animate-spin' : ''}`} />
                    <span>🔄 Refresh Token & Retry Upload</span>
                  </button>
                </div>

                {/* Structured Error Diagnostics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="bg-slate-950/90 p-2.5 rounded-lg border border-red-500/20">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Failed Endpoint</span>
                    <span className="font-mono text-slate-200 break-all">
                      {ytErrorLog.endpoint || 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable'}
                    </span>
                  </div>
                  <div className="bg-slate-950/90 p-2.5 rounded-lg border border-red-500/20">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Error Code</span>
                    <span className="font-mono text-red-400 font-bold">
                      {ytErrorLog.errorCode || 'UNAUTHORIZED_TOKEN_EXPIRED'}
                    </span>
                  </div>
                  <div className="bg-slate-950/90 p-2.5 rounded-lg border border-red-500/20 md:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Reason & Resolution</span>
                    <p className="text-slate-200 mt-0.5 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
                      {ytErrorLog.reason || 'YouTube Data API requires a valid OAuth 2.0 access token. The current session token has expired.'}
                    </p>
                    <p className="text-emerald-300 font-semibold mt-1">
                      👉 ઉપાય: ઉપરના "🔄 Refresh Token & Retry Upload" બટન પર ક્લિક કરો. તે નવો ટોકન જનરેટ કરીને વિડિયો અપલોડ ફરી શરૂ કરશે.
                    </p>
                  </div>
                </div>

                {/* Raw JSON Error Log from YouTube API */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">
                    Raw YouTube API Error Log (JSON Telemetry):
                  </span>
                  <pre className="bg-slate-950 p-2.5 rounded-lg border border-red-500/30 text-[10px] font-mono text-red-300/90 overflow-x-auto max-h-36">
                    {JSON.stringify(ytErrorLog, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* SUCCESS BANNER: Real YouTube Video Upload to @voiceofvalod */}
            {ytUploadSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border-2 border-emerald-500/70 text-emerald-200 text-xs space-y-2.5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/40 pb-2">
                  <span className="font-bold flex items-center gap-2 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>YouTube @voiceofvalod ચેનલ પર વિડિયો સફળતાપૂર્વક અપલોડ થયો! 🎉</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    Video ID: {ytUploadSuccess.videoId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-200">
                  <div>
                    <span className="text-slate-400">ચેનલ:</span>{' '}
                    <a href={ytUploadSuccess.channelUrl} target="_blank" rel="noreferrer" className="text-sky-300 underline font-mono">
                      {ytUploadSuccess.channelHandle}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400">એન્કર:</span>{' '}
                    <span className="font-semibold text-rose-300">{ytUploadSuccess.anchor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ફોર્મેટ:</span>{' '}
                    <span className="font-mono text-emerald-300">{ytUploadSuccess.quality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">પ્રાઈવસી:</span>{' '}
                    <span className="capitalize font-semibold text-white">{ytUploadSuccess.privacy}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-500/30">
                  <a
                    href={ytUploadSuccess.shortsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>📱 YouTube Shorts પર જુઓ</span>
                  </a>
                  <a
                    href={ytUploadSuccess.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition border border-slate-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>📺 4K Full Video લિંક</span>
                  </a>
                </div>
              </div>
            )}

            {/* Verification Success Feedback */}
            {ytVerifyResult && ytVerifyResult.success && !ytUploadSuccess && !ytErrorLog && (
              <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{ytVerifyResult.messageGu}</span>
                </div>
                {ytVerifyResult.quotaUnitsRemaining && (
                  <span className="text-[10px] font-mono text-slate-400">
                    Remaining Quota: {ytVerifyResult.quotaUnitsRemaining} units
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Publishing Capabilities Grid */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isGu ? '@voiceofvalod ચેનલ પર ઓટો-પબ્લિશિંગ સુવિધાઓ' : 'Auto-Publishing Capabilities for @voiceofvalod'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-red-400 font-bold block">📱 YouTube Shorts</span>
                <span className="text-[11px] text-slate-300">9:16 Vertical 60fps Reels</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-amber-400 font-bold block">📺 16:9 Full Bulletins</span>
                <span className="text-[11px] text-slate-300">4K Ultra HD Broadcasts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-purple-400 font-bold block">🖼️ High-CTR Thumbnails</span>
                <span className="text-[11px] text-slate-300">1280x720 Auto-Generated</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block">💬 Auto-Engagement</span>
                <span className="text-[11px] text-slate-300">Agent 10 Positive Replies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 0.5: WHATSAPP OWNER APPROVAL PERMISSION ALERT (9426249922) */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl shadow-lg">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase">
                  AGENT 6 WHATSAPP GATE
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 🟢 ઓનર નંબર કનેક્ટેડ (+91 9426249922)
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5 font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'WhatsApp ન્યૂઝ પબ્લિશ મંજૂરી (WhatsApp Owner Approval Permission)' : 'WhatsApp Owner Approval Permission'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestWhatsapp}
              disabled={isSendingWa}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition group"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingWa ? 'મોકલી રહ્યું છે...' : isGu ? '📲 WhatsApp ખોલો & ટેસ્ટ મોકલો' : 'Open WhatsApp & Test'}</span>
            </button>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          {/* WHATSAPP API CREDENTIALS & GATEWAY SETUP (Meta Cloud API / Twilio) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Noto_Sans_Gujarati',sans-serif]">
                  {isGu ? 'વોટ્સએપ API ક્રેડેન્શિયલ્સ સેટઅપ (WhatsApp API Credentials)' : 'WhatsApp API Credentials Setup'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                Gateway: {waProvider === 'cloud_api' ? 'Meta Cloud API' : 'Twilio API'}
              </span>
            </div>

            {/* Provider Switcher */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">{isGu ? 'પ્રોવાઇડર પસંદ કરો:' : 'Select Provider:'}</span>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
                <input
                  type="radio"
                  name="waProvider"
                  value="cloud_api"
                  checked={waProvider === 'cloud_api'}
                  onChange={() => setWaProvider('cloud_api')}
                  className="accent-emerald-500"
                />
                <span className="text-slate-200 font-semibold text-[11px]">Meta WhatsApp Cloud API (Graph API)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
                <input
                  type="radio"
                  name="waProvider"
                  value="twilio"
                  checked={waProvider === 'twilio'}
                  onChange={() => setWaProvider('twilio')}
                  className="accent-emerald-500"
                />
                <span className="text-slate-200 font-semibold text-[11px]">Twilio WhatsApp API</span>
              </label>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {waProvider === 'cloud_api' ? (
                <>
                  <div className="sm:col-span-1">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Permanent API Token / Key:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowWaSecret(!showWaSecret)}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-0.5"
                      >
                        {showWaSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showWaSecret ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showWaSecret ? 'text' : 'password'}
                      value={waCloudApiKey}
                      onChange={(e) => setWaCloudApiKey(e.target.value)}
                      placeholder="EAAG9...EAAZB"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block">developers.facebook.com System Token</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Phone Number ID:
                    </label>
                    <input
                      type="text"
                      value={waCloudPhoneId}
                      onChange={(e) => setWaCloudPhoneId(e.target.value)}
                      placeholder="104829182749102"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block">WhatsApp Sending Phone ID</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      WABA Account ID:
                    </label>
                    <input
                      type="text"
                      value={waCloudWabaId}
                      onChange={(e) => setWaCloudWabaId(e.target.value)}
                      placeholder="294819401827391"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block">Business Manager Account ID</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Twilio Account SID:
                    </label>
                    <input
                      type="text"
                      value={waTwilioSid}
                      onChange={(e) => setWaTwilioSid(e.target.value)}
                      placeholder="AC9827..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block">Twilio Console Account SID</span>
                  </div>

                  <div className="sm:col-span-1">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Twilio Auth Token:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowWaSecret(!showWaSecret)}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-0.5"
                      >
                        {showWaSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showWaSecret ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showWaSecret ? 'text' : 'password'}
                      value={waTwilioAuthToken}
                      onChange={(e) => setWaTwilioAuthToken(e.target.value)}
                      placeholder="38af89b..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block">Primary Secret Auth Token</span>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Sender WhatsApp:
                    </label>
                    <input
                      type="text"
                      defaultValue="whatsapp:+14155238886"
                      readOnly
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-400 font-mono"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block">Twilio Sandbox / Approved Sender</span>
                  </div>
                </>
              )}
            </div>

            {/* Authorized Phone Number field & Save Button Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <span className="text-xs font-semibold text-slate-300 shrink-0">
                  {isGu ? 'મંજૂરી માટે અધિકૃત ફોન નંબર:' : 'Authorized Phone for Approvals:'}
                </span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">+91</span>
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="9426249922"
                    className="w-full pl-10 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-emerald-400 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAndVerifyWaCredentials}
                disabled={isVerifyingWaCreds}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isVerifyingWaCreds ? 'animate-spin' : ''}`} />
                <span>{isVerifyingWaCreds ? 'ચકાસણી થઈ રહી છે...' : isGu ? '💾 ક્રેડેન્શિયલ્સ સેવ & ચકાસો' : 'Save & Verify Credentials'}</span>
              </button>
            </div>

            {/* Verification Result Feedback */}
            {waCredsResult && (
              <div className={`p-3 rounded-lg text-xs flex items-center justify-between ${
                waCredsResult.success
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {waCredsResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  <span>{waCredsResult.messageGu || waCredsResult.status || 'Credentials Updated.'}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  Recipient: {waCredsResult.recipient || `+91 ${whatsappPhone}`}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registered Owner Mobile</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  onBlur={handleSaveWhatsapp}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 w-full"
                  placeholder="9426249922"
                />
                <button
                  type="button"
                  onClick={handleSaveWhatsapp}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 shrink-0 font-medium"
                >
                  {isGu ? 'સેવ' : 'Save'}
                </button>
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block">✔ આ નંબર પર સીધો મેસેજ મળશે</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Agent 6 Trigger Event</span>
              <span className="text-sm font-bold text-white block mt-1 font-['Noto_Sans_Gujarati',sans-serif]">
                ન્યૂઝ રેડી થતાં આપોઆપ એલર્ટ
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                વિડિયો સ્ક્રિપ્ટ, ફેક્ટ સ્કોર અને પબ્લિશ લિંક
              </span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Approval Protocol</span>
              <span className="text-sm font-bold text-amber-300 block mt-1 font-mono">
                Reply 'YES' to Publish
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                ઓનર મંજૂરી વિના કન્ટેન્ટ લાઈવ થશે નહીં
              </span>
            </div>
          </div>

          {/* Interactive Mobile WhatsApp Simulator */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isGu ? 'વોટ્સએપ લાઈવ મેસેજ સિમ્યુલેટર (Phone Preview):' : 'Interactive WhatsApp Mobile Chat Simulator:'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Recipient: +91 {whatsappPhone}
              </span>
            </div>

            {/* Mobile Chat Frame */}
            <div className="max-w-md mx-auto bg-[#0b141a] rounded-2xl border-2 border-emerald-500/40 overflow-hidden shadow-2xl">
              {/* WhatsApp App Bar */}
              <div className="bg-[#202c33] px-3 py-2.5 flex items-center justify-between border-b border-[#2a3942]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1">
                      Voice of Valod News Bot
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono">Verified</span>
                    </h5>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      online • Agent 6
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  +91 {whatsappPhone}
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="p-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:12px_12px] min-h-[220px] flex flex-col justify-end">
                {/* Incoming Message Bubble */}
                <div className="bg-[#005c4b] text-slate-100 rounded-2xl rounded-tl-sm p-3.5 text-xs shadow-lg max-w-[95%] space-y-2 border border-emerald-500/30 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
                  <p className="font-bold text-amber-300 text-[11px]">
                    🚨 વોઇસ ઓફ વાલોડ ન્યૂઝ એલર્ટ: ન્યૂઝ કન્ટેન્ટ મંજૂરી માટે તૈયાર છે!
                  </p>

                  <div className="text-slate-200 text-[11px] space-y-1">
                    <p>📌 <b>વિષય:</b> {customTitleGu || 'ગાંધીનગર GIFT City માં ૫૦,૦૦૦ નવી નોકરીઓની ઘોષણા'}</p>
                    <p>✅ <b>ફેક્ટ ચેક:</b> 98/100 (૧૦૦% પ્રમાણિત અને સુરક્ષિત)</p>
                    <p>👩‍💼 <b>એન્કર માયા:</b> ન્યૂઝ બુલેટિન સ્ક્રિપ્ટ તૈયાર છે.</p>
                    <p>📺 <b>YouTube ચેનલ:</b> <span className="text-sky-300 underline">https://www.youtube.com/@voiceofvalod</span></p>
                  </div>

                  {/* 1-Click Blue Clickable Approval Link */}
                  <div className="pt-1 border-t border-emerald-600/40">
                    <span className="text-[11px] text-amber-200 block font-semibold mb-1">
                      👉 ૧-ક્લિકમાં મંજૂર (Approve) કરવા અહીં ટચ કરો:
                    </span>
                    <a
                      href={`${window.location.origin}/?action=approve&source=whatsapp&phone=${whatsappPhone}`}
                      className="block p-2 rounded-lg bg-[#025144] hover:bg-[#036252] border border-emerald-400/40 text-sky-200 hover:text-white font-mono text-[10px] break-all transition underline"
                      title="Click to simulate 1-click approval"
                    >
                      {`${window.location.origin}/?action=approve&source=whatsapp&phone=${whatsappPhone}`}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-emerald-200/70 pt-1 font-mono">
                    <span>(અથવા 'YES' લખીને રિપ્લાય આપો)</span>
                    <span className="flex items-center gap-0.5">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="text-sky-400 font-bold ml-1">✓✓</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Testing Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleTestWhatsapp}
                disabled={isSendingWa}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSendingWa
                    ? 'વોટ્સએપ ખોલી રહ્યું છે...'
                    : `📲 મારા WhatsApp પર મોકલો (+91 ${whatsappPhone})`}
                </span>
              </button>

              <a
                href={`${window.location.origin}/?action=approve&source=whatsapp&phone=${whatsappPhone}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition active:scale-95"
                title="Simulate tapping the approval link"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>⚡ અપ્રૂવલ લિંક પર ક્લિક કરવાનો ટેસ્ટ (1-Click Test)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/?action=approve&source=whatsapp&phone=${whatsappPhone}`);
                  setCopiedWaMsg(true);
                  setTimeout(() => setCopiedWaMsg(false), 2000);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
              >
                {copiedWaMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWaMsg ? 'લિંક કોપી થઈ ગઈ!' : 'લિંક કોપી કરો'}</span>
              </button>
            </div>

            {/* 3-Step Clear Explainer */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1.5 text-xs">
                💡 {isGu ? 'WhatsApp અપ્રૂવલ લિંક કેવી રીતે કામ કરશે?' : 'How WhatsApp 1-Click Approval Works:'}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300 font-['Noto_Sans_Gujarati',sans-serif]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-emerald-400 font-bold block mb-0.5">૧. મેસેજ આવશે</span>
                  ન્યૂઝ બનતાં જ તમારા વોટ્સએપ પર આ એલર્ટ અને બ્લૂ અપ્રૂવલ લિંક આવશે.
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-amber-400 font-bold block mb-0.5">૨. ૧-ટચ કરો</span>
                  તમે લિંક પર માત્ર એક વાર ટચ કરશો એટલે ન્યૂઝરૂમમાં ઓટોમેટિક "Approved" થઈ જશે.
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-sky-400 font-bold block mb-0.5">૩. આપોઆપ લાઈવ</span>
                  તમારી YouTube ચેનલ (@voiceofvalod) પર એન્કર માયાનો વિડિયો પબ્લિશ થઈ જશે.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 1: REAL TELEGRAM BOT CONNECTOR (Highlighted Primary Card) */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-950 border-2 border-sky-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-2xl shadow-lg">
              ✈️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-sky-500 text-slate-950 font-bold text-[10px] uppercase">
                  AGENT 6 DIRECT LINK
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live Telegram API
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5 font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? 'ટેલિગ્રામ બોટ લાઈવ કનેક્ટર (Live Telegram Bot Connector)' : 'Live Telegram Bot Connector'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowStepGuide(!showStepGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>{isGu ? 'કેવી રીતે કનેક્ટ કરવું? (ગાઈડ)' : 'Connection Tutorial'}</span>
            {showStepGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Step-by-Step Guide Accordion (Visible by default) */}
        {showStepGuide && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-sky-500/30 text-xs space-y-3">
            <h4 className="font-bold text-sky-300 text-xs uppercase tracking-wider flex items-center gap-1.5 font-['Noto_Sans_Gujarati',sans-serif]">
              <Sparkles className="w-4 h-4 text-sky-400" />
              {isGu ? 'બોટ કનેક્ટ કરવાના ૪ સરળ સ્ટેપ્સ:' : '4 Simple Steps to Connect Your Bot:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
              {/* Step 1 */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-sky-400 uppercase">પગલું ૧: Bot Token ક્યાંથી લેવો?</span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
                  તમારા સ્ક્રીનશોટ મુજબ તમારો બોટ <b>@VoiceOfValodNewsBot</b> નો Token <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded font-mono">8853665520:AAEOSLn4VtJTYfwAJSWzv-zJO9j8nbaiAf4</code> છે, જે નીચે પહેલેથી દાખલ કરી દેવાયો છે.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-sky-400 uppercase">પગલું ૨: Chat ID કેવી રીતે જાણવો?</span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
                  Chat ID એ તમારો પોતાનો Telegram ID છે. નીચેના બટન પર ક્લિક કરો અથવા ટેલિગ્રામમાં <b>@userinfobot</b> ખોલી <b>/start</b> દબાવો:
                </p>
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 text-[11px] font-semibold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>👉 અહીં ક્લિક કરી Chat ID મેળવો (@userinfobot)</span>
                </a>
              </div>

              {/* Step 3 - Most Important! */}
              <div className="bg-slate-900/90 p-3.5 rounded-lg border border-amber-500/40 space-y-2 md:col-span-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                  ⚠️ પગલું ૩: સૌથી મહત્વનું પગલું (નહિતર Telegram એરર આપશે!)
                </span>
                <p className="text-[11px] text-amber-200/90 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
                  તમારા બનાવેલા બોટ <b>@VoiceOfValodNewsBot</b> માં જઈને નીચે <b>"/start"</b> બટન પર જરૂરથી ક્લિક કરો!
                  જ્યાં સુધી તમે બોટને એકવાર /start ના કરો ત્યાં સુધી ટેલિગ્રામ સુરક્ષા નિયમ મુજબ બોટ તમને મેસેજ મોકલી શકતો નથી.
                </p>
                <a
                  href="https://t.me/VoiceOfValodNewsBot"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>👉 અહીં ક્લિક કરી તમારા બોટને /start કરો (t.me/VoiceOfValodNewsBot)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* The Connection Form */}
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input 1: Bot Token */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  <span>Telegram Bot Token:</span>
                  <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center gap-1"
                >
                  {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showToken ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showToken ? 'text' : 'password'}
                value={telegramBotToken}
                onChange={(e) => {
                  setTelegramBotToken(e.target.value);
                  localStorage.setItem('ai_news_telegram_token', e.target.value.trim());
                }}
                placeholder="7123456789:AAH..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 font-mono tracking-wide"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                BotFather પાસેથી મળેલો ગુપ્ત API Token
              </span>
            </div>

            {/* Input 2: Chat ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  <span>Telegram Chat ID:</span>
                  <span className="text-red-400">*</span>
                </label>
                {/* Auto-Discover button via getUpdates */}
                <button
                  type="button"
                  onClick={handleAutoDiscoverChatId}
                  disabled={isDiscoveringChatId || !telegramBotToken}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded transition disabled:opacity-50"
                  title="Automatically discover your Chat ID from recent messages sent to your bot"
                >
                  {isDiscoveringChatId ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  )}
                  <span>{isGu ? '⚡ આપોઆપ શોધો (getUpdates)' : '⚡ Auto-Detect Chat ID'}</span>
                </button>
              </div>

              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => {
                  setTelegramChatId(e.target.value);
                  localStorage.setItem('ai_news_telegram_chatid', e.target.value.trim());
                }}
                placeholder="e.g. 987654321 (or click '⚡ આપોઆપ શોધો')"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />

              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-slate-500">
                  {isGu ? 'તમારો વ્યક્તિગત ID અથવા @ચેનલ' : 'Personal ID or @channel'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowGetUpdatesGuide(!showGetUpdatesGuide)}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-0.5 underline font-medium"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{isGu ? 'getUpdates થી ID કેવી રીતે મળે? (ગાઈડ)' : 'How getUpdates works?'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* getUpdates Educational Guide & Browser Link */}
          {showGetUpdatesGuide && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>💡 Telegram 'getUpdates' API દ્વારા Chat ID કેવી રીતે મળે છે?</span>
                </h5>
                <button
                  type="button"
                  onClick={() => setShowGetUpdatesGuide(false)}
                  className="text-slate-500 hover:text-slate-300 text-[10px]"
                >
                  ✕ બંધ કરો
                </button>
              </div>

              <div className="text-[11px] text-slate-300 space-y-2 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
                <p>
                  <b>૧. સિદ્ધાંત:</b> જ્યારે તમે તમારા ટેલિગ્રામ બોટ (<a href="https://t.me/VoiceOfValodNewsBot" target="_blank" rel="noreferrer" className="text-sky-400 underline">@VoiceOfValodNewsBot</a>) માં જઈને <b>/start</b> અથવા <b>"Hi"</b> લખીને મોકલો છો, ત્યારે ટેલિગ્રામ તે મેસેજને બોટની અંદર સંગ્રહિત કરે છે.
                </p>
                <p>
                  <b>૨. getUpdates એન્ડપોઈન્ટ:</b> જ્યારે નીચેની API URL પર વિનંતી મોકલવામાં આવે છે:
                </p>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-amber-300 break-all select-all">
                  https://api.telegram.org/bot{telegramBotToken || '&lt;YOUR_BOT_TOKEN&gt;'}/getUpdates
                </div>
                <p>
                  <b>૩. JSON રિસ્પોન્સ:</b> ટેલિગ્રામ આવો રિસ્પોન્સ પરત આપે છે, જેમાં <code className="text-emerald-300 font-mono">message.chat.id</code> આપોઆપ મળી જાય છે:
                </p>
                <pre className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto">
{`{
  "ok": true,
  "result": [
    {
      "update_id": 98451201,
      "message": {
        "chat": {
          "id": 987654321,   <--- આ તમારો Chat ID છે!
          "first_name": "Ajay",
          "username": "ajay_news"
        },
        "text": "/start"
      }
    }
  ]
}`}
                </pre>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={`https://api.telegram.org/bot${telegramBotToken}/getUpdates`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/40 text-[11px] font-semibold transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>બ્રાઉઝરમાં લાઈવ getUpdates JSON ખોલો</span>
                  </a>
                  <span className="text-slate-400 text-[10px]">
                    (તમે જાતે પણ બ્રાઉઝરમાં Chat ID જોઈ શકો છો)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* getUpdates Auto-Discovery Feedback */}
          {discoverResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                discoverResult.success && discoverResult.found
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-100'
                  : 'bg-amber-950/50 border-amber-500/50 text-amber-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {discoverResult.found ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h5 className="font-bold text-xs">
                      {discoverResult.found
                        ? 'Chat ID આપોઆપ શોધીને સેટ કરી દેવાયો છે! 🎉'
                        : 'હજુ કોઈ નવો સંદેશો મળ્યો નથી'}
                    </h5>
                    <p className="text-[11px] text-slate-300 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
                      {discoverResult.messageGu}
                    </p>
                  </div>
                </div>

                {discoverResult.found && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold shrink-0">
                    ID: {discoverResult.primaryChatId}
                  </span>
                )}
              </div>

              {!discoverResult.found && (
                <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
                  <a
                    href="https://t.me/VoiceOfValodNewsBot"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>૧. t.me/VoiceOfValodNewsBot ખોલી /start મોકલો</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleAutoDiscoverChatId}
                    disabled={isDiscoveringChatId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDiscoveringChatId ? 'animate-spin' : ''}`} />
                    <span>૨. ફરીથી 'આપોઆપ શોધો' દબાવો</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isGu
                  ? 'ટોકન બ્રાઉઝરમાં સુરક્ષિત રીતે સેવ રહેશે (તમારા સિવાય કોઈ જોઈ શકશે નહીં).'
                  : 'Tokens safely stored locally in browser storage.'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Test Connection Button (Verifies Authorization via API) */}
              <button
                type="button"
                onClick={testConnection}
                disabled={isVerifyingConnection || !telegramBotToken}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-sky-500/40 text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow"
                title="Verify authorization via Telegram getMe and getChat API"
              >
                {isVerifyingConnection ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                )}
                <span>
                  {isGu ? 'કનેક્શન ચકાસો (Test Connection)' : 'Test Connection'}
                </span>
              </button>

              {/* Send Real Alert Button */}
              <button
                type="button"
                onClick={testTelegramReal}
                disabled={isTestingTelegram || !telegramBotToken || !telegramChatId}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 ring-2 ring-sky-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isTestingTelegram ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>
                  {isGu
                    ? 'ટેસ્ટ મેસેજ મોકલો (Send Real Alert)'
                    : 'Send Test Alert'}
                </span>
              </button>
            </div>
          </div>

          {/* Test Connection Verification Diagnostics */}
          {verificationResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-3 animate-fadeIn ${
                verificationResult.success && verificationResult.authorized
                  ? 'bg-sky-950/50 border-sky-500/50 text-sky-100'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {verificationResult.success && verificationResult.authorized ? (
                    <span className="p-1 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </span>
                  )}
                  <div>
                    <h5 className="font-bold text-sm">
                      {verificationResult.authorized
                        ? 'બોટ ઓથોરાઈઝેશન સફળ (Bot Authorized) ✅'
                        : 'ઓથોરાઈઝેશન નિષ્ફળ (Authorization Failed)'}
                    </h5>
                    <p className="text-[11px] text-slate-300 font-['Noto_Sans_Gujarati',sans-serif]">
                      {verificationResult.messageGu}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    verificationResult.authorized
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {verificationResult.authorized ? '200 OK • AUTHORIZED' : 'FAILED'}
                </span>
              </div>

              {/* Detailed Breakdown */}
              {verificationResult.bot && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">🤖 Bot Identity:</span>
                    <span className="text-white font-bold">@{verificationResult.bot.username}</span>
                    <span className="text-emerald-400 block text-[10px]">Status: Active & Valid</span>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">💬 Chat Target:</span>
                    <span className="text-white font-bold truncate block">
                      {verificationResult.chat?.title || telegramChatId || 'Not specified'}
                    </span>
                    <span
                      className={`block text-[10px] ${
                        verificationResult.chatAuthorized ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {verificationResult.chatAuthorized ? 'Reachability: Verified' : 'Reachability: Pending /start'}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">🛡️ Messaging Permission:</span>
                    <span
                      className={`font-bold block ${
                        verificationResult.chatAuthorized ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {verificationResult.chatAuthorized ? 'Ready to Send Alerts' : 'Action Required'}
                    </span>
                    <span className="text-slate-400 text-[10px]">Agent 6 Approval Gate</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback Card */}
          {telegramResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                telegramResult.success
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {telegramResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <h5 className="font-bold text-sm">
                    {telegramResult.success
                      ? 'સફળતા! ટેલિગ્રામ પર મેસેજ પહોંચી ગયો છે! 🎉'
                      : 'મેસેજ મોકલવામાં એરર આવી'}
                  </h5>
                  <p className="leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
                    {telegramResult.statusMessage || telegramResult.adviceGu || telegramResult.error}
                  </p>
                  {telegramResult.success && (
                    <div className="flex items-center gap-4 text-[11px] text-emerald-300/80 pt-1 font-mono">
                      <span>Message ID: #{telegramResult.messageId}</span>
                      <span>Recipient: {telegramResult.chat}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Breaking News Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu ? 'નવો કસ્ટમ બ્રેકિંગ ન્યૂઝ ટોપિક ઉમેરો' : 'Add Custom Breaking News Topic'}
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          {isGu
            ? 'તમારો પોતાનો ન્યૂઝ ટોપિક લખો. ૧૧ એજન્ટો આપોઆપ તેના પર આખો રિપોર્ટ અને વિડિયો સ્ક્રિપ્ટ તૈયાર કરશે.'
            : 'Type your own custom headline or breaking event to trigger the 11-agent pipeline.'}
        </p>
        <form onSubmit={handleCustomTopic} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isGu ? 'ગુજરાતી હેડલાઇન:' : 'Gujarati Headline:'}
              </label>
              <input
                type="text"
                required
                value={customTitleGu}
                onChange={(e) => setCustomTitleGu(e.target.value)}
                placeholder="દા.ત., સુરત ડાયમંડ બુર્સમાં વૈશ્વિક વેપારનો નવો વિક્રમ"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 font-['Noto_Sans_Gujarati',sans-serif]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isGu ? 'અંગ્રેજી હેડલાઇન (English Headline):' : 'English Headline:'}
              </label>
              <input
                type="text"
                value={customTitleEn}
                onChange={(e) => setCustomTitleEn(e.target.value)}
                placeholder="e.g. Surat Diamond Bourse hits record global trading volume"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="Gujarat">Gujarat (ગુજરાત)</option>
              <option value="India">India (રાષ્ટ્રીય)</option>
              <option value="Tech">Tech / AI (ટેકનોલોજી)</option>
              <option value="Business">Business / Finance (વેપાર)</option>
              <option value="Sports">Sports (રમતગમત)</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isGu ? '૧૧ એજન્ટો દ્વારા પ્રોસેસ કરો' : 'Process with 11 Agents'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Two-Column Tool Export Cards (n8n & CrewAI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* n8n.io Workflow Export */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                n8n
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">n8n.io Workflow JSON</h3>
                <span className="text-[10px] text-slate-400">Telegram Bot Node Pre-Configured</span>
              </div>
            </div>
            <a
              href="/api/export/n8n"
              download="n8n-newsroom-11-agents.json"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGu ? 'JSON ડાઉનલોડ' : 'Download JSON'}</span>
            </a>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu
              ? 'તમારા n8n માં આ JSON ફાઈલ સીધી ઈમ્પોર્ટ કરો. Telegram નોડમાં તમારો Bot Token અને Chat ID નાખતા જ ન્યૂઝરૂમ ઓટોમેશન શરૂ થઈ જશે.'
              : 'Import this workflow straight into n8n. Includes hourly cron trigger, 11 agent nodes, Telegram approval wait gate, and WordPress multi-publishing.'}
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <p className="text-orange-400 font-semibold">Included Telegram Node in n8n:</p>
            <p>• Node Type: n8n-nodes-base.telegram</p>
            <p>• Operation: sendMessage with Inline Approval Buttons</p>
            <p>• Chat ID: ={`{{ $json.chatId }}`}</p>
          </div>
        </div>

        {/* CrewAI Python Script Export */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                Crew
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">CrewAI Python Project</h3>
                <span className="text-[10px] text-slate-400">Autonomous Multi-Agent Crew</span>
              </div>
            </div>
            <a
              href="/api/export/crewai"
              download="crewai_newsroom_agents.py"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGu ? 'Python સ્ક્રિપ્ટ' : 'Download .py'}</span>
            </a>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu
              ? 'CrewAI પાયથોન સ્ક્રિપ્ટમાં Agent 6 માટે Telegram API કોલ પહેલેથી લખેલો છે. તમારા સર્વર પર એક કમાન્ડથી રન થઈ જશે.'
              : 'Python project defining 11 agents with automated Telegram approval dispatch function.'}
          </p>

          <div className="relative">
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
              {crewAiCodeSnippet}
            </pre>
            <button
              onClick={copyCode}
              className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
              title="Copy Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Generic Webhook Simulator (Slack & WhatsApp) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <BellRing className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu ? 'Slack & WhatsApp વેબહૂક ચેનલ સિમ્યુલેટર' : 'Slack & WhatsApp Webhook Simulator'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['Slack', 'WhatsApp'] as const).map((channel) => (
            <button
              key={channel}
              type="button"
              onClick={() => setSelectedChannel(channel)}
              className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                selectedChannel === channel
                  ? 'bg-rose-950/40 border-rose-500 text-white ring-1 ring-rose-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>{channel}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                {channel === 'Slack'
                  ? 'Slack Incoming Webhook URL'
                  : 'WhatsApp Business Cloud API'}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder={
              selectedChannel === 'Slack'
                ? 'https://hooks.slack.com/services/... (or leave empty to simulate)'
                : 'https://graph.facebook.com/v18.0/<PHONE_NUMBER_ID>/messages'
            }
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
          />
          <button
            onClick={testWebhook}
            disabled={isTestingWebhook}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 transition disabled:opacity-50 shrink-0"
          >
            {isTestingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isGu ? 'ટેસ્ટ એલર્ટ મોકલો' : 'Send Test Alert'}</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {testResult.statusMessage || 'Webhook dispatched successfully!'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">200 OK</span>
          </div>
        )}
      </div>
    </div>
  );
};
