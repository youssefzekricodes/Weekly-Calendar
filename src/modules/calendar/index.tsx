import { useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { useEventsStore } from "./store";

dayjs.extend(isoWeek);

const WeeklyCalendar = () => {
  const { events } = useEventsStore();
  console.log({ events });
  const [weekOffset, setWeekOffset] = useState(0);

  const currentWeekStart = dayjs().add(weekOffset, "week").startOf("isoWeek");
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  const weekRangeLabel = `${daysOfWeek[0].format(
    "MMM D"
  )} - ${daysOfWeek[6].format("MMM D, YYYY")}`;

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button onClick={() => setWeekOffset((prev) => prev - 1)} className="">
          ← Previous Week
        </button>
        <div>{weekRangeLabel}</div>
        <button onClick={() => setWeekOffset((prev) => prev + 1)} className=" ">
          Next Week →
        </button>
      </div>

      <table className="calendar__table  ">
        <thead>
          <tr className="calendar__table__header">
            <th className="calendar__table__header__row ">days / hours</th>
            {daysOfWeek.map((day, index) => (
              <th key={index} className="calendar__table__header__row ">
                {day.format("dddd D")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="calendar__table__body">
          {times.map((time, index) => (
            <tr key={index}>
              <td className="calendar__cell">{time}:00</td>
              {daysOfWeek.map((_, dayIndex) => (
                <td key={dayIndex} className="calendar__cell"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyCalendar;

const times = [
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "00",
];
