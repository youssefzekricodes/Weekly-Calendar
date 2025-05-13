import type dayjs from "dayjs";

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
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  recurrence: Recurrence;
  recurrenceDays?: RecurrenceDays[];
  category: EventCategories;
  excludedDates?: dayjs.Dayjs[];
}

export enum CalendarView {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}
export type TEventsStore = {
  events: CalendarEvent[] | null;
  view: CalendarView;
  selectedCell: Partial<CalendarEvent> | null;
  setView: (view: CalendarView) => void;
  setSelectedCell: (selectedCell: Partial<CalendarEvent> | null) => void;
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  excludeDateFromRecurrence: (day: dayjs.Dayjs, id: string) => void;
  removeEvent: (id: string) => void;
  updateEvent: (updatedEvent: CalendarEvent) => void;
  clearEvents: () => void;
};
