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
    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end);

    const isInWeek =
      day.isSameOrAfter(eventStart.startOf("day")) &&
      day.isBefore(eventEnd.add(1, "day").startOf("day"));

    const matchesOneTime =
      event.recurrence === "none" &&
      eventStart.isSame(day, "day") &&
      hour >= eventStart.hour() &&
      hour < eventEnd.hour();

    const matchesDaily =
      event.recurrence === "daily" &&
      day.isSameOrAfter(dayjs(event.start).startOf("week")) &&
      day.isSameOrBefore(dayjs(event.start).startOf("week").add(6, "day")) &&
      day.isSameOrAfter(dayjs(event.start), "day") &&
      hour >= dayjs(event.start).hour() &&
      hour < dayjs(event.end).hour();

    const matchesWeekly =
      event.recurrence === "weekly" &&
      isInWeek &&
      event.recurrenceDays?.some((d) => {
        const recDayIndex =
          recurrenceDayToIndex[d.toUpperCase() as RecurrenceDays];
        return (
          recDayIndex === day.day() &&
          hour >= eventStart.hour() &&
          hour < eventEnd.hour()
        );
      });

    return matchesOneTime || matchesDaily || matchesWeekly;
  });
};
