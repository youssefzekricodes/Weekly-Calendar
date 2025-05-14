import clsx from "clsx";
import dayjs from "dayjs";

import { forwardRef, use, useState } from "react";
import type { DraggableProvided } from "react-beautiful-dnd";
import { Recurrence, type CalendarEvent } from "../../types";
import { Popover } from "antd";
import { useEventsStore } from "../../store";
import ConfirmDelete from "../modals/confirm-delete-event";
import RefreshIcon from "../../../../assets/icons/ic-refresh";
import EditIcon from "../../../../assets/icons/ic-edit";
import DeleteIcon from "../../../../assets/icons/ic-delete";

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
          trigger="click"
          placement="rightTop"
        >
          <div
            className={clsx(
              "calendar__event",
              `calendar__event--${event.category}`
            )}
            style={styles}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="calendar__event__header">
              <div className="calendar__event__title">{event.category}</div>
              <div className="calendar__event__time">
                {dayjs(event.start).format("h A")} -
                {dayjs(event.end).format("h A")}
              </div>
              {[Recurrence.DAILY, Recurrence.WEEKLY].includes(
                event.recurrence
              ) && <RefreshIcon className="calendar__event__recurrence" />}
            </div>
            <div className="calendar__event__name">{event.title}</div>
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
  const isRecurrence = [Recurrence.DAILY, Recurrence.WEEKLY].includes(
    event.recurrence
  );
  return (
    <div className="event-pop-over">
      <button
        onClick={() =>
          setSelectedCell({
            ...event,
            start: dayjs(renderedStart.toDate()),
            end: dayjs(renderedEnd.toDate()),
          })
        }
        className="event-pop-over__button"
      >
        <EditIcon /> Edit
      </button>
      <button
        onClick={handelOpen}
        className="event-pop-over__button event-pop-over__button--delete"
      >
        <DeleteIcon /> Delete
      </button>
      <ConfirmDelete
        open={open}
        onCancel={handelCancel}
        id={event.id}
        date={renderedStart}
        isRecurrence={isRecurrence}
      />
    </div>
  );
};
