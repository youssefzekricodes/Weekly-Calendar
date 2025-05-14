import dayjs from "dayjs";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { times } from "../../constants";
import { useEventsStore } from "../../store";
import { getEventsForSlot } from "../../utils/getEventsForSlot";
import EventCard from "../event";
import clsx from "clsx";

interface ICalendarGridProps {
  daysOfWeek: dayjs.Dayjs[];
}
const CalendarGrid = ({ daysOfWeek }: ICalendarGridProps) => {
  const { events, setSelectedCell } = useEventsStore();
  const currentHour = dayjs().hour();
  return (
    <tbody>
      {times.map((time, rowIndex) => {
        const hour = parseInt(time, 10);
        return (
          <tr
            key={rowIndex}
            className={clsx("calendar__row", {
              "calendar__active-row": currentHour === hour,
            })}
          >
            <td className="calendar__cell calendar__key-cell">{time}</td>
            {daysOfWeek.map((day) => {
              const startTime = dayjs(day).hour(hour).startOf("hour");
              const slotEvents = getEventsForSlot(day, hour, events);
              const droppableId = `${day.format("YYYY-MM-DD")}__${hour}`;

              const date = startTime.toISOString();
              return (
                <Droppable droppableId={droppableId} key={droppableId}>
                  {(provided) => (
                    <td
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="calendar__cell"
                      onClick={() => {
                        if (!slotEvents?.length) {
                          setSelectedCell({ start: startTime });
                        }
                      }}
                    >
                      <div className="calendar__cell--slot">
                        {slotEvents
                          ?.filter(
                            (event) => dayjs(event.start).hour() === hour
                          )
                          .map((event, index, arr) => {
                            const durationInHours = dayjs(event.end).diff(
                              dayjs(event.start),
                              "hour"
                            );

                            const overlapCount = arr.length;
                            const widthPercent = 100 / overlapCount;
                            const leftOffset = widthPercent * index;

                            const eventKey = `${date}//${durationInHours}//${event.id}`;
                            return (
                              <Draggable
                                key={eventKey}
                                draggableId={eventKey}
                                index={index}
                              >
                                {(dragProps) => (
                                  <EventCard
                                    ref={dragProps.innerRef}
                                    event={event}
                                    duration={durationInHours}
                                    draggableProps={dragProps.draggableProps}
                                    dragHandleProps={dragProps.dragHandleProps}
                                    isNotEmpty={!!slotEvents?.length}
                                    day={day}
                                    styles={{
                                      left: `${leftOffset}%`,
                                      width: `${widthPercent}%`,
                                      height: `${durationInHours * 10}rem`,
                                    }}
                                  />
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    </td>
                  )}
                </Droppable>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default CalendarGrid;
