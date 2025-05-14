import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type { CalendarEvent, RecurrenceDays } from "../types";

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
): CalendarEvent[] => {
  if (!events) return [];

  return events.filter((event) => {
    const eventStart = dayjs(event.start);
    const eventHour = eventStart.hour();

    if (
      event.excludedDates?.some((excluded) =>
        dayjs(excluded).isSame(day, "day")
      )
    ) {
      return false;
    }

    if (
      event.recurrence === "none" &&
      day.isSame(eventStart, "day") &&
      hour === eventHour
    ) {
      return true;
    }

    if (
      event.recurrence === "daily" &&
      day.isSameOrAfter(eventStart, "day") &&
      hour === eventHour
    ) {
      return true;
    }
    if (
      event.recurrence === "weekly" &&
      day.isSameOrAfter(eventStart, "day") &&
      event.recurrenceDays?.some(
        (recDay) =>
          recurrenceDayToIndex[recDay] === day.day() && hour === eventHour
      )
    ) {
      return true;
    }

    return false;
  });
};
