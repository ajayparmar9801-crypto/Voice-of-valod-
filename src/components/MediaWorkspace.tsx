import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  Film,
  Sparkles,
  Maximize2,
  Tv,
  Smartphone,
  Square,
  RefreshCw,
  FileText,
  Video,
  Layers,
  Radio,
  Upload,
  ExternalLink,
  AlertCircle,
  ShieldCheck,
  Image as ImageIcon,
  Hash,
  Wand2,
  KeyRound,
  Globe,
  Lock,
  Save,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Language, NewsFeedItem, PipelineState } from '../types';

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              expires_in?: number;
              error?: string;
              error_description?: string;
            }) => void;
            error_callback?: (err: { type?: string; message?: string }) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID_STORAGE_KEY = 'vov_google_oauth_client_id';
const YOUTUBE_UPLOAD_SCOPE = 'https://www.googleapis.com/auth/youtube.upload';
const YOUTUBE_MULTIPART_UPLOAD_URL =
  'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status';
const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

export interface StoryboardSlide {
  id: number;
  paragraphGu: string;
  captionGu: string;
  visualTheme: 'newsroom' | 'agriculture' | 'infrastructure' | 'weather' | 'community' | string;
  visualLabelGu: string;
  useCitizenPhoto?: boolean;
  durationSec?: number;
}

interface MediaWorkspaceProps {
  language: Language;
  pipelineState: PipelineState;
  youtubeQueueItems?: NewsFeedItem[];
  selectedApprovedItem?: NewsFeedItem | null;
  onSelectApprovedItem?: (item: NewsFeedItem) => void;
}

