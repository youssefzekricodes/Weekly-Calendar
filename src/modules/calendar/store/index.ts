import { create } from "zustand";
import { CalendarView, type CalendarEvent, type TEventsStore } from "../types";

export const useEventsStore = create<TEventsStore>((set) => ({
  events: null,
  view: CalendarView.WEEK,
  setEvents: (events: CalendarEvent[]) => set({ events }),
  addEvent: (event: CalendarEvent) =>
    set((state) => ({
      events: state.events ? [...state.events, event] : [event],
    })),
  removeEvent: (id: string) =>
    set((state) => ({
      events: state.events
        ? state.events.filter((event) => event.id !== id)
        : null,
    })),
  updateEvent: (updatedEvent: CalendarEvent) =>
    set((state) => ({
      events: state.events
        ? state.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        : null,
    })),
  clearEvents: () => set({ events: null }),
}));
