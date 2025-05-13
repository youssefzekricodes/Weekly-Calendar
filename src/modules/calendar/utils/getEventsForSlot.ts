import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type { RecurrenceDays, CalendarEvent } from "../types";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const recurrenceDayToIndex: Record<RecurrenceDays, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const getEventsForSlot = (
  day: dayjs.Dayjs,
  hour: number,
  events: CalendarEvent[] | null
): CalendarEvent[] | undefined => {
  return events?.filter((event) => {
    if (event.excludedDates?.some((date) => date.isSame(day, "day"))) {
      return false;
    }
    const eventStart = dayjs(event.start);

    const matchesOneTime =
      event.recurrence === "none" &&
      eventStart.isSame(day, "day") &&
      hour === eventStart.hour();
    const matchesDaily =
      event.recurrence === "daily" &&
      day.isSameOrAfter(eventStart, "day") &&
      hour === eventStart.hour();

    const matchesWeekly =
      event.recurrence === "weekly" &&
      day.isSameOrAfter(eventStart, "day") &&
      event.recurrenceDays?.some((d) => {
        const recDayIndex = recurrenceDayToIndex[d as RecurrenceDays];
        return recDayIndex === day.day() && hour === eventStart.hour();
      });

    return matchesOneTime || matchesDaily || matchesWeekly;
  });
};