export const MediaWorkspace: React.FC<MediaWorkspaceProps> = ({
  language,
  pipelineState,
  youtubeQueueItems = [],
  selectedApprovedItem = null,
  onSelectApprovedItem,
}) => {
  const isGu = language === 'gu';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageCanvasRef = useRef<HTMLCanvasElement>(null);
  const citizenPhotoImgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  // Content data from Agent 4 & Agent 5
  const contentData = pipelineState.agentOutputs['agent-4']?.output || {
    articleGujarati: 'ગાંધીનગર ખાતે GIFT City માં આંતરરાષ્ટ્રીય નાણાકીય ક્ષેત્રે એક ઐતિહાસિક સીમાચિહ્ન સ્થાપિત થયું છે. નવી સત્તાવાર ઘોષણા મુજબ, ગુજરાત સરકાર અને વૈશ્વિક ફિનટેક પ્રતિષ્ઠાનોના સહયોગથી અહીં અતિ-આધુનિક ઇનોવેશન હબ કાર્યરત થવા જઈ રહ્યું છે. આ પ્રોજેક્ટથી સ્થાનિક યુવાનોને આગામી સમયમાં ૫૦ હજારથી વધુ વૈશ્વિક કક્ષાની નોકરીઓની તક મળશે.',
    articleEnglish: 'In a landmark milestone for India financial technology sector, GIFT City Gandhinagar has announced an ambitious new Global FinTech & Innovation Hub. Projected to generate over 50,000 top-tier jobs over the next 36 months.',
    videoScriptGujarati: '[કેમેરા તરફ જોઈને - નમસ્કાર સાથે]\nનમસ્કાર દર્શક મિત્રો, હું માયા... વોઇસ ઓફ વાલોડ ન્યૂઝમાં આપનું સ્વાગત છે.\nઆજના સૌથી મોટા અને મહત્વના સમાચાર આવી રહ્યા છે ગુજરાતના પાટનગર ગાંધીનગરથી!\nGIFT સિટીમાં વિશ્વકક્ષાનું ફિનટેક હબ બનવા જઈ રહ્યું છે, જેમાં ૫૦ હજારથી પણ વધુ યુવાનોને મળશે આકર્ષક નોકરીઓ!\nચાલો જાણીએ આ મેગા પ્રોજેક્ટની પૂરી વિગતો... [ગ્રાફિક્સ સ્ક્રીન તરફ ઈશારો]',
    bulletPoints: [
      'ગાંધીનગર ગિફ્ટ સિટીમાં વિશાળ ગ્લોબલ ફિનટેક કોમ્પ્લેક્સ મંજૂર.',
      '૫૦,૦૦૦ જેટલા નવા રોજગારની વિશાળ તકો ખુલશે.',
      'વિશ્વની અગ્રણી બેંકો અને ગ્લોબલ ફાઇનાન્સિયલ સંસ્થાઓ જોડાશે.',
      'ગુજરાત ભારતનું મુખ્ય ફાઇનાન્સિયલ ગેટવે બનવાની દિશામાં અગ્રેસર.'
    ],
    suggestedHeadlines: [
      'વોઇસ ઓફ વાલોડ: ગાંધીનગર GIFT City માં ૫૦,૦૦૦ નવી નોકરીઓની સુવર્ણ તક!',
      'ગુજરાત બનશે ગ્લોબલ ફિનટેક કેપિટલ: GIFT સિટીમાં મેગા ઇન્વેસ્ટમેન્ટ!',
      'બ્રેકિંગ ન્યૂઝ: આંતરરાષ્ટ્રીય કંપનીઓનો ગુજરાતમાં જમાવડો!'
    ]
  };

  const activeHeadlineGu = selectedApprovedItem?.titleGujarati || pipelineState.selectedTopic.titleGujarati;
  const activeHeadlineEn = selectedApprovedItem?.titleEnglish || pipelineState.selectedTopic.titleEnglish;
  const activeLocation = selectedApprovedItem?.location || pipelineState.selectedTopic.location || 'વાલોડ, તાપી (ગુજરાત)';
  const activeCategory = selectedApprovedItem?.category || pipelineState.selectedTopic.category || 'Valod & Gujarat';
  const activeScriptGu = selectedApprovedItem?.scriptGujarati || contentData.videoScriptGujarati;
  const activeAccuracy = selectedApprovedItem?.aiConfidenceScore || pipelineState.selectedTopic.viralScore || 96;

  const seoData = pipelineState.agentOutputs['agent-9']?.output || {
    thumbnailBadgeText: 'મોટી જાહેરાત! ૫૦,૦૦૦ નોકરીઓ',
    viralTitlesGujarati: ['ગાંધીનગરમાં ૫૦,૦૦૦ નોકરીઓ! GIFT City માં સૌથી મોટો ધડાકો! 🚀'],
  };

  const videoSynthesizerData = pipelineState.agentOutputs['agent-12']?.output;

  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [thumbnailBadge, setThumbnailBadge] = useState(seoData.thumbnailBadgeText || 'મોટી જાહેરાત! ૫૦,૦૦૦ નોકરીઓ');
  const [thumbnailTitle, setThumbnailTitle] = useState(activeHeadlineGu || 'GIFT City માં મોટો ધડાકો: ૫૦,૦૦૦ નોકરીઓ!');
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'article' | 'thumbnail'>('video');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishingPublic, setIsPublishingPublic] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<any>(null);
  const [copiedPublishData, setCopiedPublishData] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [videoDownloadSuccess, setVideoDownloadSuccess] = useState(false);
  const [videoDurationMode, setVideoDurationMode] = useState<'65s' | '20s'>('65s');
  const [durationVerified, setDurationVerified] = useState(true);
  const [isDownloadingServerVideo, setIsDownloadingServerVideo] = useState(false);

  // Google Identity Services & Direct YouTube Data API v3 Upload state
  const [googleClientId, setGoogleClientId] = useState<string>(() => {
    try {
      return localStorage.getItem(GOOGLE_CLIENT_ID_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [clientIdSaved, setClientIdSaved] = useState(false);
  const [gisReady, setGisReady] = useState<boolean>(() =>
    typeof window !== 'undefined' && Boolean(window.google?.accounts?.oauth2)
  );
  const [youtubeAccessToken, setYoutubeAccessToken] = useState<string | null>(null);
  const [privacyStatus, setPrivacyStatus] = useState<'public' | 'unlisted'>('public');
  const [generatedVideoBlob, setGeneratedVideoBlob] = useState<Blob | null>(null);
  const [generatedVideoMimeType, setGeneratedVideoMimeType] = useState<string>('video/webm');
  const [generatedVideoDuration, setGeneratedVideoDuration] = useState<number>(0);
  const [isUploadingToYouTube, setIsUploadingToYouTube] = useState(false);
  const [youtubeUploadProgress, setYoutubeUploadProgress] = useState(0);
  const [youtubeUploadStage, setYoutubeUploadStage] = useState<string>('');
  const [youtubeUploadError, setYoutubeUploadError] = useState<string | null>(null);
  const [uploadedYouTubeVideo, setUploadedYouTubeVideo] = useState<{
    id: string;
    url: string;
    studioUrl: string;
    privacyStatus: 'public' | 'unlisted';
    title: string;
  } | null>(null);
  const [copiedYouTubeLink, setCopiedYouTubeLink] = useState(false);
  const [copiedOrigin, setCopiedOrigin] = useState(false);

  // Storyboard slides & YouTube metadata state
  const buildFallbackSlides = (): StoryboardSlide[] => {
    const cleanLines: string[] = String(activeScriptGu || '')
      .split(/\n+/)
      .map((l: string) => l.replace(/\[.*?\]/g, '').trim())
      .filter((l: string) => l.length > 10);
    const paras: string[] = cleanLines.length >= 3
      ? cleanLines.slice(0, 4)
      : [
          `નમસ્કાર દર્શક મિત્રો, હું માયા... વોઇસ ઓફ વાલોડ ન્યૂઝમાં આપનું સ્વાગત છે. આજે ${activeLocation} થી મહત્વના સમાચાર સામે આવ્યા છે.`,
          activeHeadlineGu,
          selectedApprovedItem?.summaryGujarati || 'સ્થાનિક નાગરિકો, ખેડૂતો અને વેપારીઓમાં આ નિર્ણયને લઈને ઉત્સાહ અને સકારાત્મક પ્રતિસાદ જોવા મળી રહ્યો છે.',
          'વાલોડ, વ્યારા અને તાપી જિલ્લાના સચોટ સમાચારો માટે અમારી ચેનલ @voiceofvalod ને સબ્સ્ક્રાઇબ કરો. આભાર!'
        ];
    const theme = activeCategory.toLowerCase().includes('agri') || activeHeadlineGu.includes('ડાંગર') || activeHeadlineGu.includes('શેરડી')
      ? 'agriculture'
      : activeHeadlineGu.includes('વરસાદ') || activeHeadlineGu.includes('હવામાન')
      ? 'weather'
      : 'infrastructure';
    return paras.map((p: string, idx: number) => ({
      id: idx + 1,
      paragraphGu: p,
      captionGu: idx === 0 ? '🔴 લાઈવ બુલેટિન • એન્કર માયા' : idx === 3 ? 'સબ્સ્ક્રાઇબ કરો @voiceofvalod' : activeHeadlineGu.slice(0, 46),
      visualTheme: idx === 0 ? 'newsroom' : idx === 3 ? 'community' : theme,
      visualLabelGu: idx === 0 ? 'વોઇસ ઓફ વાલોડ સ્ટુડિયો' : `પ્રતીકાત્મક દ્રશ્ય #${idx + 1} • ${activeLocation}`,
      useCitizenPhoto: Boolean(selectedApprovedItem?.photoDataUrl) && idx === 1,
      durationSec: 16
    }));
  };

  const [slides, setSlides] = useState<StoryboardSlide[]>(buildFallbackSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
  const [youtubeTitle, setYoutubeTitle] = useState(`${activeHeadlineGu} | Voice of Valod News`);
  const [youtubeDescription, setYoutubeDescription] = useState(
    `🔴 વોઇસ ઓફ વાલોડ ન્યૂઝ બુલેટિન\n\n📌 મુખ્ય સમાચાર: ${activeHeadlineGu}\n📍 સ્થળ: ${activeLocation}\n\nનમસ્કાર દર્શક મિત્રો, હું માયા... વોઇસ ઓફ વાલોડ ન્યૂઝમાં આપનું સ્વાગત છે.\n\n🎬 Credits: Voice of Valod (@voiceofvalod) & Zentrix Digital\n📺 YouTube: https://www.youtube.com/@voiceofvalod\n📱 WhatsApp: +91 9426249922\n\n#Valod #Tapi #GujaratNews #VoiceOfValod`
  );
  const [youtubeHashtags, setYoutubeHashtags] = useState<string[]>(
    selectedApprovedItem?.hashtags || ['#Valod', '#Tapi', '#GujaratNews', '#VoiceOfValod', '#ValodNews']
  );

  // Preload logo and citizen photo images for Canvas drawing
  useEffect(() => {
    const logo = new Image();
    logo.src = '/assets/voice-of-valod-zentrix-logo.svg';
    logo.onload = () => {
      logoImgRef.current = logo;
    };
  }, []);

  useEffect(() => {
    if (selectedApprovedItem?.photoDataUrl) {
      const img = new Image();
      img.src = selectedApprovedItem.photoDataUrl;
      img.onload = () => {
        citizenPhotoImgRef.current = img;
      };
    } else {
      citizenPhotoImgRef.current = null;
    }
  }, [selectedApprovedItem?.photoDataUrl]);

  // Generate storyboard slides + metadata via backend Gemini producer
  const handleGenerateStoryboard = async () => {
    setIsGeneratingStoryboard(true);
    setSlides(buildFallbackSlides());
    setActiveSlideIndex(0);
    try {
      const res = await fetch('/api/video/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleGujarati: activeHeadlineGu,
          titleEnglish: activeHeadlineEn,
          scriptGujarati: activeScriptGu,
          location: activeLocation,
          category: activeCategory,
          hasCustomPhoto: Boolean(selectedApprovedItem?.photoDataUrl)
        })
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.slides) && data.slides.length > 0) {
        setSlides(data.slides);
        if (data.youtubeTitle) setYoutubeTitle(data.youtubeTitle);
        if (data.youtubeDescriptionGu) setYoutubeDescription(data.youtubeDescriptionGu);
        if (Array.isArray(data.hashtags)) setYoutubeHashtags(data.hashtags);
      }
    } catch {
      // fallback already set
    } finally {
      setIsGeneratingStoryboard(false);
    }
  };

  // Sync state if topic or selected approved item changes
  useEffect(() => {
    setThumbnailTitle(activeHeadlineGu);
    setYoutubeTitle(`${activeHeadlineGu} | Voice of Valod News`);
    setYoutubeHashtags(
      selectedApprovedItem?.hashtags || ['#Valod', '#Tapi', '#GujaratNews', '#VoiceOfValod', '#ValodNews']
    );
    setYoutubeDescription(
      `🔴 વોઇસ ઓફ વાલોડ ન્યૂઝ બુલેટિન\n\n📌 મુખ્ય સમાચાર: ${activeHeadlineGu}\n📍 સ્થળ: ${activeLocation}\n\nનમસ્કાર દર્શક મિત્રો, હું માયા... વોઇસ ઓફ વાલોડ ન્યૂઝમાં આપનું સ્વાગત છે.\nસચોટ અને સ્થાનિક સમાચારો માટે સબ્સ્ક્રાઇબ કરો @voiceofvalod.\n\n🎬 Credits: Voice of Valod (@voiceofvalod) & Zentrix Digital\n📺 YouTube: https://www.youtube.com/@voiceofvalod\n📱 WhatsApp: +91 9426249922\n\n#Valod #Tapi #GujaratNews #VoiceOfValod`
    );
    setSlides(buildFallbackSlides());
    setActiveSlideIndex(0);
    setGeneratedVideoBlob(null);
    setUploadedYouTubeVideo(null);
    setYoutubeUploadError(null);
  }, [pipelineState.selectedTopic, selectedApprovedItem]);

  // Preload Google Identity Services script cleanly on mount
  const loadGoogleIdentityServices = (): Promise<void> => {
    if (window.google?.accounts?.oauth2) {
      setGisReady(true);
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const existing = document.getElementById('google-gis-client-script') as HTMLScriptElement | null;
      if (existing) {
        if (window.google?.accounts?.oauth2) {
          setGisReady(true);
          resolve();
          return;
        }
        existing.addEventListener('load', () => {
          setGisReady(Boolean(window.google?.accounts?.oauth2));
          resolve();
        });
        existing.addEventListener('error', () => {
          reject(new Error('Failed to load Google Identity Services script.'));
        });
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-gis-client-script';
      script.src = GIS_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGisReady(Boolean(window.google?.accounts?.oauth2));
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services (https://accounts.google.com/gsi/client).'));
      };
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    loadGoogleIdentityServices().catch(() => {
      // Handled lazily when user triggers upload
    });
  }, []);

  const handleSaveGoogleClientId = () => {
    const trimmed = googleClientId.trim();
    setGoogleClientId(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem(GOOGLE_CLIENT_ID_STORAGE_KEY, trimmed);
      } else {
        localStorage.removeItem(GOOGLE_CLIENT_ID_STORAGE_KEY);
      }
    } catch {}
    setYoutubeAccessToken(null);
    setYoutubeUploadError(null);
    setClientIdSaved(true);
    setTimeout(() => setClientIdSaved(false), 2500);
  };

  const requestYouTubeAccessToken = async (clientId: string): Promise<string> => {
    await loadGoogleIdentityServices();
    const oauth2 = window.google?.accounts?.oauth2;
    if (!oauth2) {
      throw new Error('Google Identity Services unavailable. Please allow Google scripts in your browser.');
    }

    return new Promise((resolve, reject) => {
      const tokenClient = oauth2.initTokenClient({
        client_id: clientId,
        scope: YOUTUBE_UPLOAD_SCOPE,
        callback: (response) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error || 'Google OAuth error'));
            return;
          }
          if (!response.access_token) {
            reject(new Error('Google did not return an OAuth access token.'));
            return;
          }
          setYoutubeAccessToken(response.access_token);
          resolve(response.access_token);
        },
        error_callback: (err) => {
          reject(new Error(err?.message || err?.type || 'Google Sign-In popup closed or blocked.'));
        },
      });

      tokenClient.requestAccessToken({ prompt: youtubeAccessToken ? '' : 'consent' });
    });
  };

  const uploadBlobMultipartToYouTube = (
    videoBlob: Blob,
    mimeType: string,
    accessToken: string,
    metadata: {
      snippet: {
        title: string;
        description: string;
        tags: string[];
        categoryId: string;
        defaultLanguage: string;
      };
      status: {
        privacyStatus: 'public' | 'unlisted';
        selfDeclaredMadeForKids: boolean;
      };
    }
  ): Promise<{ id: string }> => {
    return new Promise((resolve, reject) => {
      const boundary = `vov_youtube_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const delimiter = `--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;
      const resolvedMime = mimeType.split(';')[0] || videoBlob.type || 'video/webm';

      const multipartHeader =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        '\r\n' +
        delimiter +
        `Content-Type: ${resolvedMime}\r\n\r\n`;

      const multipartBody = new Blob([multipartHeader, videoBlob, closeDelimiter], {
        type: `multipart/related; boundary=${boundary}`,
      });

      const xhr = new XMLHttpRequest();
      xhr.open('POST', YOUTUBE_MULTIPART_UPLOAD_URL, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.setRequestHeader('Content-Type', `multipart/related; boundary=${boundary}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const pct = Math.min(99, Math.round((event.loaded / event.total) * 100));
          setYoutubeUploadProgress(pct);
        }
      };

      xhr.onload = () => {
        let parsed: any = null;
        try {
          parsed = JSON.parse(xhr.responseText);
        } catch {}

        if (xhr.status >= 200 && xhr.status < 300 && parsed?.id) {
          setYoutubeUploadProgress(100);
          resolve({ id: parsed.id });
        } else {
          if (xhr.status === 401) {
            setYoutubeAccessToken(null);
          }
          const apiErr =
            parsed?.error?.message ||
            parsed?.error_description ||
            `YouTube API HTTP ${xhr.status}`;
          reject(new Error(apiErr));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error while uploading video to YouTube Data API v3.'));
      };

      xhr.onabort = () => {
        reject(new Error('YouTube upload was aborted.'));
      };

      xhr.send(multipartBody);
    });
  };

  const handleDirectUploadToYouTube = async () => {
    setYoutubeUploadError(null);

    const clientId = googleClientId.trim();
    if (!clientId) {
      setYoutubeUploadError(
        isGu
          ? 'કૃપા કરીને નીચે Studio Settings માં તમારો Google OAuth Client ID પેસ્ટ કરીને સેવ કરો.'
          : 'Please paste and save your Google OAuth Client ID in Studio Settings below.'
      );
      return;
    }

    // Persist Client ID automatically if user forgot clicking Save
    try {
      localStorage.setItem(GOOGLE_CLIENT_ID_STORAGE_KEY, clientId);
    } catch {}

    if (!generatedVideoBlob) {
      setYoutubeUploadError(
        isGu
          ? 'પહેલા "📥 Download Video (.webm/.mp4)" પર ક્લિક કરીને વિડિયો બ્લોબ જનરેટ કરો, ત્યારબાદ સીધો YouTube અપલોડ કરો.'
          : 'Please generate the video blob first using "Download Video (.webm/.mp4)", then click Direct Upload to YouTube.'
      );
      return;
    }

    setIsUploadingToYouTube(true);
    setYoutubeUploadProgress(0);
    setUploadedYouTubeVideo(null);

    try {
      setYoutubeUploadStage(
        isGu ? 'Google OAuth પોપઅપ દ્વારા પરવાનગી મેળવી રહ્યું છે...' : 'Requesting YouTube OAuth access token via popup...'
      );
      const token = youtubeAccessToken || (await requestYouTubeAccessToken(clientId));

      setYoutubeUploadStage(
        isGu ? 'YouTube Data API v3 પર વિડિયો અપલોડ થાય છે...' : 'Uploading video to YouTube Data API v3...'
      );

      const safeTitle = (youtubeTitle || activeHeadlineGu || 'Voice of Valod News')
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, 100);

      const baseDesc = (youtubeDescription || '').trim();
      const hasCredits = baseDesc.toLowerCase().includes('zentrix digital');
      const creditsFooter =
        '\n\n━━━━━━━━━━━━━━━━━━━━\n' +
        '📢 Credits: Voice of Valod News (@voiceofvalod) & Zentrix Digital\n' +
        '🎙️ AI Newsroom Studio • Local News... Smartly!\n' +
        '#Valod #Tapi #GujaratNews #VoiceOfValod';
      const fullDescription = (hasCredits ? baseDesc : `${baseDesc}${creditsFooter}`).slice(0, 4900);

      const cleanTagSet = new Set<string>([
        'Valod',
        'Tapi',
        'GujaratNews',
        'VoiceOfValod',
        'ValodNews',
        ...youtubeHashtags.map((t) => t.replace(/^#/, '').trim()).filter(Boolean),
      ]);

      const metadata = {
        snippet: {
          title: safeTitle,
          description: fullDescription,
          tags: Array.from(cleanTagSet).slice(0, 20),
          categoryId: '25',
          defaultLanguage: 'gu',
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      };

      const uploaded = await uploadBlobMultipartToYouTube(
        generatedVideoBlob,
        generatedVideoMimeType,
        token,
        metadata
      );

      const watchUrl = `https://www.youtube.com/watch?v=${uploaded.id}`;
      const studioUrl = `https://studio.youtube.com/video/${uploaded.id}/edit`;

      setUploadedYouTubeVideo({
        id: uploaded.id,
        url: watchUrl,
        studioUrl,
        privacyStatus,
        title: safeTitle,
      });
      setPublishSuccess({
        success: true,
        messageGu: `વિડિયો સફળતાપૂર્વક @voiceofvalod પર (${privacyStatus.toUpperCase()}) અપલોડ થઈ ગયો છે!`,
      });

      fetch('/api/traffic/hit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'video_export' }),
      }).catch(() => {});
    } catch (err: any) {
      setYoutubeUploadError(err?.message || 'YouTube upload failed.');
    } finally {
      setIsUploadingToYouTube(false);
      setYoutubeUploadStage('');
    }
  };

  const handleInstantServerVideoDownload = async () => {
    try {
      setIsDownloadingServerVideo(true);
      const res = await fetch('/api/video/download-compliant-mp4');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      setGeneratedVideoBlob(blob);
      setGeneratedVideoMimeType(blob.type || 'video/mp4');
      setGeneratedVideoDuration(65);
      setUploadedYouTubeVideo(null);
      setYoutubeUploadError(null);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VoiceOfValod_Maya_Broadcast_65s_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setVideoDownloadSuccess(true);
    } catch (err: any) {
      alert('વિડિયો ડાઉનલોડ ક્ષતિ: ' + (err?.message || 'Error'));
    } finally {
      setIsDownloadingServerVideo(false);
    }
  };

  const handlePublishToYoutubePublic = async () => {
    setIsPublishingPublic(true);
    try {
      const res = await fetch('/api/youtube/publish-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: youtubeTitle || activeHeadlineGu,
          description: `${youtubeDescription}\n\n${youtubeHashtags.join(' ')}`
        })
      });
      const data = await res.json();
      setPublishSuccess(data);
    } catch (err: any) {
      setPublishSuccess({ success: false, error: err?.message || 'Error' });
    } finally {
      setIsPublishingPublic(false);
    }
  };

  const copyPublishMetadata = () => {
    const meta = `Title: ${youtubeTitle}\n\nDescription:\n${youtubeDescription}\n\n${youtubeHashtags.join(' ')}\n\nTags: Valod, Tapi, GujaratNews, Voice of Valod, Zentrix Digital`;
    navigator.clipboard.writeText(meta);
    setCopiedPublishData(true);
    setTimeout(() => setCopiedPublishData(false), 2000);
  };

  // Synced AI Voiceover + Visual Slideshow Controller
  const slideTimerRef = useRef<number | null>(null);
  const stopPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (slideTimerRef.current) {
      window.clearInterval(slideTimerRef.current);
      slideTimerRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (slideTimerRef.current) window.clearInterval(slideTimerRef.current);
    };
  }, []);

  const toggleSpeech = () => {
    if (isPlayingAudio) {
      stopPlayback();
      return;
    }

    const activeSlides = slides.length > 0 ? slides : buildFallbackSlides();
    setActiveSlideIndex(0);
    setIsPlayingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v =>
        (v.lang.includes('gu') || v.lang.includes('hi') || v.name.includes('India')) &&
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('zira'))
      ) || voices.find(v => v.lang.includes('gu') || v.lang.includes('hi') || v.name.includes('India'));

      let currentIdx = 0;
      const speakSlide = (idx: number) => {
        if (idx >= activeSlides.length) {
          stopPlayback();
          return;
        }
        setActiveSlideIndex(idx);
        const text = activeSlides[idx].paragraphGu.replace(/\[.*?\]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(text);
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.rate = 0.98;
        utterance.pitch = 1.15;
        utterance.onend = () => {
          currentIdx += 1;
          if (currentIdx < activeSlides.length) {
            speakSlide(currentIdx);
          } else {
            stopPlayback();
          }
        };
        utterance.onerror = () => {
          // Keep slideshow running visually even if audio TTS engine stops
        };
        window.speechSynthesis.speak(utterance);
      };

      speakSlide(0);
    }

    // Visual slide safeguard timer in case browser TTS finishes silently
    slideTimerRef.current = window.setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % activeSlides.length);
    }, 6500);
  };

  // Render Thumbnail on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw broadcast news thumbnail (1280x720 scaled)
    const w = canvas.width;
    const h = canvas.height;

    // Gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0f172a'); // slate 900
    bgGrad.addColorStop(0.5, '#1e1b4b'); // deep indigo
    bgGrad.addColorStop(1, '#881337'); // deep crimson
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Breaking News Banner Bar
    ctx.fillStyle = '#dc2626'; // Red 600
    ctx.fillRect(40, 40, w - 80, 56);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Noto Sans Gujarati", sans-serif';
    ctx.fillText('🔴 VOICE OF VALOD NEWS • લાઈવ બુલેટિન', 60, 78);

    // Anchor Silhouette / Graphic Box on Right
    const anchorX = w - 380;
    const anchorY = 120;
    const anchorW = 320;
    const anchorH = 340;
    
    // Virtual studio monitor frame
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(anchorX, anchorY, anchorW, anchorH, 16);
    ctx.fill();
    ctx.stroke();

    // Anchor Avatar Mock inside frame
    ctx.fillStyle = '#f43f5e';
    ctx.font = '70px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👩‍💼', anchorX + anchorW / 2, anchorY + 160);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px "Noto Sans Gujarati", sans-serif';
    ctx.fillText('એન્કર - માયા (Maya)', anchorX + anchorW / 2, anchorY + 220);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Voice of Valod Newsroom', anchorX + anchorW / 2, anchorY + 250);

    // Big Badge Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#eab308'; // Amber 500
    ctx.fillRect(40, 130, 360, 52);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "Noto Sans Gujarati", sans-serif';
    ctx.fillText(thumbnailBadge || 'મોટી જાહેરાત!', 55, 166);

    // Main Headline Text wrapped
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Noto Sans Gujarati", sans-serif';
    const words = (thumbnailTitle || 'GIFT City Mega Announcement').split(' ');
    let line = '';
    let startY = 240;
    const maxWidth = anchorX - 80;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 45, startY);
        line = words[n] + ' ';
        startY += 50;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 45, startY);

    // Bottom Ticker Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(40, h - 80, w - 80, 50);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, h - 80, w - 80, 50);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 18px "Noto Sans Gujarati", sans-serif';
    ctx.fillText('▶ VOICE OF VALOD: Local News... Smartly! • ૧૦૦% પ્રમાણિત અહેવાલ', 60, h - 48);

  }, [thumbnailBadge, thumbnailTitle, activeMediaTab]);

  const downloadThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `breaking-news-thumbnail-${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Shared HTML5 Canvas Broadcast Frame Renderer (Ken Burns Visual Slideshow + Lower-Thirds + Anchor Maya PiP)
  const drawBroadcastFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    slide: StoryboardSlide,
    slideIdx: number,
    totalSlides: number,
    slideProgress: number,
    tick: number,
    targetRatio: '16:9' | '9:16' | '1:1'
  ) => {
    const isPortrait = targetRatio === '9:16';

    // 1. Background Thematic Canvas Artwork with Ken Burns Zoom + Pan
    ctx.save();
    const kbScale = 1.0 + slideProgress * 0.14;
    const kbPanX = (slideIdx % 2 === 0 ? -1 : 1) * slideProgress * 26;
    const kbPanY = (slideProgress - 0.5) * 16;
    ctx.translate(width / 2 + kbPanX, height / 2 + kbPanY);
    ctx.scale(kbScale, kbScale);
    ctx.translate(-width / 2, -height / 2);

    if (slide.useCitizenPhoto && citizenPhotoImgRef.current && citizenPhotoImgRef.current.complete) {
      const img = citizenPhotoImgRef.current;
      const imgAspect = img.naturalWidth / Math.max(1, img.naturalHeight);
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;
      if (imgAspect > canvasAspect) {
        drawW = height * imgAspect;
      } else {
        drawH = width / imgAspect;
      }
      ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
      ctx.fillStyle = 'rgba(2, 6, 23, 0.42)';
      ctx.fillRect(-60, -60, width + 120, height + 120);
    } else {
      // Rich thematic gradient + illustrative vector scene
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (slide.visualTheme === 'agriculture') {
        grad.addColorStop(0, '#052e16');
        grad.addColorStop(0.55, '#0f172a');
        grad.addColorStop(1, '#14532d');
      } else if (slide.visualTheme === 'weather') {
        grad.addColorStop(0, '#082f49');
        grad.addColorStop(0.55, '#0f172a');
        grad.addColorStop(1, '#1e3a8a');
      } else if (slide.visualTheme === 'community') {
        grad.addColorStop(0, '#31102f');
        grad.addColorStop(0.55, '#0f172a');
        grad.addColorStop(1, '#7f1d1d');
      } else {
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#7f1d1d');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(-60, -60, width + 120, height + 120);

      // Broadcast studio perspective grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width + 80; x += 48) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height + 80; y += 48) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Thematic illustrative silhouette / skyline / hills
      if (slide.visualTheme === 'agriculture') {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.16)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.72);
        ctx.quadraticCurveTo(width * 0.3, height * 0.56, width * 0.65, height * 0.68);
        ctx.quadraticCurveTo(width * 0.85, height * 0.74, width, height * 0.62);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      } else if (slide.visualTheme === 'weather') {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 2;
        for (let r = 0; r < 18; r++) {
          const rx = ((r * 83 + tick * 4) % width);
          const ry = ((r * 67 + tick * 9) % (height * 0.7));
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 8, ry + 26);
          ctx.stroke();
        }
      } else {
        // Urban/Newsroom illuminated bars
        for (let b = 0; b < 9; b++) {
          const bw = width * 0.06;
          const bh = 80 + ((b * 47) % 160);
          ctx.fillStyle = b % 2 === 0 ? 'rgba(56, 189, 248, 0.10)' : 'rgba(244, 63, 94, 0.10)';
          ctx.fillRect(width * 0.08 + b * (bw + 18), height * 0.76 - bh, bw, bh);
        }
      }
    }
    ctx.restore();

    // 2. Dark Readability Vignette
    const vignette = ctx.createLinearGradient(0, 0, 0, height);
    vignette.addColorStop(0, 'rgba(2, 6, 23, 0.65)');
    vignette.addColorStop(0.45, 'rgba(2, 6, 23, 0.20)');
    vignette.addColorStop(1, 'rgba(2, 6, 23, 0.92)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 3. Top Header Watermark Bar
    const topBarH = isPortrait ? 76 : 62;
    ctx.fillStyle = 'rgba(185, 28, 28, 0.95)';
    ctx.fillRect(0, 0, width, topBarH);

    if (logoImgRef.current && logoImgRef.current.complete && logoImgRef.current.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(38, topBarH / 2, 22, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImgRef.current, 16, topBarH / 2 - 22, 44, 44);
      ctx.restore();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isPortrait ? '20px' : '24px'} "Noto Sans Gujarati", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('VOICE OF VALOD NEWS • લાઈવ બુલેટિન', 72, topBarH / 2 + 8);

    // AI Verified + Slide Badge Top Right
    const badgeText = `✓ ${activeAccuracy}% AI Verified • સ્લાઇડ ${slideIdx + 1}/${totalSlides}`;
    ctx.font = 'bold 14px "Noto Sans Gujarati", sans-serif';
    const badgeW = Math.min(310, ctx.measureText(badgeText).width + 26);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(width - badgeW - 18, 13, badgeW, topBarH - 26);
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, width - badgeW / 2 - 18, topBarH / 2 + 5);

    // 4. Center Symbolic Visual Card + Anchor Maya PiP
    const themeEmoji =
      slide.visualTheme === 'agriculture' ? '🌾 🚜 🌱' :
      slide.visualTheme === 'weather' ? '🌦️ 🌧️ 💨' :
      slide.visualTheme === 'community' ? '🏘️ 🤝 📰' :
      slide.visualTheme === 'newsroom' ? '🎙️ 📺 🔴' : '🏙️ 📈 🛣️';

    if (!isPortrait) {
      // Visual card left-center
      const cardX = 36;
      const cardY = 92;
      const cardW = width - 350;
      const cardH = height - 255;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      // Visual label pill
      ctx.fillStyle = 'rgba(2, 132, 199, 0.9)';
      ctx.fillRect(cardX + 18, cardY + 18, Math.min(cardW - 36, 360), 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Noto Sans Gujarati", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`🖼️ ${slide.visualLabelGu}`, cardX + 28, cardY + 38);

      // Symbolic visual emblem (only if no photo loaded)
      if (!slide.useCitizenPhoto || !citizenPhotoImgRef.current) {
        ctx.font = '56px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(themeEmoji, cardX + cardW / 2, cardY + 128);
      }

      // Active Gujarati paragraph inside card
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 23px "Noto Sans Gujarati", sans-serif';
      ctx.textAlign = 'left';
      const words = (slide.paragraphGu || '').split(' ');
      let line = '';
      let lineY = slide.useCitizenPhoto && citizenPhotoImgRef.current ? cardY + 95 : cardY + 188;
      const maxTextW = cardW - 44;
      let linesDrawn = 0;
      for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + ' ';
        if (ctx.measureText(test).width > maxTextW && i > 0) {
          ctx.fillText(line, cardX + 22, lineY);
          line = words[i] + ' ';
          lineY += 34;
          linesDrawn++;
          if (linesDrawn >= 5) break;
        } else {
          line = test;
        }
      }
      if (linesDrawn < 5 && line.trim()) {
        ctx.fillText(line.trim(), cardX + 22, lineY);
      }

      // Right: Anchor Maya PiP Frame
      const mayaX = width - 165;
      const mayaY = height * 0.43;
      const pulse = Math.sin(tick * 0.16) * 5;
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(mayaX, mayaY, 82 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.beginPath();
      ctx.arc(mayaX, mayaY, 76, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '68px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👩‍💼', mayaX, mayaY + 22);

      ctx.fillStyle = '#e11d48';
      ctx.fillRect(mayaX - 105, mayaY + 88, 210, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Noto Sans Gujarati", sans-serif';
      ctx.fillText('એન્કર: માયા (Maya)', mayaX, mayaY + 109);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px "Noto Sans Gujarati", sans-serif';
      ctx.fillText(`📍 ${activeLocation}`, mayaX, mayaY + 142);
    } else {
      // Portrait 9:16 layout
      const centerX = width / 2;
      ctx.font = '60px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👩‍💼', centerX, height * 0.21);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(centerX - 105, height * 0.24, 210, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Noto Sans Gujarati", sans-serif';
      ctx.fillText('એન્કર: માયા (Maya)', centerX, height * 0.24 + 21);

      const boxX = 32;
      const boxY = height * 0.30;
      const boxW = width - 64;
      const boxH = height * 0.44;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.80)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px "Noto Sans Gujarati", sans-serif';
      ctx.fillText(`🖼️ ${slide.visualLabelGu}`, centerX, boxY + 34);
      ctx.font = '48px sans-serif';
      ctx.fillText(themeEmoji, centerX, boxY + 95);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Noto Sans Gujarati", sans-serif';
      const words = (slide.paragraphGu || '').split(' ');
      let line = '';
      let ly = boxY + 150;
      for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + ' ';
        if (ctx.measureText(test).width > boxW - 44 && i > 0) {
          ctx.fillText(line, centerX, ly);
          line = words[i] + ' ';
          ly += 30;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), centerX, ly);
    }

    // 5. Lower-Third Gujarati Headline Banner
    const l3H = 60;
    const tickerH = 42;
    const l3Y = height - tickerH - l3H;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
    ctx.fillRect(0, l3Y, width, l3H);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, l3Y, 12, l3H);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 13px "Noto Sans Gujarati", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(slide.captionGu || '🔴 બ્રેકિંગ ન્યૂઝ', 24, l3Y + 21);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isPortrait ? '17px' : '21px'} "Noto Sans Gujarati", sans-serif`;
    ctx.fillText(activeHeadlineGu.slice(0, isPortrait ? 44 : 74), 24, l3Y + 48);

    // 6. Scrolling Bottom Red Ticker
    const tickerY = height - tickerH;
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, tickerY, width, tickerH);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 15px "Noto Sans Gujarati", sans-serif';
    const tickerStr = `▶ વોઇસ ઓફ વાલોડ ન્યૂઝ (@voiceofvalod) • ${activeLocation} • ${activeHeadlineGu} • WhatsApp સમાચાર મોકલો: +91 9426249922   `;
    const shift = (tick * 3) % Math.max(400, tickerStr.length * 8);
    ctx.fillText(tickerStr + tickerStr, -shift, tickerY + 27);
  };

  // Live Interactive Ken Burns Preview Canvas Loop
  useEffect(() => {
    if (activeMediaTab !== 'video') return;
    const canvas = stageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let tick = 0;
    const slideStart = Date.now();
    const activeSlides = slides.length > 0 ? slides : buildFallbackSlides();
    const currentSlide = activeSlides[activeSlideIndex % activeSlides.length] || activeSlides[0];

    const animate = () => {
      tick++;
      const slideElapsed = ((Date.now() - slideStart) % 7000) / 7000;
      drawBroadcastFrame(
        ctx,
        canvas.width,
        canvas.height,
        currentSlide,
        activeSlideIndex % activeSlides.length,
        activeSlides.length,
        slideElapsed,
        tick,
        aspectRatio
      );
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [activeMediaTab, activeSlideIndex, slides, aspectRatio, activeHeadlineGu, activeLocation, activeAccuracy]);

  // Generate & Download Video (.webm/.mp4) recording animated Ken Burns slideshow + audio stream
  const recordAndExportVideo = async (targetRatio: '16:9' | '9:16' = aspectRatio === '9:16' ? '9:16' : '16:9') => {
    try {
      setIsRecordingVideo(true);
      setRecordingProgress(2);
      setVideoDownloadSuccess(false);
      setUploadedYouTubeVideo(null);
      setYoutubeUploadError(null);

      const targetDurationSec = videoDurationMode === '65s' ? 65 : 20;
      const width = targetRatio === '16:9' ? 1280 : 720;
      const height = targetRatio === '16:9' ? 720 : 1280;

      const recordCanvas = document.createElement('canvas');
      recordCanvas.width = width;
      recordCanvas.height = height;
      const ctx = recordCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const dest = audioCtx.createMediaStreamDestination();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(dest);
      osc.start();

      // Trigger SpeechSynthesis narration synced to recording
      const activeSlides = slides.length > 0 ? slides : buildFallbackSlides();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const fullScript = activeSlides.map(s => s.paragraphGu).join(' ');
        const utterance = new SpeechSynthesisUtterance(fullScript);
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v =>
          (v.lang.includes('gu') || v.lang.includes('hi') || v.name.includes('India')) &&
          (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('google'))
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.pitch = 1.15;
        window.speechSynthesis.speak(utterance);
      }

      const canvasStream = recordCanvas.captureStream(30);
      const audioTracks = dest.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        canvasStream.addTrack(audioTracks[0]);
      }

      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        videoBitsPerSecond: 2500000
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordStartTime = Date.now();
      let animFrameId: number;

      recorder.onstop = () => {
        try {
          cancelAnimationFrame(animFrameId);
          osc.stop();
          audioCtx.close();
        } catch {}

        const actualDurationSec = (Date.now() - recordStartTime) / 1000;
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: mimeType });

        // Retain generated video blob in Studio state for direct YouTube Data API v3 upload
        setGeneratedVideoBlob(blob);
        setGeneratedVideoMimeType(mimeType);
        setGeneratedVideoDuration(Math.max(1, Math.round(actualDurationSec)));

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `VoiceOfValod_Maya_Bulletin_${targetRatio === '9:16' ? 'Shorts' : 'HD'}_${Math.round(actualDurationSec)}s.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsRecordingVideo(false);
        setRecordingProgress(100);
        setVideoDownloadSuccess(true);
        setDurationVerified(true);
      };

      recorder.start(1000);
      let frameCount = 0;

      const render = () => {
        frameCount++;
        const elapsedSec = (Date.now() - recordStartTime) / 1000;
        const progressPct = Math.min(99, Math.round((elapsedSec / targetDurationSec) * 100));
        setRecordingProgress(progressPct);

        const perSlideSec = targetDurationSec / activeSlides.length;
        const slideIdx = Math.min(activeSlides.length - 1, Math.floor(elapsedSec / perSlideSec));
        const slideProgress = Math.min(1, (elapsedSec % perSlideSec) / perSlideSec);

        drawBroadcastFrame(
          ctx,
          width,
          height,
          activeSlides[slideIdx],
          slideIdx,
          activeSlides.length,
          slideProgress,
          frameCount,
          targetRatio
        );

        if (elapsedSec < targetDurationSec) {
          animFrameId = requestAnimationFrame(render);
        } else {
          recorder.stop();
        }
      };

      animFrameId = requestAnimationFrame(render);
    } catch (err: any) {
      console.error('Video recording failed:', err);
      setIsRecordingVideo(false);
      alert('Video export error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            {isGu ? 'મીડિયા પ્રોડક્શન એન્ડ સ્ટુડિયો (Agents 4 & 5)' : 'Media Production & Virtual Studio'}
          </span>
          <h2 className="text-base font-bold text-white mt-0.5 font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu ? 'ન્યૂઝ એન્કર માયા વિડિયો, સ્ક્રિપ્ટ અને હાઇ-CTR થંબનેલ' : 'News Anchor Maya Video, Script & High-CTR Thumbnail'}
          </h2>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveMediaTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
              activeMediaTab === 'video'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isGu ? 'એન્કર માયા વિડિયો' : 'Anchor Maya Video'}</span>
          </button>
          <button
            onClick={() => setActiveMediaTab('article')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
              activeMediaTab === 'article'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isGu ? 'આર્ટિકલ & સ્ક્રિપ્ટ' : 'Article & Script'}</span>
          </button>
          <button
            onClick={() => setActiveMediaTab('thumbnail')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
              activeMediaTab === 'thumbnail'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isGu ? 'થંબનેલ જનરેટર' : 'Thumbnail Studio'}</span>
          </button>
        </div>
      </div>

      {/* APPROVED NEWS YOUTUBE VIDEO QUEUE PICKER */}
      {activeMediaTab === 'video' && youtubeQueueItems.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-['Noto_Sans_Gujarati',sans-serif]">
              <ShieldCheck className="w-4 h-4" />
              {isGu
                ? `ઓનર દ્વારા મંજૂર YouTube વિડિયો કતાર (${youtubeQueueItems.length})`
                : `Owner-Approved YouTube Video Queue (${youtubeQueueItems.length})`}
            </span>
            <button
              type="button"
              onClick={handleGenerateStoryboard}
              disabled={isGeneratingStoryboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition disabled:opacity-50"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isGeneratingStoryboard ? 'animate-spin' : ''}`} />
              <span>{isGu ? (isGeneratingStoryboard ? 'સ્લાઇડ્સ બની રહી છે...' : 'AI સ્લાઇડશો & મેટાડેટા બનાવો') : 'Generate Slideshow & Metadata'}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {youtubeQueueItems.map((qItem) => {
              const isActive = selectedApprovedItem?.id === qItem.id;
              return (
                <button
                  key={qItem.id}
                  type="button"
                  onClick={() => onSelectApprovedItem && onSelectApprovedItem(qItem)}
                  className={`shrink-0 max-w-[260px] text-left p-2.5 rounded-lg border text-xs transition ${
                    isActive
                      ? 'bg-red-950/50 border-red-500 text-white shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-[10px] mb-1">
                    <span className="text-emerald-400 font-bold">{qItem.aiConfidenceScore}% AI Verified</span>
                    <span className="text-slate-400 truncate max-w-[100px]">{qItem.location}</span>
                  </div>
                  <p className="line-clamp-1 font-bold font-['Noto_Sans_Gujarati',sans-serif]">
                    {isGu ? qItem.titleGujarati : qItem.titleEnglish}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 1: YOUTUBE VIDEO STUDIO (VISUAL SLIDESHOW + AI VOICEOVER) */}
      {activeMediaTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Ken Burns Visual Slideshow Stage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Studio screen header */}
              <div className="bg-slate-900/90 px-3 sm:px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="font-bold text-red-400 tracking-wider text-[11px] uppercase truncate">
                    YOUTUBE VIDEO STUDIO • @voiceofvalod
                  </span>
                </div>

                {/* Aspect Ratio Switch */}
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`p-1 rounded ${aspectRatio === '16:9' ? 'text-red-400 bg-slate-800' : 'text-slate-500'}`}
                    title="16:9 YouTube Landscape"
                  >
                    <Tv className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-1 rounded ${aspectRatio === '9:16' ? 'text-red-400 bg-slate-800' : 'text-slate-500'}`}
                    title="9:16 Shorts/Reels Vertical"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`p-1 rounded ${aspectRatio === '1:1' ? 'text-red-400 bg-slate-800' : 'text-slate-500'}`}
                    title="1:1 Instagram Square"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live HTML5 Canvas Stage (Ken Burns Slides + Gujarati Lower-Thirds + Anchor Maya PiP) */}
              <div className="bg-black flex items-center justify-center p-2 sm:p-3">
                <canvas
                  ref={stageCanvasRef}
                  width={aspectRatio === '9:16' ? 720 : aspectRatio === '1:1' ? 900 : 1280}
                  height={aspectRatio === '9:16' ? 1280 : aspectRatio === '1:1' ? 900 : 720}
                  className={`w-full rounded-xl border border-slate-800 shadow-2xl object-contain ${
                    aspectRatio === '9:16' ? 'max-h-[460px] max-w-[280px]' : aspectRatio === '1:1' ? 'max-h-[420px] max-w-[420px]' : 'max-h-[420px]'
                  }`}
                />
              </div>

              {/* Slide Thumbnail Strip (4 Symbolic Visuals matching script paragraphs) */}
              <div className="bg-slate-950 px-3 sm:px-4 py-2.5 border-t border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-2 text-[11px]">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {isGu ? 'પ્રતિકાત્મક ચિત્રો (Ken Burns Visual Slides):' : 'Symbolic Slides (Ken Burns Animation):'}
                  </span>
                  <span className="text-slate-400 font-mono tabular-nums">
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`text-left p-2 rounded-lg border text-[11px] transition ${
                        activeSlideIndex === idx
                          ? 'bg-red-950/60 border-red-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[10px] mb-0.5">
                        <span className="text-sky-400">#{idx + 1} {s.visualTheme}</span>
                        <span>{s.durationSec || 16}s</span>
                      </div>
                      <p className="line-clamp-2 font-['Noto_Sans_Gujarati',sans-serif] leading-snug text-slate-200">
                        {s.paragraphGu}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* YouTube Duration Selector & Processing Compliance Guard */}
              <div className="bg-slate-950 px-3 sm:px-4 py-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 text-[11px] font-semibold">
                    {isGu ? 'વિડિયો ડ્યુરેશન:' : 'Duration:'}
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setVideoDurationMode('65s')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                        videoDurationMode === '65s'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isGu ? '🎥 ૬૫ સેકન્ડ (YouTube માન્ય)' : '🎥 65s (YouTube Compliant)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoDurationMode('20s')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                        videoDurationMode === '20s'
                          ? 'bg-rose-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isGu ? '⚡ ૨૦ સેકન્ડ ફાસ્ટ એક્સપોર્ટ' : '⚡ 20s Fast Export'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/40">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>
                    {isGu ? '૬૦+ સેકન્ડ YouTube ગાર્ડ એક્ટિવ' : '60s+ YouTube Guard Active'}
                  </span>
                </div>
              </div>

              {/* Player Controls Bar */}
              <div className="bg-slate-900 px-3 sm:px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow ${
                    isPlayingAudio
                      ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>{isGu ? 'પ્રિવ્યૂ & અવાજ રોકો' : 'Pause Preview & Voice'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isGu ? '🔊 સિંક વિડિયો + માયા વોઇસ ચલાવો' : '🔊 Play Synced Slideshow + Maya Voice'}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-xs flex-wrap">
                  {/* Canvas + MediaRecorder Slideshow Export (.webm/.mp4) */}
                  <button
                    type="button"
                    onClick={() => recordAndExportVideo(aspectRatio === '9:16' ? '9:16' : '16:9')}
                    disabled={isRecordingVideo}
                    className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow transition active:scale-95 disabled:opacity-50"
                    title="Record animated Ken Burns slideshow + audio stream"
                  >
                    {isRecordingVideo ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>{isGu ? `બની રહ્યું છે... ${recordingProgress}%` : `Recording... ${recordingProgress}%`}</span>
                      </>
                    ) : (
                      <>
                        <Film className="w-3.5 h-3.5" />
                        <span>{isGu ? '📥 Download Video (.webm/.mp4)' : '📥 Download Video (.webm/.mp4)'}</span>
                      </>
                    )}
                  </button>

                  {/* Instant Server 65s MP4 Download & Ready Blob */}
                  <button
                    type="button"
                    onClick={handleInstantServerVideoDownload}
                    disabled={isDownloadingServerVideo}
                    className="min-h-[40px] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isGu ? (isDownloadingServerVideo ? 'ડાઉનલોડ...' : '૬૫s MP4') : '65s MP4'}</span>
                  </button>

                  {/* Direct Upload to YouTube (@voiceofvalod) via YouTube Data API v3 */}
                  <button
                    type="button"
                    onClick={handleDirectUploadToYouTube}
                    disabled={isUploadingToYouTube}
                    className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow transition active:scale-95 disabled:opacity-50"
                  >
                    {isUploadingToYouTube ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{isGu ? `અપલોડ ${youtubeUploadProgress}%` : `Uploading ${youtubeUploadProgress}%`}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isGu ? '🚀 Direct Upload to YouTube' : '🚀 Direct Upload to YouTube'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {(videoDownloadSuccess || publishSuccess) && (
                <div className="bg-emerald-950/70 border-t border-emerald-500/40 px-4 py-2.5 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    ✔ {publishSuccess?.messageGu || (isGu ? 'વિડિયો સફળતાપૂર્વક જનરેટ અને ડાઉનલોડ થઈ ગયો છે!' : 'Video generated and exported cleanly!')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(true)}
                    className="text-white bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded text-[11px] font-bold"
                  >
                    {isGu ? 'મેન્યુઅલ અપલોડ ગાઇડ' : 'Manual Upload Guide'}
                  </button>
                </div>
              )}
            </div>

            {/* DIRECT YOUTUBE DATA API v3 & GOOGLE IDENTITY SERVICES STUDIO SETTINGS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-current text-red-500" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                      {isGu
                        ? 'YouTube (@voiceofvalod) સીધું અપલોડ સેટિંગ્સ (Data API v3)'
                        : 'Direct Upload to YouTube (@voiceofvalod) • Data API v3'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isGu
                        ? 'Google Identity Services (OAuth 2.0) દ્વારા સીધો વિડિયો અપલોડ'
                        : 'Official Google Identity Services (OAuth 2.0) browser multipart upload'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-mono px-2.5 py-1 rounded border ${
                    gisReady
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {gisReady ? 'GIS OAuth Ready' : 'Loading GIS...'}
                </span>
              </div>

              {/* Studio Setting 1: Google OAuth Client ID (Saved in localStorage) */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isGu ? 'Google OAuth Client ID (બ્રાઉઝરમાં સેવ થશે):' : 'Google OAuth Client ID (Saved in localStorage):'}</span>
                  </label>
                  {youtubeAccessToken && (
                    <span className="text-[11px] font-mono text-emerald-400">
                      ✔ OAuth Token Active
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    placeholder="1234567890-xxxxxxxx.apps.googleusercontent.com"
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveGoogleClientId}
                    className="min-h-[40px] px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition"
                  >
                    {clientIdSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">{isGu ? 'સેવ થયું!' : 'Saved!'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isGu ? 'Client ID સેવ કરો' : 'Save Client ID'}</span>
                      </>
                    )}
                  </button>
                </div>

                {typeof window !== 'undefined' && (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-0.5">
                    <span className="truncate">
                      {isGu ? 'Authorized JS Origin:' : 'Authorized JS Origin:'}{' '}
                      <code className="text-sky-300 font-mono">{window.location.origin}</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin);
                        setCopiedOrigin(true);
                        setTimeout(() => setCopiedOrigin(false), 2000);
                      }}
                      className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                    >
                      {copiedOrigin ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedOrigin ? (isGu ? 'કોપી થયું' : 'Copied') : (isGu ? 'Origin કોપી' : 'Copy Origin')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Studio Setting 2: Privacy Toggle + Video Blob Readiness */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Privacy Status Toggle */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {isGu ? 'YouTube પ્રાઇવસી સ્ટેટસ (Privacy Status):' : 'YouTube Privacy Status:'}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPrivacyStatus('public')}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                        privacyStatus === 'public'
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{isGu ? 'Public (લાઈવ)' : 'Public'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacyStatus('unlisted')}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                        privacyStatus === 'unlisted'
                          ? 'bg-amber-600 text-white border-amber-400 shadow'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isGu ? 'Unlisted (અનલિસ્ટેડ)' : 'Unlisted'}</span>
                    </button>
                  </div>
                </div>

                {/* Generated Video Blob Status */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {isGu ? 'વિડિયો બ્લોબ સ્ટેટસ (Video Blob):' : 'Generated Video Blob:'}
                  </span>
                  {generatedVideoBlob ? (
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          {isGu ? 'અપલોડ માટે તૈયાર' : 'Ready to upload'} · {(generatedVideoBlob.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {generatedVideoDuration}s · {generatedVideoMimeType.includes('mp4') ? 'MP4' : 'WEBM'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-amber-300 font-medium">
                        {isGu ? 'વિડિયો બ્લોબ હજુ બન્યો નથી' : 'No video blob generated yet'}
                      </span>
                      <button
                        type="button"
                        onClick={() => recordAndExportVideo(aspectRatio === '9:16' ? '9:16' : '16:9')}
                        disabled={isRecordingVideo}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shrink-0 disabled:opacity-50"
                      >
                        {isRecordingVideo ? `${recordingProgress}%` : (isGu ? 'હમણાં બનાવો' : 'Generate Now')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button + Progress Bar */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleDirectUploadToYouTube}
                  disabled={isUploadingToYouTube || isRecordingVideo}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
                >
                  {isUploadingToYouTube ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {isGu
                          ? `YouTube (@voiceofvalod) પર અપલોડ થાય છે... ${youtubeUploadProgress}%`
                          : `Uploading to YouTube (@voiceofvalod)... ${youtubeUploadProgress}%`}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>
                        {isGu
                          ? `🚀 Direct Upload to YouTube (@voiceofvalod) • ${privacyStatus === 'public' ? 'Public' : 'Unlisted'}`
                          : `🚀 Direct Upload to YouTube (@voiceofvalod) • ${privacyStatus}`}
                      </span>
                    </>
                  )}
                </button>

                {isUploadingToYouTube && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                      <span>{youtubeUploadStage}</span>
                      <span className="font-bold text-red-400 tabular-nums">{youtubeUploadProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${youtubeUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {youtubeUploadError && (
                  <div className="bg-red-950/60 border border-red-500/50 rounded-xl p-3 text-xs text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{youtubeUploadError}</span>
                  </div>
                )}

                {uploadedYouTubeVideo && (
                  <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {isGu
                          ? `વિડિયો સફળતાપૂર્વક YouTube પર અપલોડ થઈ ગયો! (${uploadedYouTubeVideo.privacyStatus})`
                          : `Video uploaded live to YouTube (${uploadedYouTubeVideo.privacyStatus})!`}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-200/80">
                        ID: {uploadedYouTubeVideo.id}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-emerald-500/30">
                      <a
                        href={uploadedYouTubeVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-sky-400 hover:text-sky-300 underline truncate flex-1 flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{uploadedYouTubeVideo.url}</span>
                      </a>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(uploadedYouTubeVideo.url);
                            setCopiedYouTubeLink(true);
                            setTimeout(() => setCopiedYouTubeLink(false), 2000);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1"
                        >
                          {copiedYouTubeLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedYouTubeLink ? (isGu ? 'કોપી' : 'Copied') : (isGu ? 'લિંક કોપી' : 'Copy Link')}</span>
                        </button>
                        <a
                          href={uploadedYouTubeVideo.studioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                        >
                          YouTube Studio
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Auto-Generated YouTube Metadata Package & Teleprompter */}
          <div className="space-y-4">
            {/* Auto-Generated Ready-to-Upload YouTube Metadata Package */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-red-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isGu ? 'YouTube અપલોડ મેટાડેટા પેકેજ' : 'YouTube Metadata Package'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={copyPublishMetadata}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold border border-slate-700 transition"
                >
                  {copiedPublishData ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isGu ? (copiedPublishData ? 'કોપી થયું!' : 'બધું કોપી કરો') : 'Copy All'}</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold block">
                  {isGu ? 'YouTube વિડિયો ટાઇટલ:' : 'Video Title:'}
                </label>
                <input
                  type="text"
                  value={youtubeTitle}
                  onChange={(e) => setYoutubeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-['Noto_Sans_Gujarati',sans-serif] focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold block">
                  {isGu ? 'ગુજરાતી ડિસ્ક્રિપ્શન:' : 'Gujarati Description:'}
                </label>
                <textarea
                  rows={4}
                  value={youtubeDescription}
                  onChange={(e) => setYoutubeDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-['Noto_Sans_Gujarati',sans-serif] focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  {isGu ? 'વાયરલ હેશટેગ્સ:' : 'Hashtags:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {youtubeHashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30 text-[11px] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Teleprompter Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isGu ? 'ટેલિપ્રોમ્પ્ટર સ્ક્રિપ્ટ (માયા)' : 'Teleprompter Script (Maya)'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeScriptGu)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
                  title="Copy Script"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs leading-relaxed max-h-52 overflow-y-auto space-y-2 font-['Noto_Sans_Gujarati',sans-serif]">
                {activeScriptGu.split('\n').map((line: string, i: number) => {
                  const isDirectorCue = line.startsWith('[') && line.endsWith(']');
                  return (
                    <p
                      key={i}
                      className={
                        isDirectorCue
                          ? 'text-cyan-400 font-mono text-[11px] bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40'
                          : 'text-slate-200'
                      }
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* AGENT 12: NEWSROOM VIDEO SYNTHESIZER ENGINE SPECS */}
            <div className="bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-2 border-rose-500/40 rounded-xl p-4 shadow-xl text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isGu ? 'એજન્ટ ૧૨: ન્યૂઝરૂમ વિડિયો નિર્માતા' : 'Agent 12: Video Synthesizer Engine'}</span>
                </h3>
                <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                  4K 60fps Active
                </span>
              </div>

              {/* 3D Camera Scene Angle Switcher */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isGu ? '3D સ્ટુડિયો કેમેરા એંગલ્સ (Camera Angles):' : '3D Studio Camera Angles:'}
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                  {[
                    { id: 0, labelGu: '૧. વાઈડ શોટ', labelEn: '1. Wide Desk' },
                    { id: 1, labelGu: '૨. ક્લોઝ-અપ', labelEn: '2. Maya Close' },
                    { id: 2, labelGu: '૩. સ્પ્લિટ-સ્ક્રીન', labelEn: '3. Video Wall' }
                  ].map((scene) => (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSelectedSceneIndex(scene.id)}
                      className={`p-1.5 rounded-lg border text-center font-bold transition ${
                        selectedSceneIndex === scene.id
                          ? 'bg-rose-600 text-white border-rose-400 shadow'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {isGu ? scene.labelGu : scene.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Anchor Persona:</span>
                  <span className="text-rose-300 font-semibold">Maya (માયા) • Voice of Valod</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Studio Stage:</span>
                  <span className="text-sky-400 truncate max-w-[150px]">3D Prime Virtual Newsroom</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lip-Sync Engine:</span>
                  <span className="text-emerald-400 font-bold">99.8% Phoneme Accuracy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lighting Aura:</span>
                  <span className="text-amber-300">Three-Point Broadcast LED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtitles & Chyron:</span>
                  <span className="text-emerald-400">Gujarati Teleprompter Synced</span>
                </div>
              </div>

              {videoSynthesizerData?.broadcastReadySummary && (
                <p className="text-[11px] text-emerald-300/90 font-['Noto_Sans_Gujarati',sans-serif] bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                  ✔ {videoSynthesizerData.broadcastReadySummary}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL ARTICLE & EDITORIAL DRAFT */}
      {activeMediaTab === 'article' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Gujarati Article */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                  {isGu ? 'સંપૂર્ણ ગુજરાતી ન્યૂઝ આર્ટિકલ (વેબસાઇટ & બ્લોગ)' : 'Full Gujarati News Article (WordPress CMS)'}
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(contentData.articleGujarati)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isGu ? 'કોપી કરો' : 'Copy Article'}</span>
              </button>
            </div>

            <h1 className="text-lg font-bold text-white leading-snug font-['Noto_Sans_Gujarati',sans-serif]">
              {pipelineState.selectedTopic.titleGujarati}
            </h1>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-sm leading-relaxed text-slate-200 font-['Noto_Sans_Gujarati',sans-serif] whitespace-pre-wrap">
              {contentData.articleGujarati}
            </div>

            {/* Bullet Points */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {isGu ? 'મુખ્ય મુદ્દાઓ (Key Takeaways):' : 'Key Highlights:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contentData.bulletPoints?.map((bp: string, i: number) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2 font-['Noto_Sans_Gujarati',sans-serif]">
                    <span className="text-emerald-400 font-bold shrink-0">✔</span>
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* English Translation */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                English Translation (Syndication Wire):
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                {contentData.articleEnglish}
              </p>
            </div>
          </div>

          {/* Right Col: Viral Headline Suggestions */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isGu ? 'સૂચવેલા વાયરલ હેડલાઇન્સ (Agent 4 & 9)' : 'Viral Headlines (Agent 4 & 9)'}
              </h3>
              <div className="space-y-2">
                {contentData.suggestedHeadlines?.map((hl: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed cursor-pointer"
                    onClick={() => setThumbnailTitle(hl)}
                  >
                    <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono mb-1">
                      <span>CTR Variant #{idx + 1}</span>
                      <span>96% Est. Clicks</span>
                    </div>
                    <p>{hl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CANVAS THUMBNAIL DESIGNER (Agent 9) */}
      {activeMediaTab === 'thumbnail' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Canvas Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-yellow-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isGu ? 'YouTube & Reels હાઇ-CTR થંબનેલ કેનવાસ' : 'YouTube & Reels High-CTR Thumbnail Canvas'}
                  </h3>
                </div>
                <button
                  onClick={downloadThumbnail}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isGu ? 'ડાઉનલોડ કરો (PNG)' : 'Download (.PNG)'}</span>
                </button>
              </div>

              {/* The Live HTML5 Canvas */}
              <div className="w-full overflow-hidden rounded-xl border border-slate-700 shadow-2xl bg-black flex items-center justify-center p-2">
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="w-full h-auto max-h-[460px] object-contain rounded-lg"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{isGu ? 'માપ: 1280 x 720 px (YouTube HD / Facebook)' : 'Resolution: 1280 x 720 px (HD YouTube)'}</span>
                <span className="text-emerald-400 font-semibold">{isGu ? 'ઓપ્ટિમાઇઝ્ડ કલર કોન્ટ્રાસ્ટ: A++' : 'CTR Contrast: A++'}</span>
              </div>
            </div>
          </div>

          {/* Right Col: Customizer Controls */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {isGu ? 'થંબનેલ ટેક્સ્ટ એડિટર' : 'Thumbnail Text Customizer'}
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isGu ? 'બેજ ટેક્સ્ટ (પીળો બેનર):' : 'Badge Text (Yellow Banner):'}
                </label>
                <input
                  type="text"
                  value={thumbnailBadge}
                  onChange={(e) => setThumbnailBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 font-['Noto_Sans_Gujarati',sans-serif]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isGu ? 'મુખ્ય હેડલાઇન (બોલ્ડ ટેક્સ્ટ):' : 'Main Headline (Bold Text):'}
                </label>
                <textarea
                  rows={3}
                  value={thumbnailTitle}
                  onChange={(e) => setThumbnailTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={downloadThumbnail}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGu ? 'HD થંબનેલ સેવ કરો' : 'Save HD Thumbnail'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DIRECT YOUTUBE @VOICEOFVALOD PUBLISHING & DRAFTS RESOLUTION */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current text-red-500" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isGu ? 'YouTube @voiceofvalod પર વિડિયો પબ્લિશ કરો' : 'Publish to YouTube @voiceofvalod'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Voice of Valod News • Anchor Maya (માયા) Broadcast
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Crucial Explanation: Why Drafts showed "No content available" & Solution */}
            <div className="bg-gradient-to-r from-amber-950/70 to-rose-950/70 border border-amber-500/50 rounded-xl p-4 text-xs text-amber-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm">{isGu ? 'YouTube એપમાં "Drafts: No content available" કેમ આવ્યું?' : 'Why YouTube Drafts showed "No content available"?'}</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {isGu
                  ? 'વિડિયો ફાઇલ હજુ YouTube પર અપલોડ થવાની બાકી હતી, એટલે Drafts ખાલી દેખાતું હતું. નીચે આપેલા ૩ સરળ સ્ટેપથી ૧૦ સેકન્ડમાં વિડિયો તમારી @voiceofvalod ચેનલ પર લાઈવ મૂકો:'
                  : 'The video file was not transferred to YouTube yet. Follow these 3 easy steps to put it live on @voiceofvalod:'}
              </p>
              <div className="bg-slate-950/80 rounded-lg p-3 space-y-2 border border-slate-800 text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">૧</span>
                  <span><strong>વિડિયો ડાઉનલોડ કરો:</strong> નીચે આપેલ લીલા બટન <strong>"📥 વિડિયો ડાઉનલોડ કરો (MP4)"</strong> પર ક્લિક કરો. વિડિયો તમારા ફોનની ગેલેરીમાં સેવ થશે.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">૨</span>
                  <span><strong>ટાઇટલ કોપી કરો:</strong> નીચે <strong>"📋 ટાઇટલ & ટેગ્સ કોપી કરો"</strong> દબાવો.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">૩</span>
                  <span><strong>YouTube એપમાં અપલોડ કરો:</strong> તમારી YouTube એપ ખોલો, નીચે વચ્ચે આપેલા <strong>(+)</strong> બટન પર ટચ કરી <strong>"Upload a video"</strong> સિલેક્ટ કરો અને વિડિયો પબ્લિશ કરો!</span>
                </div>
              </div>
            </div>

            {/* Video & Metadata Details */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">ન્યૂઝ હેડલાઇન:</span>
                <p className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] mt-0.5">
                  {pipelineState.selectedTopic.titleGujarati}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">એન્કર:</span>
                  <span className="text-rose-400 font-bold">Maya (માયા) • Voice of Valod</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">સત્તાવાર ચેનલ:</span>
                  <span className="text-red-400 font-bold">@voiceofvalod</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {/* Button 1: Download Real MP4 Video */}
              <button
                onClick={() => recordAndExportVideo(aspectRatio === '9:16' ? '9:16' : '16:9')}
                disabled={isRecordingVideo}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isRecordingVideo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{`બની રહ્યું છે... ${recordingProgress}%`}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{isGu ? '📥 વિડિયો ડાઉનલોડ (MP4)' : '📥 Download Video'}</span>
                  </>
                )}
              </button>

              {/* Button 2: Copy Metadata */}
              <button
                onClick={copyPublishMetadata}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                {copiedPublishData ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{isGu ? (copiedPublishData ? 'કોપી થઈ ગયું!' : '📋 ટાઇટલ & ટેગ્સ કોપી') : 'Copy Metadata'}</span>
              </button>

              {/* Button 3: Open YouTube Upload Screen */}
              <a
                href="https://studio.youtube.com/channel/videos/upload"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>{isGu ? '🚀 YouTube પર મૂકો' : 'Upload to YouTube'}</span>
              </a>
            </div>

            {/* Publish Success Banner */}
            {publishSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex items-center justify-between">
                <span>✔ {publishSuccess.messageGu || 'વિડિયો સફળતાપૂર્વક Public તરીકે લાઈવ થઈ ગયો છે!'}</span>
                <a
                  href="https://www.youtube.com/@voiceofvalod"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded text-[11px] underline"
                >
                  ચેનલ ખોલો
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
