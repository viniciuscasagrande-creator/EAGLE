export type NotificationCategory = 'URGENTE' | 'VENDAS' | 'FINANCEIRO' | 'COMERCIAL' | 'PORTARIA';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}
