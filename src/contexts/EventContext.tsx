import React, { createContext, useContext, useState } from 'react';
import { EventItem } from '@/types/event';
import { mockEvents } from '@/services/api/mockSeedData';

interface EventContextType {
  selectedEvent: EventItem | null;
  selectEvent: (event: EventItem | null) => void;
  selectEventById: (id: string) => void;
  clearSelectedEvent: () => void;
  allEvents: EventItem[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const selectEvent = (event: EventItem | null) => {
    setSelectedEvent(event);
  };

  const selectEventById = (id: string) => {
    const found = mockEvents.find((e) => e.id === id);
    if (found) {
      setSelectedEvent(found);
    }
  };

  const clearSelectedEvent = () => {
    setSelectedEvent(null);
  };

  return (
    <EventContext.Provider
      value={{
        selectedEvent,
        selectEvent,
        selectEventById,
        clearSelectedEvent,
        allEvents: mockEvents,
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
