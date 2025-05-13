import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";
import clsx from "clsx";

import CreateEventModal from "./components/modals/create-new-event";
import { useEventsStore } from "./store";
import { getEventsForSlot } from "./utils/getEventsForSlot";
import { times } from "./constants";
import { Recurrence } from "./types";

dayjs.extend(isoWeek);

const WeeklyCalendar = () => {
  const { events } = useEventsStore();
  console.log({ events });
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const currentWeekStart = dayjs().add(weekOffset, "week").startOf("isoWeek");
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  const weekRangeLabel = `${daysOfWeek[0].format(
    "MMM D"
  )} - ${daysOfWeek[6].format("MMM D, YYYY")}`;

  const onCloseModal = () => {
    setModalOpen(false);
  };
  const onOpenModal = () => {
    setModalOpen(true);
  };

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
        <button onClick={onOpenModal}>add event +</button>
        <CreateEventModal visible={modalOpen} onClose={onCloseModal} />
      </div>

      <table className="calendar__table">
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
          {times.map((time, rowIndex) => {
            const hour = parseInt(time, 10);
            return (
              <tr key={rowIndex}>
                <td className="calendar__cell">{time}</td>
                {daysOfWeek.map((day, colIndex) => {
                  const slotEvents = getEventsForSlot(day, hour, events);
                  return (
                    <td key={colIndex} className={clsx("calendar__cell")}>
                      {slotEvents?.map((event) => (
                        <p
                          key={event.id}
                          className={clsx(
                            {
                              calendar__event: !!slotEvents?.length,
                            },
                            `calendar__event--${slotEvents?.[0]?.category}`
                          )}
                        >
                          {event.title}
                          {[Recurrence.DAILY, Recurrence.WEEKLY].includes(
                            event.recurrence
                          ) && "↻"}
                        </p>
                      ))}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyCalendar;
