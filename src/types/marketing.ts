export interface MarketingCampaign {
  id: string;
  name: string;
  eventId: string;
  eventName: string;
  channel: 'META_ADS' | 'GOOGLE_ADS' | 'TIKTOK_ADS' | 'SPOTIFY_ADS' | 'INFLUENCER';
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

export interface AbandonedCart {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventId: string;
  eventName: string;
  sectorName: string;
  ticketsCount: number;
  cartValue: number;
  abandonedAt: string;
  recoveryStatus: 'PENDING' | 'RECOVERY_SENT' | 'RECOVERED' | 'EXPIRED';
  channelSent?: 'WHATSAPP' | 'EMAIL';
}
