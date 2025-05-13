type Recurrence = "none" | "daily" | "weekly";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  recurrence: Recurrence;
  recurrenceDays?: number[];
  category: "work" | "personal" | "meeting";
}

export enum CalendarView {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}
export type TEventsStore = {
  events: CalendarEvent[] | null;
  view: CalendarView;
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  updateEvent: (updatedEvent: CalendarEvent) => void;
  clearEvents: () => void;
};
