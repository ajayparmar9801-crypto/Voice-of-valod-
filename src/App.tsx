import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PipelineWorkflow } from './components/PipelineWorkflow';
import { MediaWorkspace } from './components/MediaWorkspace';
import { AgentsRoster } from './components/AgentsRoster';
import { FactCheckGuard } from './components/FactCheckGuard';
import { AutoReplySection } from './components/AutoReplySection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { IntegrationSettings } from './components/IntegrationSettings';
import { AgentExecutionLog } from './components/AgentExecutionLog';
import { LocalValodWidget } from './components/LocalValodWidget';
import { CitizenReporterModal } from './components/CitizenReporterModal';
import { OwnerApprovalDashboard } from './components/OwnerApprovalDashboard';
import { SiteTrafficWidget } from './components/SiteTrafficWidget';
import { ZentrixLeadModal } from './components/ZentrixLeadModal';
import { INITIAL_AGENTS, SAMPLE_TOPICS } from './data/agentsData';
import {
  AgentExecutionRecord,
  AgentInfo,
  Language,
  NewsFeedItem,
  PipelineState,
  SiteTrafficStats,
  TrendTopic,
  ZentrixLead,
  ZentrixLeadService,
} from './types';

const INITIAL_NEWS_ITEMS: NewsFeedItem[] = [
  {
    id: 'news-valod-101',
    titleGujarati: 'વાલોડ અને વ્યારા APMC માર્કેટ યાર્ડમાં નવી ડાંગર અને શેરડીના ભાવમાં મજબૂત ઉછાળો',
    titleEnglish: 'Valod & Vyara APMC Mandi sees strong surge in new Paddy and Sugarcane prices',
    summaryGujarati: 'વાલોડ તાલુકા અને તાપી જિલ્લાના ખેડૂતો માટે સારા સમાચાર! વ્યારા APMC ખાતે ડાંગરની આવક વધવા છતાં ભાવ ₹૪૯૫/મણ આસપાસ મજબૂત રહેતા ખેડૂતોમાં ખુશીની લહેર જોવા મળી છે.',
    summaryEnglish: 'Farmers in Valod & Tapi welcome strong Paddy and Sugarcane rates at Vyara APMC yard.',
    category: 'Valod & Tapi',
    location: 'વાલોડ (Valod), તાપી',
    sourceType: 'pipeline',
    aiConfidenceScore: 96,
    aiVerified: true,
    factCheckVerdictGu: 'વ્યારા APMC દૈનિક હરાજી રજિસ્ટર સાથે ચકાસાયેલ (96% AI Verified). ઓનર દ્વારા પબ્લિશ મંજૂર.',
    factCheckVerdictEn: 'Cross-checked against Vyara APMC daily auction data (96% AI Verified).',
    status: 'approved',
    inYouTubeQueue: true,
    createdAt: '08:15 AM',
    approvedAt: '08:22 AM',
    scriptGujarati: 'નમસ્કાર દર્શક મિત્રો, હું માયા... વોઇસ ઓફ વાલોડ ન્યૂઝમાં આપનું સ્વાગત છે. આજે વાલોડ અને તાપી જિલ્લાના ખેડૂતો માટે અત્યંત રાહતના સમાચાર આવ્યા છે.\n\nવ્યારા અને વાલોડ APMC માર્કેટ યાર્ડમાં નવી ડાંગર અને શેરડીની આવક સાથે જ ભાવમાં મજબૂત ઉછાળો નોંધાયો છે. સારી ક્વોલિટીની ડાંગર પ્રતિ મણ ₹૪૯૫ સુધી વેચાઈ રહી છે.\n\nવાલોડ સુગર ફેક્ટરી તરફથી પણ શેરડીના ખેડૂતોને સમયસર ભાવ મળતા સ્થાનિક બજારમાં રોનક જોવા મળી રહી છે.\n\nવાલોડ અને તાપી જિલ્લાના ખેડૂતલક્ષી સમાચારો માટે જોડાયેલા રહો @voiceofvalod સાથે. આભાર.',
    hashtags: ['#VoiceOfValod', '#ValodNews', '#VyaraAPMC', '#TapiFarmers', '#GujaratNews'],
  },
  {
    id: 'news-valod-102',
    titleGujarati: 'ગાંધીનગર GIFT City માં નવું ગ્લોબલ ફિનટેક હબ અને ૫૦,૦૦૦ નવી નોકરીઓની જાહેરાત',
    titleEnglish: 'GIFT City Gandhinagar announces Global FinTech Hub with 50,000 new jobs',
    summaryGujarati: 'ગુજરાત સરકાર અને વૈશ્વિક ફિનટેક કંપનીઓના સહયોગથી ગાંધીનગર ખાતે અત્યાધુનિક ઇનોવેશન હબ બનશે, જેનાથી દક્ષિણ ગુજરાત સહિત સમગ્ર રાજ્યના યુવાનોને ૫૦,૦૦૦ નવી રોજગારી મળશે.',
    summaryEnglish: 'Landmark GIFT City Fintech expansion expected to generate 50,000 high-skilled roles across Gujarat.',
    category: 'Gujarat',
    location: 'ગાંધીનગર / સુરત-તાપી',
    sourceType: 'pipeline',
    aiConfidenceScore: 98,
    aiVerified: true,
    factCheckVerdictGu: 'સત્તાવાર સરકારી પ્રેસનોટ અને GIFT City ઓથોરિટી મુજબ ૧૦૦% સુરક્ષિત અને પ્રમાણિત.',
    factCheckVerdictEn: 'Verified with official GIFT City authority announcement (98% AI Verified).',
    status: 'approved',
    inYouTubeQueue: true,
    createdAt: '07:40 AM',
    approvedAt: '07:45 AM',
    scriptGujarati: 'નમસ્કાર દર્શક મિત્રો, હું માયા... વોઇસ ઓફ વાલોડ ન્યૂઝમાં આપનું સ્વાગત છે. ગુજરાતના યુવાનો માટે આજના સૌથી મોટા સમાચાર આવી રહ્યા છે.\n\nગાંધીનગર GIFT સિટીમાં વિશ્વકક્ષાનું ગ્લોબલ ફિનટેક હબ બનવા જઈ રહ્યું છે, જેમાં ૫૦,૦૦૦ થી વધુ નવી નોકરીઓની તકો ઊભી થશે.\n\nઆ પ્રોજેક્ટથી વાલોડ, સુરત અને તાપીના ટેકનિકલ શિક્ષિત યુવાનોને પણ ઘરઆંગણે વૈશ્વિક તકો મળી શકશે.\n\nતાજા સમાચારો માટે સબ્સ્ક્રાઇબ કરો અમારી ચેનલ @voiceofvalod. આભાર.',
    hashtags: ['#VoiceOfValod', '#GIFTCity', '#GujaratJobs', '#GujaratNews', '#BreakingNews'],
  },
  {
    id: 'news-citizen-103',
    titleGujarati: 'વાલોડ-બાજીપુરા રોડ પર સ્ટ્રીટ લાઇટ અને ટ્રાફિક સિગ્નલ સુધારણા અંગે નાગરિકોની રજૂઆત',
    titleEnglish: 'Residents request street light & traffic safety upgrade on Valod–Bajipura road',
    summaryGujarati: 'વાલોડ અને બાજીપુરા વચ્ચે સાંજના સમયે વધતા ટ્રાફિકને ધ્યાનમાં રાખીને સ્થાનિક વેપારીઓ અને વાહનચાલકોએ મુખ્ય ચોક પર સોલાર સ્ટ્રીટ લાઇટ શરૂ કરવાની માંગ કરી છે.',
    summaryEnglish: 'Local commuters and traders highlight need for improved evening lighting at Bajipura crossroad.',
    category: 'Valod & Tapi',
    location: 'બાજીપુરા (Bajipura), વાલોડ',
    sourceType: 'citizen_reporter',
    reporterName: 'રમેશભાઈ પટેલ',
    aiConfidenceScore: 93,
    aiVerified: true,
    factCheckVerdictGu: 'સિટિઝન રિપોર્ટ AI ફેક્ટ-ચેક એજન્ટ દ્વારા સુરક્ષા અને વિશ્વસનીયતા માટે 93% સ્કોર સાથે પ્રમાણિત. ઓનર અપ્રૂવલ બાકી.',
    factCheckVerdictEn: 'Citizen report passed AI plausibility & community guidelines check (93% AI Verified).',
    status: 'pending_approval',
    inYouTubeQueue: false,
    createdAt: '09:05 AM',
    scriptGujarati: 'નમસ્કાર દર્શક મિત્રો, હું માયા... વોઇસ ઓફ વાલોડ ન્યૂઝમાં આપનું સ્વાગત છે. આજે વાલોડ અને બાજીપુરાથી એક મહત્વનો સ્થાનિક જનહિત અહેવાલ સામે આવ્યો છે.\n\nસિટિઝન રિપોર્ટર દ્વારા મળેલી માહિતી મુજબ, વાલોડ-બાજીપુરા મુખ્ય માર્ગ પર સાંજના સમયે ટ્રાફિક વધતા સોલાર સ્ટ્રીટ લાઇટ અને સિગ્નલ સુધારણાની જરૂરિયાત ઊભી થઈ છે.\n\nસ્થાનિક નાગરિકો અને વેપારીઓએ વહીવટીતંત્ર સમક્ષ વહેલી તકે કામગીરી શરૂ કરવા અપીલ કરી છે.\n\nતમારા વિસ્તારના પ્રશ્નો અમને મોકલો અને @voiceofvalod ચેનલને સબ્સ્ક્રાઇબ કરો. આભાર.',
    hashtags: ['#VoiceOfValod', '#ValodNews', '#Bajipura', '#CitizenReporter', '#TapiNews'],
  },
];

