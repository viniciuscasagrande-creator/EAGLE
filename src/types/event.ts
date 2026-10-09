export type EventStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';

export interface TicketBatch {
  id: string;
  name: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  availableQuantity: number;
  status: 'ACTIVE' | 'SOLD_OUT' | 'PENDING';
}

export interface TicketSector {
  id: string;
  name: string;
  totalCapacity: number;
  soldCount: number;
  availableCount: number;
  color: string;
  batches: TicketBatch[];
}

export interface PaymentBreakdown {
  method: 'PIX' | 'CREDIT_CARD' | 'CREDIT_INSTALLMENTS' | 'BOLETO';
  label: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface SalesTimelinePoint {
  date: string;
  label: string;
  dailyAmount: number;
  accumulatedAmount: number;
  ticketsSold: number;
}

export interface EventOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'APPROVED' | 'PENDING' | 'REFUNDED' | 'CANCELLED';
  createdAt: string;
  sectorName: string;
}

export interface EventItem {
  id: string;
  name: string;
  code: string;
  venue: string;
  city: string;
  state: string;
  dateStart: string;
  dateEnd?: string;
  time: string;
  imageUrl: string;
  status: EventStatus;
  producerId: string;
  producerName: string;

  // KPIs matching UAE Event Ticketing Software card style
  grossSales: number;
  ticketsSold: number;
  totalCapacity: number;
  ticketsAvailable: number;
  courtesiesCount: number;
  occupationRate: number; // percentage, e.g. 74.5%

  // Analytical details matching Behance Ticket Dashboard style
  averageTicket: number;
  breakEvenTarget: number;
  breakEvenAchievedRate: number; // e.g. 88%
  salesGoalAmount: number;
  salesGoalAchievedRate: number; // e.g. 75%
  projectedGrossSales: number;
  salesVelocityPerHour: number; // tickets/hour

  // Breakdown
  paymentMethods: PaymentBreakdown[];
  sectors: TicketSector[];
  timeline: SalesTimelinePoint[];
  recentOrders: EventOrder[];
}
