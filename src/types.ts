export type Language = 'gu' | 'en';

export interface TrendTopic {
  id: string;
  titleGujarati: string;
  titleEnglish: string;
  category: string;
  viralScore: number;
  sourcePlatform: string;
  summary: string;
  sampleKeywords: string[];
  aiVerified?: boolean;
  location?: string;
}

export type NewsWorkflowStatus = 'pending_approval' | 'approved' | 'rejected';

export interface NewsFeedItem {
  id: string;
  titleGujarati: string;
  titleEnglish: string;
  summaryGujarati: string;
  summaryEnglish?: string;
  category: string;
  location: string;
  sourceType: 'pipeline' | 'citizen_reporter';
  reporterName?: string;
  photoDataUrl?: string;
  aiConfidenceScore: number;
  aiVerified: boolean;
  factCheckVerdictGu: string;
  factCheckVerdictEn: string;
  status: NewsWorkflowStatus;
  inYouTubeQueue: boolean;
  createdAt: string;
  approvedAt?: string;
  scriptGujarati?: string;
  hashtags?: string[];
}

export interface ValodCropPrice {
  id: string;
  nameGu: string;
  nameEn: string;
  varietyGu: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unitGu: string;
  unitEn: string;
  trend: 'up' | 'down' | 'stable';
}

export interface WeatherForecastDay {
  dateIso: string;
  dayLabelGu: string;
  dayLabelEn: string;
  minC: number;
  maxC: number;
  rainChance: number;
  conditionGu: string;
  conditionEn: string;
}

export interface ValodLocalInfo {
  stationId?: string;
  locationGu: string;
  locationEn: string;
  lat?: number;
  lng?: number;
  updatedAt: string;
  observationTime?: string;
  weatherSource?: 'google_weather' | 'open_meteo' | 'fallback';
  weatherSourceLabel?: string;
  weather: {
    tempC: number;
    feelsLikeC: number;
    minTempC?: number;
    maxTempC?: number;
    conditionGu: string;
    conditionEn: string;
    humidity: number;
    windKmh: number;
    windDirection?: string;
    rainChance: number;
    uvIndex?: number;
    cloudCover?: number;
    visibilityKm?: number;
    iconUrl?: string;
    isDaytime?: boolean;
  };
  forecastDays?: WeatherForecastDay[];
  mandiNameGu: string;
  mandiNameEn: string;
  crops: ValodCropPrice[];
}

export type AgentStatus = 'idle' | 'running' | 'completed' | 'awaiting_approval' | 'error';

export interface AgentInfo {
  id: string;
  number: number;
  nameGu: string;
  nameEn: string;
  roleGu: string;
  roleEn: string;
  icon: string;
  isSuperhitExtra?: boolean;
  toolsUsed: string[];
  status: AgentStatus;
  output?: any;
}

export interface AgentExecutionRecord {
  id: string;
  agentId: string;
  agentNumber: number;
  agentNameGu: string;
  agentNameEn: string;
  topicTitle: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  status: 'success' | 'failed' | 'warning' | 'running';
  summaryGu: string;
  summaryEn: string;
  outputPreview?: any;
  error?: string;
}

export interface PipelineState {
  currentStepIndex: number;
  isRunning: boolean;
  awaitingApproval: boolean;
  selectedTopic: TrendTopic;
  agentOutputs: Record<string, any>;
  logs: { timestamp: string; message: string; level: 'info' | 'success' | 'warn' | 'error' }[];
  executionHistory?: AgentExecutionRecord[];
  whatsappAlertUrl?: string;
  whatsappPhone?: string;
}

export interface SiteTrafficStats {
  liveVisitors: number;
  todayVisits: number;
  totalPageViews: number;
  whatsappShares: number;
  videoExports: number;
  mobilePct: number;
  desktopPct: number;
  recentHours: { label: string; hits: number }[];
  pageViewsByTab: Record<string, number>;
  updatedAt: string;
}

export type ZentrixLeadService =
  | 'Website'
  | 'Social Media Ads'
  | 'AI Tool'
  | 'News Advertisement';

export interface ZentrixLead {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  service: ZentrixLeadService;
  location?: string;
  status: 'new' | 'contacted' | 'converted';
  createdAt: string;
}