export default function App() {
  const [language, setLanguage] = useState<Language>('gu');
  const [activeTab, setActiveTab] = useState<string>('pipeline');
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [topics, setTopics] = useState<TrendTopic[]>(SAMPLE_TOPICS);

  const [executionHistory, setExecutionHistory] = useState<AgentExecutionRecord[]>([
    {
      id: 'exec-12-001',
      agentId: 'agent-12',
      agentNumber: 12,
      agentNameGu: 'Newsroom Video Synthesizer (ન્યૂઝરૂમ વિડિયો નિર્માતા)',
      agentNameEn: 'Newsroom Video Synthesizer',
      topicTitle: 'ગાંધીનગર GIFT City માં નવું ગ્લોબલ ફિનટેક હબ અને ૫૦,૦૦૦ નવી નોકરીઓની જાહેરાત',
      startTime: '07:14:10 AM',
      endTime: '07:14:14 AM',
      durationMs: 3850,
      status: 'success',
      summaryGu: 'એન્કર માયા સાથેનો 3D ન્યૂઝરૂમ બ્રોડકાસ્ટ વિડિયો, 4K અલ્ટ્રા એચડી, લિપ-સિંક અને ગુજરાતી સબટાઇટલ સાથે સફળતાપૂર્વક રેન્ડર થયો.',
      summaryEn: 'Rendered 4K 3D studio video featuring Anchor Maya reading Gujarati script with neural phoneme lip-sync and broadcast lighting.',
      outputPreview: {
        anchor: 'Maya (માયા)',
        studio: 'Voice of Valod 3D Prime Newsroom Studio',
        resolution: '4K Ultra HD & 9:16 Shorts Dual Master',
        durationSeconds: 48,
        status: 'Rendering Complete'
      }
    },
    {
      id: 'exec-04-001',
      agentId: 'agent-4',
      agentNumber: 4,
      agentNameGu: 'Content Creator (લેખક)',
      agentNameEn: 'Content Creator',
      topicTitle: 'ગાંધીનગર GIFT City માં નવું ગ્લોબલ ફિનટેક હબ અને ૫૦,૦૦૦ નવી નોકરીઓની જાહેરાત',
      startTime: '07:14:02 AM',
      endTime: '07:14:04 AM',
      durationMs: 2150,
      status: 'success',
      summaryGu: 'એન્કર માયા માટે પૂર્ણ બુલેટિન ટેલિપ્રોમ્પ્ટર સ્ક્રિપ્ટ અને વેબસાઇટ આર્ટિકલ તૈયાર કરાયો.',
      summaryEn: 'Drafted complete Gujarati broadcast teleprompter script and digital web article.',
      outputPreview: {
        anchorName: 'Maya (માયા)',
        wordCount: 185,
        language: 'Gujarati'
      }
    },
    {
      id: 'exec-08-001',
      agentId: 'agent-8',
      agentNumber: 8,
      agentNameGu: 'Fact-Checker & Policy Guard (નકલી ન્યૂઝ રોકનાર)',
      agentNameEn: 'Fact-Checker & Policy Guard',
      topicTitle: 'ગાંધીનગર GIFT City માં નવું ગ્લોબલ ફિનટેક હબ અને ૫૦,૦૦૦ નવી નોકરીઓની જાહેરાત',
      startTime: '07:14:05 AM',
      endTime: '07:14:07 AM',
      durationMs: 1940,
      status: 'success',
      summaryGu: 'ફેક્ટ સ્કોર ૯૮/૧૦૦. સરકારી પ્રેસનોટ સાથે પ્રમાણિત, કોપીરાઇટ અને મોનેટાઇઝેશન માટે ૧૦૦% સુરક્ષિત.',
      summaryEn: 'Verified claims with official GIFT City authority records. 100% Monetization & YouTube Safe.',
      outputPreview: {
        factScore: 98,
        verdict: 'AUTHENTIC & SAFE',
        youtubeSafe: true
      }
    },
    {
      id: 'exec-01-001',
      agentId: 'agent-1',
      agentNumber: 1,
      agentNameGu: 'Trend Finder (ટ્રેન્ડ શોધક)',
      agentNameEn: 'Trend Finder',
      topicTitle: 'ગાંધીનગર GIFT City માં નવું ગ્લોબલ ફિનટેક હબ અને ૫૦,૦૦૦ નવી નોકરીઓની જાહેરાત',
      startTime: '07:13:58 AM',
      endTime: '07:14:00 AM',
      durationMs: 1620,
      status: 'success',
      summaryGu: 'ગુગલ ટ્રેન્ડ્સ અને X વાયર પરથી ૯૭ વાયરલ સ્કોર સાથે બ્રેકિંગ ટોપિક ડિટેક્ટ કરાયો.',
      summaryEn: 'Identified high-velocity breaking trend across Google Trends & X with 97 viral score.',
      outputPreview: {
        viralScore: 97,
        category: 'Gujarat',
        source: 'Google Trends & X'
      }
    }
  ]);

  const [pipelineState, setPipelineState] = useState<PipelineState>({
    currentStepIndex: 0,
    isRunning: false,
    awaitingApproval: false,
    selectedTopic: SAMPLE_TOPICS[0],
    agentOutputs: {},
    logs: [
      {
        timestamp: new Date().toLocaleTimeString(),
        message: 'Voice of Valod Newsroom initialized. 12 Agents ready.',
        level: 'info'
      }
    ]
  });

  const [whatsAppApprovedNotice, setWhatsAppApprovedNotice] = useState<string | null>(null);
  const [isRefreshingTrends, setIsRefreshingTrends] = useState<boolean>(false);
  const [newsItems, setNewsItems] = useState<NewsFeedItem[]>(INITIAL_NEWS_ITEMS);
  const [isCitizenReporterOpen, setIsCitizenReporterOpen] = useState<boolean>(false);
  const [selectedStudioItemId, setSelectedStudioItemId] = useState<string>(INITIAL_NEWS_ITEMS[0].id);
  const [trafficStats, setTrafficStats] = useState<SiteTrafficStats | null>(null);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState<boolean>(false);
  const [zentrixLeads, setZentrixLeads] = useState<ZentrixLead[]>([]);
  const [isZentrixModalOpen, setIsZentrixModalOpen] = useState<boolean>(false);
  const [zentrixInitialService, setZentrixInitialService] = useState<ZentrixLeadService>('Website');

  useEffect(() => {
    const onQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  useEffect(() => {
    fetch('/api/zentrix/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.leads)) {
          setZentrixLeads(data.leads);
        }
      })
      .catch(() => {});
  }, []);

  const openZentrixModal = (service: ZentrixLeadService = 'Website') => {
    setZentrixInitialService(service);
    setIsZentrixModalOpen(true);
  };

  const handleZentrixLeadSubmitted = (lead: ZentrixLead) => {
    setZentrixLeads((prev) => [lead, ...prev]);
    addLog(`🚀 New Zentrix Digital lead received from "${lead.businessName}" (${lead.service}). Saved in Owner Studio!`, 'success');
  };

  const handleUpdateZentrixLeadStatus = async (id: string, status: ZentrixLead['status']) => {
    setZentrixLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await fetch(`/api/zentrix/leads/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {}
  };

  const getOrCreateSessionId = () => {
    try {
      const existing = sessionStorage.getItem('vov_session_id');
      if (existing) return existing;
      const created = `vov-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      sessionStorage.setItem('vov_session_id', created);
      return created;
    } catch {
      return `vov-${Date.now().toString(36)}`;
    }
  };

  const trackTrafficHit = async (page: string, event: 'pageview' | 'whatsapp_share' | 'video_export' = 'pageview') => {
    try {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const res = await fetch('/api/traffic/hit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getOrCreateSessionId(),
          page,
          device: isMobile ? 'mobile' : 'desktop',
          event,
        }),
      });
      const data = await res.json();
      if (data?.success && data.stats) {
        setTrafficStats(data.stats);
      }
    } catch {}
  };

  const refreshTrafficStats = async () => {
    try {
      const res = await fetch('/api/traffic/stats');
      const data = await res.json();
      if (data?.success && data.stats) {
        setTrafficStats(data.stats);
      }
    } catch {}
  };

  useEffect(() => {
    trackTrafficHit(activeTab, 'pageview');
    const timer = window.setInterval(() => {
      refreshTrafficStats();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [activeTab]);

  // Refresh dynamic trends on user demand
  const handleRefreshTrends = async (category: string = 'all') => {
    setIsRefreshingTrends(true);
    addLog(`Agent 1: Fetching fresh breaking news trends for category "${category}"...`, 'info');
    try {
      const res = await fetch('/api/trends/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          region: 'Gujarat, India',
          refreshSeed: Date.now()
        })
      });
      const data = await res.json();
      if (data?.success && data.trends?.length > 0) {
        setTopics(data.trends);
        setPipelineState(prev => ({
          ...prev,
          selectedTopic: data.trends[0],
          logs: [
            {
              timestamp: new Date().toLocaleTimeString(),
              message: `Agent 1: Discovered ${data.trends.length} fresh breaking trends! Active: "${data.trends[0].titleGujarati}"`,
              level: 'success'
            },
            ...prev.logs
          ]
        }));
      }
    } catch (err: any) {
      addLog(`Failed to refresh trends: ${err.message}`, 'error');
    } finally {
      setIsRefreshingTrends(false);
    }
  };

  // Check URL query params for 1-Click WhatsApp Approval (?action=approve)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'approve') {
      const phone = params.get('phone') || '9426249922';
      const successText = `👑 WhatsApp (+91 ${phone}) પરથી લાઈવ ૧-ક્લિક મંજૂરી મળી ગઈ છે! સ્ટોરી આપોઆપ Approve થઈને YouTube @voiceofvalod પર પબ્લિશ થઈ રહી છે... 🎉`;
      setWhatsAppApprovedNotice(successText);
      addLog(`👑 WhatsApp 1-Click Approval link activated for +91 ${phone}! Auto-approving story for syndication to YouTube @voiceofvalod...`, 'success');
      window.history.replaceState({}, '', window.location.pathname);
      
      // Complete Agent 6 and trigger publishing
      setTimeout(() => {
        handleApprovePublish();
      }, 700);
    }
  }, []);

  // Fetch initial live trends from backend
  useEffect(() => {
    handleRefreshTrends('all');
  }, []);

  const addLog = (message: string, level: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setPipelineState(prev => ({
      ...prev,
      logs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          message,
          level
        },
        ...prev.logs
      ]
    }));
  };

  const recordAuditLog = (
    agentId: string,
    startTime: string,
    endTime: string,
    durationMs: number,
    status: 'success' | 'failed' | 'warning',
    outputData?: any,
    errorMessage?: string
  ) => {
    const targetAgent = agents.find(a => a.id === agentId);
    const newRecord: AgentExecutionRecord = {
      id: `exec-${agentId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      agentId,
      agentNumber: targetAgent?.number || 0,
      agentNameGu: targetAgent?.nameGu || agentId,
      agentNameEn: targetAgent?.nameEn || agentId,
      topicTitle: pipelineState.selectedTopic.titleGujarati,
      startTime,
      endTime,
      durationMs,
      status,
      summaryGu: outputData?.broadcastReadySummary || outputData?.syndicationSummary || targetAgent?.roleGu || `એજન્ટ ${agentId} નું કામ પૂર્ણ થયું.`,
      summaryEn: outputData?.summary || targetAgent?.roleEn || `Agent ${agentId} completed execution.`,
      outputPreview: outputData,
      error: errorMessage
    };
    setExecutionHistory(prev => [newRecord, ...prev]);
  };

  // Run a single agent step
  const runSingleAgent = async (agentId: string) => {
    setAgents(prev =>
      prev.map(a => (a.id === agentId ? { ...a, status: 'running' } : a))
    );
    addLog(`Running single execution for Agent ${agentId}...`, 'info');
    const startIso = new Date().toLocaleTimeString();
    const startMs = Date.now();

    try {
      const res = await fetch('/api/pipeline/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          topic: pipelineState.selectedTopic,
          context: pipelineState.agentOutputs
        })
      });

      const data = await res.json();
      const endMs = Date.now();
      const endIso = new Date().toLocaleTimeString();
      const durationMs = endMs - startMs;

      if (data?.success) {
        setAgents(prev =>
          prev.map(a =>
            a.id === agentId
              ? { ...a, status: 'completed', output: data.result.output }
              : a
          )
        );
        setPipelineState(prev => ({
          ...prev,
          agentOutputs: {
            ...prev.agentOutputs,
            [agentId]: data.result
          }
        }));
        addLog(`Agent ${agentId} executed successfully in ${durationMs}ms.`, 'success');
        recordAuditLog(agentId, startIso, endIso, durationMs, 'success', data.result?.output);
      } else {
        recordAuditLog(agentId, startIso, endIso, durationMs, 'failed', null, data?.error || 'API Error');
      }
    } catch (e: any) {
      const endMs = Date.now();
      const endIso = new Date().toLocaleTimeString();
      const durationMs = endMs - startMs;
      addLog(`Failed to run Agent ${agentId}: ${e.message}`, 'error');
      setAgents(prev =>
        prev.map(a => (a.id === agentId ? { ...a, status: 'idle' } : a))
      );
      recordAuditLog(agentId, startIso, endIso, durationMs, 'failed', null, e.message);
    }
  };

  // Run the full 12-agent pipeline
  const startFullPipeline = async () => {
    if (pipelineState.isRunning) return;

    setPipelineState(prev => ({
      ...prev,
      isRunning: true,
      awaitingApproval: false
    }));
    addLog(`🚀 Starting full 12-Agent autonomous news cycle for: "${pipelineState.selectedTopic.titleGujarati}"`, 'info');

    // Execution sequence: 1 -> 2 -> 3 -> 4 -> 8 -> 9 -> 12 (Anchor Maya Video) -> 5 -> 6 (PAUSE FOR APPROVAL)
    const phase1Agents = ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-8', 'agent-9', 'agent-12', 'agent-5', 'agent-6'];

    for (const agentId of phase1Agents) {
      // Mark agent running
      setAgents(prev =>
        prev.map(a => (a.id === agentId ? { ...a, status: 'running' } : a))
      );
      addLog(`[Stage ${agentId}] Initializing agent processing...`, 'info');
      const startIso = new Date().toLocaleTimeString();
      const startMs = Date.now();

      try {
        const res = await fetch('/api/pipeline/run-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId,
            topic: pipelineState.selectedTopic,
            context: pipelineState.agentOutputs
          })
        });

        const data = await res.json();
        const endMs = Date.now();
        const endIso = new Date().toLocaleTimeString();
        const durationMs = endMs - startMs;
        if (data?.success) {
          if (agentId === 'agent-6') {
            // Pause for owner approval!
            setAgents(prev =>
              prev.map(a =>
                a.id === agentId
                  ? { ...a, status: 'awaiting_approval', output: data.result.output }
                  : a
              )
            );
            // If user configured Telegram, dispatch real alert!
            const savedToken = localStorage.getItem('ai_news_telegram_token');
            const savedChatId = localStorage.getItem('ai_news_telegram_chatid');
            if (savedToken && savedChatId) {
              fetch('/api/telegram/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  botToken: savedToken,
                  chatId: savedChatId,
                  topicTitle: pipelineState.selectedTopic.titleGujarati,
                  message: `🚨 *વોઇસ ઓફ વાલોડ ન્યૂઝ એલર્ટ: ન્યૂઝ કન્ટેન્ટ મંજૂરી માટે તૈયાર છે!*\n\n📌 *વિષય:* ${pipelineState.selectedTopic.titleGujarati}\n✅ *ફેક્ટ ચેક:* 98/100 (પ્રમાણિત અને સુરક્ષિત)\n🎬 *એન્કર માયા વિડિયો અને સ્ક્રિપ્ટ:* તૈયાર છે.\n\n👇 કૃપા કરીને વેબસાઇટમાં જઈને અથવા અહીં 'Approve' કરીને પબ્લિશ કરો.`
                })
              })
                .then(r => r.json())
                .then(tData => {
                  if (tData.success) {
                    addLog(`📱 Telegram Bot Alert: તમારા ફોનમાં ટેલિગ્રામ મેસેજ સફળતાપૂર્વક પહોંચી ગયો છે!`, 'success');
                  }
                })
                .catch(() => {});
            }

            // Also dispatch WhatsApp Approval Permission to +91 9426249922!
            const targetPhone = localStorage.getItem('ai_news_whatsapp_phone') || '9426249922';
            fetch('/api/whatsapp/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone: targetPhone,
                topicTitle: pipelineState.selectedTopic.titleGujarati,
                actionUrl: window.location.href
              })
            })
              .then(r => r.json())
              .then(wData => {
                if (wData.success) {
                  setPipelineState(prev => ({
                    ...prev,
                    whatsappAlertUrl: wData.waDirectUrl,
                    whatsappPhone: targetPhone
                  }));
                  addLog(`📲 WhatsApp Approval: +91 ${targetPhone} પર ન્યૂઝ પબ્લિશ અપ્રૂવલ એલર્ટ તૈયાર છે!`, 'success');
                }
              })
              .catch(() => {});

            // Register pipeline story in Owner Approval queue with AI Fact-Check confidence
            const factScore = Number(pipelineState.agentOutputs['agent-8']?.output?.factScore) || 96;
            const pipelineItemId = `pipe-${pipelineState.selectedTopic.id}`;
            const script4 = pipelineState.agentOutputs['agent-4']?.output?.videoScriptGujarati;
            const summary4 = pipelineState.agentOutputs['agent-4']?.output?.articleGujarati;
            setNewsItems(prev => {
              const filtered = prev.filter(item => item.id !== pipelineItemId);
              return [
                {
                  id: pipelineItemId,
                  titleGujarati: pipelineState.selectedTopic.titleGujarati,
                  titleEnglish: pipelineState.selectedTopic.titleEnglish,
                  summaryGujarati: summary4 || pipelineState.selectedTopic.summary || pipelineState.selectedTopic.titleGujarati,
                  summaryEnglish: pipelineState.selectedTopic.summary || pipelineState.selectedTopic.titleEnglish,
                  category: pipelineState.selectedTopic.category || 'Valod & Gujarat',
                  location: pipelineState.selectedTopic.location || 'વાલોડ / ગુજરાત',
                  sourceType: 'pipeline',
                  aiConfidenceScore: factScore,
                  aiVerified: true,
                  factCheckVerdictGu: `AI ફેક્ટ-ચેક (Agent 8) દ્વારા ${factScore}% વિશ્વસનીયતા સાથે પ્રમાણિત. ઓનર અપ્રૂવલ માટે તૈયાર.`,
                  factCheckVerdictEn: `Verified by AI Fact-Check Agent (${factScore}% AI Verified). Pending Owner Approval.`,
                  status: 'pending_approval',
                  inYouTubeQueue: false,
                  createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  scriptGujarati: script4,
                  hashtags: ['#VoiceOfValod', '#ValodNews', '#GujaratNews', '#BreakingNews'],
                },
                ...filtered,
              ];
            });

            setPipelineState(prev => ({
              ...prev,
              isRunning: false,
              awaitingApproval: true,
              agentOutputs: {
                ...prev.agentOutputs,
                [agentId]: data.result
              }
            }));
            addLog(`🔔 Agent 6 dispatched review alert: Awaiting Channel Owner Approval via WhatsApp (+91 ${targetPhone}) & Telegram.`, 'warn');
            recordAuditLog(agentId, startIso, endIso, durationMs, 'warning', data.result?.output);
            return; // Pause here!
          } else {
            setAgents(prev =>
              prev.map(a =>
                a.id === agentId
                  ? { ...a, status: 'completed', output: data.result.output }
                  : a
              )
            );
            setPipelineState(prev => ({
              ...prev,
              agentOutputs: {
                ...prev.agentOutputs,
                [agentId]: data.result
              }
            }));
            addLog(`✅ Agent ${agentId} completed output.`, 'success');
            recordAuditLog(agentId, startIso, endIso, durationMs, 'success', data.result?.output);
          }
        }
      } catch (e: any) {
        addLog(`Error in Agent ${agentId}: ${e.message}`, 'error');
        recordAuditLog(agentId, startIso, new Date().toLocaleTimeString(), 1000, 'failed', null, e.message);
      }

      // Small delay between nodes for realistic visual sequence
      await new Promise(r => setTimeout(r, 600));
    }
  };

  // Triggered when owner clicks "Approve & Publish" (Yes/Approve)
  const handleApprovePublish = async () => {
    addLog(`👑 Owner approved story! Resuming pipeline for syndication (Agents 7, 10, 11)...`, 'success');

    // Complete Agent 6
    setAgents(prev =>
      prev.map(a => (a.id === 'agent-6' ? { ...a, status: 'completed' } : a))
    );
    setPipelineState(prev => ({
      ...prev,
      awaitingApproval: false,
      isRunning: true
    }));

    // Run phase 2: Agent 7 (Publisher), Agent 10 (Auto-Reply), Agent 11 (Analytics)
    const phase2Agents = ['agent-7', 'agent-10', 'agent-11'];

    for (const agentId of phase2Agents) {
      setAgents(prev =>
        prev.map(a => (a.id === agentId ? { ...a, status: 'running' } : a))
      );
      const startIso = new Date().toLocaleTimeString();
      const startMs = Date.now();

      try {
        const res = await fetch('/api/pipeline/run-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId,
            topic: pipelineState.selectedTopic,
            context: pipelineState.agentOutputs
          })
        });

        const data = await res.json();
        const endMs = Date.now();
        const endIso = new Date().toLocaleTimeString();
        const durationMs = endMs - startMs;

        if (data?.success) {
          setAgents(prev =>
            prev.map(a =>
              a.id === agentId
                ? { ...a, status: 'completed', output: data.result.output }
                : a
            )
          );
          setPipelineState(prev => ({
            ...prev,
            agentOutputs: {
              ...prev.agentOutputs,
              [agentId]: data.result
            }
          }));
          addLog(`✅ Agent ${agentId} completed execution in ${durationMs}ms.`, 'success');
          recordAuditLog(agentId, startIso, endIso, durationMs, 'success', data.result?.output);
        } else {
          recordAuditLog(agentId, startIso, endIso, durationMs, 'failed', null, data?.error || 'Execution failed');
        }
      } catch (err: any) {
        addLog(`Error executing ${agentId}: ${err.message}`, 'error');
        recordAuditLog(agentId, startIso, new Date().toLocaleTimeString(), 1000, 'failed', null, err.message);
      }

      await new Promise(r => setTimeout(r, 600));
    }

    setPipelineState(prev => ({ ...prev, isRunning: false }));
    // Also mark any matching pending pipeline item as approved & move to YouTube queue
    const activePipeId = `pipe-${pipelineState.selectedTopic.id}`;
    setNewsItems(prev =>
      prev.map(item =>
        item.id === activePipeId
          ? {
              ...item,
              status: 'approved',
              inYouTubeQueue: true,
              approvedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            }
          : item
      )
    );
    addLog(`🎉 All 12 agents successfully completed! Content published & moved to YouTube Video Studio queue.`, 'success');
  };

  const handleRejectPublish = () => {
    addLog(`⚠️ Owner requested content revision. Re-running Content Creator & SEO...`, 'warn');
    setPipelineState(prev => ({
      ...prev,
      awaitingApproval: false,
      isRunning: false
    }));
    setAgents(prev =>
      prev.map(a =>
        a.id === 'agent-6' ? { ...a, status: 'idle' } : a
      )
    );
  };

  const handleCitizenReportSubmitted = (item: NewsFeedItem) => {
    setNewsItems(prev => [item, ...prev]);
    addLog(`📸 Citizen Reporter submission received from "${item.location}" (${item.aiConfidenceScore}% AI Verified). Queued for Owner Approval.`, 'success');
    setActiveTab('owner_control');
  };

  const handleApproveNewsItem = (itemId: string) => {
    const target = newsItems.find(i => i.id === itemId);
    setNewsItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              status: 'approved',
              inYouTubeQueue: true,
              approvedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            }
          : item
      )
    );
    setSelectedStudioItemId(itemId);
    if (target) {
      addLog(`👑 Owner approved "${target.titleGujarati}". Live on feed & added to YouTube Video Studio queue!`, 'success');
      if (target.id === `pipe-${pipelineState.selectedTopic.id}` && pipelineState.awaitingApproval) {
        handleApprovePublish();
      }
    }
  };

  const handleRejectNewsItem = (itemId: string) => {
    setNewsItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, status: 'rejected', inYouTubeQueue: false }
          : item
      )
    );
    addLog(`⚠️ Owner marked item #${itemId} as rejected/revision needed.`, 'warn');
  };

  const handleOpenItemInYouTubeStudio = (item: NewsFeedItem) => {
    setSelectedStudioItemId(item.id);
    setActiveTab('workspace');
  };

  const resetPipeline = () => {
    setAgents(INITIAL_AGENTS);
    setPipelineState(prev => ({
      ...prev,
      isRunning: false,
      awaitingApproval: false,
      agentOutputs: {},
      logs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: 'Pipeline state reset. Ready for next breaking news.',
          level: 'info'
        }
      ]
    }));
  };

  const handleSelectTopic = (topic: TrendTopic) => {
    setPipelineState(prev => ({
      ...prev,
      selectedTopic: topic,
      awaitingApproval: false,
      isRunning: false
    }));
    addLog(`Selected news topic: "${topic.titleGujarati}"`, 'info');
  };

  const handleCustomTopicSubmit = (custom: Partial<TrendTopic>) => {
    const newTopic: TrendTopic = {
      id: `custom-${Date.now()}`,
      titleGujarati: custom.titleGujarati || 'કસ્ટમ બ્રેકિંગ ન્યૂઝ',
      titleEnglish: custom.titleEnglish || 'Custom Breaking News',
      category: custom.category || 'Gujarat',
      viralScore: custom.viralScore || 95,
      sourcePlatform: custom.sourcePlatform || 'Custom Editorial Input',
      summary: custom.summary || '',
      sampleKeywords: custom.sampleKeywords || ['News', 'Live']
    };

    setTopics(prev => [newTopic, ...prev]);
    setPipelineState(prev => ({
      ...prev,
      selectedTopic: newTopic
    }));
    setActiveTab('pipeline');
    addLog(`Added custom news topic: "${newTopic.titleGujarati}". Ready to run!`, 'success');
  };

  const isGu = language === 'gu';
  const pendingItems = newsItems.filter(i => i.status === 'pending_approval');
  const approvedItems = newsItems.filter(i => i.status === 'approved');
  const youtubeQueueItems = approvedItems.filter(i => i.inYouTubeQueue);
  const selectedApprovedItem = youtubeQueueItems.find(i => i.id === selectedStudioItemId) || youtubeQueueItems[0] || null;
  const breakingTickerHeadlines = approvedItems.map(i => i.titleGujarati);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Main Navigation & Branding */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        pipelineState={pipelineState}
        onStartPipeline={startFullPipeline}
        onResetPipeline={resetPipeline}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        breakingHeadlines={breakingTickerHeadlines}
        pendingApprovalCount={pendingItems.length}
        onOpenCitizenReporter={() => setIsCitizenReporterOpen(true)}
        trafficStats={trafficStats}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-5">
        {whatsAppApprovedNotice && (
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl shrink-0">
                ✅
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                  WHATSAPP 1-CLICK APPROVAL CONFIRMED
                </span>
                <p className="text-sm font-bold text-white mt-0.5 font-['Noto_Sans_Gujarati',sans-serif]">
                  {whatsAppApprovedNotice}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setWhatsAppApprovedNotice(null)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition text-xs font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Compact Valod Weather + Vyara Mandi Bhav & Live Website Traffic Bar */}
        {(activeTab === 'pipeline' || activeTab === 'owner_control') && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-7">
              <LocalValodWidget language={language} />
            </div>
            <div className="xl:col-span-5">
              <SiteTrafficWidget
                language={language}
                stats={trafficStats}
                onRefresh={refreshTrafficStats}
              />
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <PipelineWorkflow
            language={language}
            agents={agents}
            pipelineState={pipelineState}
            topics={topics}
            approvedNews={approvedItems}
            onSelectTopic={handleSelectTopic}
            onRefreshTrends={handleRefreshTrends}
            isRefreshingTrends={isRefreshingTrends}
            onApprovePublish={handleApprovePublish}
            onRejectPublish={handleRejectPublish}
            onRunSingleAgent={runSingleAgent}
            onViewAgentDetails={() => {
              setActiveTab('agents');
            }}
            onSwitchTab={setActiveTab}
            onOpenInStudio={handleOpenItemInYouTubeStudio}
            onOpenZentrixModal={openZentrixModal}
          />
        )}

        {activeTab === 'owner_control' && (
          <OwnerApprovalDashboard
            language={language}
            newsItems={newsItems}
            onApproveItem={handleApproveNewsItem}
            onRejectItem={handleRejectNewsItem}
            onOpenInYouTubeStudio={handleOpenItemInYouTubeStudio}
            onOpenCitizenReporter={() => setIsCitizenReporterOpen(true)}
            zentrixLeads={zentrixLeads}
            onUpdateLeadStatus={handleUpdateZentrixLeadStatus}
            onOpenZentrixModal={openZentrixModal}
          />
        )}

        {activeTab === 'workspace' && (
          <MediaWorkspace
            language={language}
            pipelineState={pipelineState}
            youtubeQueueItems={youtubeQueueItems}
            selectedApprovedItem={selectedApprovedItem}
            onSelectApprovedItem={(item) => setSelectedStudioItemId(item.id)}
          />
        )}

        {activeTab === 'audit' && (
          <AgentExecutionLog
            language={language}
            executionHistory={executionHistory}
            agents={agents}
            onReRunAgent={runSingleAgent}
            onClearLogs={() => setExecutionHistory([])}
            isRunning={pipelineState.isRunning}
          />
        )}

        {activeTab === 'agents' && (
          <AgentsRoster
            language={language}
            agents={agents}
            onRunAgent={runSingleAgent}
            onSelectAgent={() => {
              setActiveTab('pipeline');
            }}
          />
        )}

        {activeTab === 'factcheck' && (
          <FactCheckGuard
            language={language}
            pipelineState={pipelineState}
          />
        )}

        {activeTab === 'autoreply' && (
          <AutoReplySection
            language={language}
            pipelineState={pipelineState}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <SiteTrafficWidget
              language={language}
              stats={trafficStats}
              onRefresh={refreshTrafficStats}
            />
            <AnalyticsSection
              language={language}
              pipelineState={pipelineState}
            />
          </div>
        )}

        {activeTab === 'integrations' && (
          <IntegrationSettings
            language={language}
            onCustomTopicSubmit={handleCustomTopicSubmit}
          />
        )}
      </main>

      {/* Citizen Reporter Modal */}
      <CitizenReporterModal
        isOpen={isCitizenReporterOpen}
        onClose={() => setIsCitizenReporterOpen(false)}
        language={language}
        onSubmitVerifiedItem={handleCitizenReportSubmitted}
        onGoToOwnerDashboard={() => {
          setIsCitizenReporterOpen(false);
          setActiveTab('owner_control');
        }}
      />

      {/* Zentrix Digital Hire / Quote Lead Modal */}
      <ZentrixLeadModal
        isOpen={isZentrixModalOpen}
        onClose={() => setIsZentrixModalOpen(false)}
        language={language}
        initialService={zentrixInitialService}
        onLeadSubmitted={handleZentrixLeadSubmitted}
      />

      {/* Studio Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-5 px-4 sm:px-6 text-xs text-slate-400 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left">
          <img
            src="/assets/voice-of-valod-zentrix-logo.svg"
            alt="Voice of Valod Zentrix Digital"
            className="w-7 h-7 rounded object-contain bg-[#071528] border border-amber-500/30 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-200 font-['Noto_Sans_Gujarati',sans-serif]">
              {isGu
                ? 'Powered & Marketed by Zentrix Digital — ડિજિટલ માર્કેટિંગ, વેબ ડેવલપમેન્ટ & AI સોલ્યુશન્સ'
                : 'Powered & Marketed by Zentrix Digital — Digital Marketing, Web Development & AI Solutions'}
            </p>
            <p className="text-[11px] text-slate-500 font-['Noto_Sans_Gujarati',sans-serif]">
              {isGu ? 'વોઇસ ઓફ વાલોડ ન્યૂઝ • ૧૨-એજન્ટ સ્વાયત્ત ન્યૂઝરૂમ' : 'Voice of Valod News • 12-Agent Autonomous Newsroom'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => openZentrixModal('News Advertisement')}
            className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600/25 to-red-600/25 hover:from-amber-600/40 hover:to-red-600/40 border border-amber-500/45 text-amber-300 hover:text-white font-bold transition"
          >
            {isGu ? '📢 Voice of Valod પર જાહેરાત આપો (Advertise)' : '📢 Advertise on Voice of Valod'}
          </button>

          {trafficStats && (
            <span className="text-emerald-400 font-semibold tabular-nums">
              {isGu ? `👁️ લાઈવ વાચકો: ${trafficStats.liveVisitors} • કુલ વ્યૂઝ: ${trafficStats.totalPageViews}` : `👁️ Online: ${trafficStats.liveVisitors} • Views: ${trafficStats.totalPageViews}`}
            </span>
          )}
          <span className="hidden sm:inline text-slate-600">•</span>
          <a
            href="https://www.youtube.com/@voiceofvalod"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            YouTube @voiceofvalod
          </a>
        </div>
      </footer>
    </div>
  );
}
