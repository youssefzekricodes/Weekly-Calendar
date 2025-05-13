export enum Recurrence {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
}
export enum EventCategories {
  WORK = "work",
  PERSONAL = "personal",
  MEETING = "meeting",
}
export enum RecurrenceDays {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  recurrence: Recurrence;
  recurrenceDays?: RecurrenceDays[];
  category: EventCategories;
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
