import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EventItem } from '@/types/event';
import { keeperAdapter } from '@/services/api/keeperAdapter';

interface EventContextType {
  selectedEvent: EventItem | null;
  selectEvent: (event: EventItem | null) => void;
  selectEventById: (id: string) => void;
  clearSelectedEvent: () => void;
  allEvents: EventItem[];
  createEvent: (payload: Partial<EventItem>) => Promise<EventItem>;
  addTicketTier: (
    eventId: string,
    tier: {
      sectorId: string;
      batchName: string;
      price: number;
      totalQuantity: number;
    }
  ) => Promise<EventItem | null>;
  issueCourtesy: (
    eventId: string,
    courtesy: {
      guestName: string;
      email: string;
      sector: string;
      qty: number;
      authBy: string;
    }
  ) => Promise<any>;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const getEventIdFromUrl = (): string | null => {
    if (typeof window === 'undefined') return null;
    const match = window.location.pathname.match(/\/eventos\/([^/]+)/);
    if (match && match[1] && match[1] !== 'novo' && match[1] !== 'comparar' && match[1] !== 'telao' && match[1] !== 'portaria') {
      return match[1];
    }
    return null;
  };

  const refreshEvents = useCallback(async () => {
    try {
      const list = await keeperAdapter.getEvents();
      setAllEvents(list);

      const targetId = getEventIdFromUrl() || localStorage.getItem('eagle_selected_event_id');
      if (targetId) {
        const found = list.find((e) => e.id === targetId);
        if (found) {
          setSelectedEvent(found);
          localStorage.setItem('eagle_selected_event_id', found.id);
          return;
        }
      }

      if (selectedEvent) {
        const found = list.find((e) => e.id === selectedEvent.id);
        if (found) setSelectedEvent(found);
      }
    } catch {
      // ignore
    }
  }, [selectedEvent]);

  useEffect(() => {
    refreshEvents();
  }, []);

  const selectEvent = (event: EventItem | null) => {
    setSelectedEvent(event);
    if (event) {
      localStorage.setItem('eagle_selected_event_id', event.id);
    } else {
      localStorage.removeItem('eagle_selected_event_id');
    }
  };

  const selectEventById = (id: string) => {
    if (!id) return;
    const found = allEvents.find((e) => e.id === id);
    if (found) {
      setSelectedEvent(found);
      localStorage.setItem('eagle_selected_event_id', found.id);
    } else {
      keeperAdapter.getEventById(id).then((evt) => {
        if (evt) {
          setSelectedEvent(evt);
          localStorage.setItem('eagle_selected_event_id', evt.id);
        }
      }).catch(() => {});
    }
  };

  const clearSelectedEvent = () => {
    setSelectedEvent(null);
    localStorage.removeItem('eagle_selected_event_id');
  };

  const createEvent = async (payload: Partial<EventItem>): Promise<EventItem> => {
    const newEvent = await keeperAdapter.createEvent(payload);
    await refreshEvents();
    setSelectedEvent(newEvent);
    return newEvent;
  };

  const addTicketTier = async (
    eventId: string,
    tier: {
      sectorId: string;
      batchName: string;
      price: number;
      totalQuantity: number;
    }
  ): Promise<EventItem | null> => {
    const updated = await keeperAdapter.addTicketTier(eventId, tier);
    await refreshEvents();
    if (selectedEvent && selectedEvent.id === eventId && updated) {
      setSelectedEvent(updated);
    }
    return updated;
  };

  const issueCourtesy = async (
    eventId: string,
    courtesy: {
      guestName: string;
      email: string;
      sector: string;
      qty: number;
      authBy: string;
    }
  ): Promise<any> => {
    const res = await keeperAdapter.issueCourtesy(eventId, courtesy);
    await refreshEvents();
    return res;
  };

  return (
    <EventContext.Provider
      value={{
        selectedEvent,
        selectEvent,
        selectEventById,
        clearSelectedEvent,
        allEvents,
        createEvent,
        addTicketTier,
        issueCourtesy,
        refreshEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext deve ser usado dentro de EventProvider');
  }
  return context;
};
