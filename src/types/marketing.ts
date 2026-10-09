export type { AbandonedCart } from './remarketing';

export interface MarketingCampaign {
  id: string;
  name: string;
  eventId: string;
  eventName: string;
  channel: 'META_ADS' | 'GOOGLE_ADS' | 'TIKTOK_ADS' | 'SPOTIFY_ADS' | 'INFLUENCER' | 'WHATSAPP' | 'EMAIL';
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  budgetSpent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  attributedRevenue: number;
  roas: number;
  startDate: string;
  endDate?: string;
}

// 8 Modelos de Campanhas Prontas do Vídeo
export interface ReadyCampaignTemplate {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  channels: ('WHATSAPP' | 'INSTAGRAM' | 'GOOGLE_ADS' | 'TIKTOK' | 'EMAIL' | 'AFILIADOS')[];
  targetAudience: string;
  suggestedBudgetMin: number;
  suggestedBudgetMax: number;
  expectedDurationDays: number;
  category: 'CONVERSAO' | 'REENGAGEMENT' | 'RETENCAO' | 'LANCAMENTO';
}

export interface ReadyCampaignInstance {
  id: string;
  templateId: string;
  title: string;
  eventId: string;
  eventName: string;
  channels: string[];
  status: 'CONFIGURED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  budget: number;
  spent: number;
  conversions: number;
  revenue: number;
  startDate: string;
  endDate: string;
}

// Status Real das Campanhas nas Plataformas de Anúncio
export interface AdRealStatusItem {
  id: string;
  platform: 'META_ADS' | 'GOOGLE_ADS' | 'TIKTOK_ADS' | 'SPOTIFY_ADS';
  campaignName: string;
  adSetCount: number;
  adCount: number;
  deliveryStatus: 'DELIVERING' | 'ACTIVE_NO_DELIVERY' | 'IN_REVIEW' | 'REJECTED' | 'PAUSED';
  issueDetail?: string;
  dailyBudget: number;
  lastSyncAt: string;
  healthScore: number;
}

// Telemetria Google Analytics 4
export interface Ga4EventLog {
  id: string;
  eventName: string;
  timestamp: string;
  userPseudoId: string;
  pageLocation: string;
  deviceCategory: 'mobile' | 'desktop' | 'tablet';
  sourceMedium: string;
  value?: number;
}

// Logs de Transmissão TikTok Ads Events API
export interface TikTokTransmissionLog {
  id: string;
  timestamp: string;
  eventName: string;
  status: 'HTTP_200' | 'HTTP_400' | 'HTTP_500' | 'QUEUED';
  latencyMs: number;
  pixelId: string;
  payloadHash: string;
}

// Central de Links UTM & Atribuição
export interface UtmLinkItem {
  id: string;
  eventId: string;
  eventName: string;
  title: string;
  url: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  clicks: number;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  createdAt: string;
}

// Modelos WhatsApp Marketing
export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  bodyText: string;
  variables: string[];
}

// Modelos E-mail Marketing
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  category: 'LANCAMENTO' | 'VIRADA_LOTE' | 'RECUPERACAO' | 'URGENCIA';
  thumbnailUrl?: string;
}

// Fluxo de Automação & Jornadas
export interface AutomationJourney {
  id: string;
  name: string;
  triggerType: 'ABANDONED_CART' | 'EVENT_TMINUS_7D' | 'EVENT_TMINUS_24H' | 'LOT_CHANGE' | 'POST_PURCHASE';
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'MULTICHANNEL';
  delayMinutes: number;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  executionsCount: number;
  conversionRate: number;
  recoveredRevenue: number;
}
