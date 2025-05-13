import type dayjs from "dayjs";
import { create } from "zustand";
import { CalendarView, type CalendarEvent, type TEventsStore } from "../types";

export const useEventsStore = create<TEventsStore>((set) => ({
  events: null,
  selectedCell: null,
  setSelectedCell: (selectedCell: Partial<CalendarEvent> | null) =>
    set({ selectedCell }),
  view: CalendarView.WEEK,
  setEvents: (events: CalendarEvent[]) => set({ events }),
  setView: (view: CalendarView) => set({ view }),
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
  excludeDateFromRecurrence: (day: dayjs.Dayjs, id: string) =>
    set((state) => ({
      events: state.events
        ? state.events.map((event) =>
            event.id === id
              ? {
                  ...event,
                  excludedDates: [...(event.excludedDates || []), day],
                }
              : event
          )
        : null,
    })),
  clearEvents: () => set({ events: null }),
}));
