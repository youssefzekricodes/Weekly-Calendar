import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";

import CalendarHeader from "./components/calendar-header";
import CreateEventModal from "./components/modals/create-new-event";
import CalendarTableView from "./views/calendar-table-view";

import CalendarSwitch from "./components/calendar-switch";
import { useEventsStore } from "./store";
import { CalendarView, Recurrence } from "./types";
dayjs.extend(isoWeek);

const WeeklyCalendar = () => {
  const {
    events,
    updateEvent,
    setSelectedCell,
    selectedCell,
    view,
    setView,
    excludeDateFromRecurrence,
    addEvent,
  } = useEventsStore();

  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [dayOffset, setDayOffset] = useState<number>(0);

  const currentWeekStart = dayjs().add(weekOffset, "week").startOf("isoWeek");

  const daysOfWeek =
    view === CalendarView.DAY
      ? [currentWeekStart.add(dayOffset, "day")]
      : Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, "day"));

  const weekRangeLabel =
    view === CalendarView.DAY
      ? daysOfWeek[0].format("dddd, MMM D, YYYY")
      : `${daysOfWeek[0].format("MMM D")} - ${daysOfWeek[6].format(
          "MMM D, YYYY"
        )}`;

  const onCloseModal = () => setSelectedCell(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;
    const [eventDate, duration, eventId] = draggableId.split("//");
    const [destDateStr, destHourStr] = destination.droppableId.split("__");
    const newStart = dayjs(destDateStr).hour(Number(destHourStr)).minute(0);
    const draggedEvent = events?.find((e) => e.id === eventId);
    if (!draggedEvent) return;
    const newEnd = newStart.add(Number(duration), "hour");

    const isRecurring = [Recurrence.DAILY, Recurrence.WEEKLY].includes(
      draggedEvent?.recurrence!
    );

    if (isRecurring) {
      const date = dayjs(eventDate);
      excludeDateFromRecurrence(date, eventId!);
      addEvent({
        ...draggedEvent,
        start: newStart,
        end: newEnd,
        id: crypto.randomUUID(),
        recurrence: Recurrence.NONE,
        recurrenceDays: undefined,
        excludedDates: undefined,
      });
    } else {
      updateEvent({
        ...draggedEvent,
        start: newStart,
        end: newEnd,
      });
    }
  };

  const handelSwitchView = (newView: CalendarView) => {
    setView(newView);
  };

  const handleOffsetChange = (direction: "prev" | "next") => {
    if (view === CalendarView.DAY) {
      setDayOffset((prev) => prev + (direction === "next" ? 1 : -1));
    } else {
      setWeekOffset((prev) => prev + (direction === "next" ? 1 : -1));
    }
  };

  return (
    <div className="calendar">
      <div className="calendar__settings">
        <CalendarHeader
          setWeekOffset={handleOffsetChange}
          weekRangeLabel={weekRangeLabel}
          view={view}
        />
        <CalendarSwitch handelSwitchView={handelSwitchView} view={view} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <CalendarTableView daysOfWeek={daysOfWeek} />
      </DragDropContext>

      <CreateEventModal
        visible={!!selectedCell}
        onClose={onCloseModal}
        selectedCell={selectedCell}
      />
    </div>
  );
};

export default WeeklyCalendar;
