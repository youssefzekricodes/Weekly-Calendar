import clsx from "clsx";
import dayjs from "dayjs";

import { forwardRef, use, useState } from "react";
import type { DraggableProvided } from "react-beautiful-dnd";
import { Recurrence, type CalendarEvent } from "../../types";
import { Popover } from "antd";
import { useEventsStore } from "../../store";
import ConfirmDelete from "../modals/confirm-delete-event";

interface IEventCardProps {
  event: CalendarEvent;
  isNotEmpty: boolean;
  draggableProps: DraggableProvided["draggableProps"];
  dragHandleProps: DraggableProvided["dragHandleProps"];
  duration: number;
  styles: any;
  day: dayjs.Dayjs;
}

const EventCard = forwardRef<any, IEventCardProps>(
  ({ event, draggableProps, dragHandleProps, duration, styles, day }, ref) => {
    return (
      <div
        ref={ref}
        {...draggableProps}
        {...dragHandleProps}
        className="calendar__event--drag-handle"
      >
        <Popover
          content={EventCardPopOver({ event, duration, day })}
          trigger="hover"
        >
          <div
            className={clsx(
              "calendar__event",
              `calendar__event--${event.category}`
            )}
            style={{ height: `${duration * 100}% `, ...styles }}
            onClick={(e) => e.stopPropagation()}
          >
            {event.title}{" "}
            {[Recurrence.DAILY, Recurrence.WEEKLY].includes(event.recurrence) &&
              "↻"}
          </div>
        </Popover>
      </div>
    );
  }
);

export default EventCard;

const EventCardPopOver = ({
  event,
  duration,
  day,
}: {
  event: CalendarEvent;
  duration: number;
  day: dayjs.Dayjs;
}) => {
  const [open, setOpen] = useState(false);

  const { setSelectedCell } = useEventsStore();
  const renderedStart = dayjs(day)
    .hour(dayjs(event.start).hour())
    .minute(0)
    .second(0);
  const renderedEnd = renderedStart.add(duration, "hour");

  const handelCancel = () => {
    setOpen(false);
  };
  const handelOpen = () => {
    setOpen(true);
  };
  return (
    <div className="event-pop-over">
      <div className="event-pop-over__title">
        {event.title}
        <div
          className={`event-pop-over__tag calendar__event--${event.category}`}
        >
          {event.category}
        </div>
      </div>
      <div className="event-pop-over__details">
        <div>
          {dayjs(event.start).format("MMM D, YYYY h:mm A")} -{" "}
          {dayjs(event.end).format("h:mm A")}
        </div>
      </div>
      <button
        onClick={() =>
          setSelectedCell({
            ...event,
            start: dayjs(renderedStart.toDate()),
            end: dayjs(renderedEnd.toDate()),
          })
        }
      >
        Edit
      </button>
      <button onClick={handelOpen}>Delete</button>
      <ConfirmDelete
        open={open}
        onCancel={handelCancel}
        id={event.id}
        date={renderedStart}
        isRecurring={!!event.recurrence?.length}
      />
    </div>
  );
};
