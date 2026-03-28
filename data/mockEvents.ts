import dayjs from 'dayjs';

/**
 * Categorias de eventos mapeadas para cores no tema.
 */
export type EventCategory = 'meeting' | 'show' | 'vip' | 'rehearsal' | 'external' | 'staff' | 'maintenance' | string;

/**
 * Interface unificada para eventos da agenda, 
 * compatível com o mapeamento feito no BubbleService.
 */
export interface AgendaEvent {
  id: string;
  title: string;
  description?: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  category: EventCategory;
  location?: string;
  attendees?: string[];
  // Campos extras do Bubble
  cidade?: string;
  estado?: string;
  contratante?: string;
}

/**
 * Array vazio por padrão. Os dados reais 
 * agora vêm do BubbleService através da App.tsx.
 */
export const mockEvents: AgendaEvent[] = [];
