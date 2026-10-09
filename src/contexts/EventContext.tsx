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

  const refreshEvents = useCallback(async () => {
    try {
      const list = await keeperAdapter.getEvents();
      setAllEvents(list);
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
  };

  const selectEventById = (id: string) => {
    const found = allEvents.find((e) => e.id === id);
    if (found) {
      setSelectedEvent(found);
    }
  };

  const clearSelectedEvent = () => {
    setSelectedEvent(null);
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
