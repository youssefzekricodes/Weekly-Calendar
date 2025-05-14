import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";

import CreateEventModal from "./components/modals/create-new-event";
import CalendarHeader from "./components/calendar-header";
import CalendarTableView from "./views/calendar-table-view";

import { useEventsStore } from "./store";
import { CalendarView, Recurrence } from "./types";
import CalendarSwitch from "./components/calendar-switch";
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

  const [weekOffset, setWeekOffset] = useState<number>(() => {
    const savedOffset = localStorage.getItem("calendar-week-offset");
    return savedOffset ? Number(savedOffset) : 0;
  });

  useEffect(() => {
    localStorage.setItem("calendar-week-offset", weekOffset.toString());
  }, [weekOffset]);

  const currentWeekStart = dayjs().add(weekOffset, "week").startOf("isoWeek");

  const daysOfWeek =
    view === CalendarView.DAY
      ? [dayjs().add(weekOffset, "day")]
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
    const [eventStart, eventId] = draggableId.split("//");
    const [destDateStr, destHourStr] = destination.droppableId.split("__");
    const newStart = dayjs(destDateStr).hour(Number(destHourStr)).minute(0);
    const draggedEvent = events?.find((e) => e.id === eventId);
    if (!draggedEvent) return;
    const duration = dayjs(draggedEvent.end).diff(eventStart, "minute");
    const newEnd = newStart.add(duration, "minute");
    const isRecurring = [Recurrence.DAILY, Recurrence.WEEKLY].includes(
      draggedEvent?.recurrence!
    );

    if (isRecurring) {
      const startTime = dayjs(eventStart);

      excludeDateFromRecurrence(startTime, draggableId!);
      addEvent({
        ...draggedEvent,
        start: newStart,
        end: newEnd,
        id: crypto.randomUUID(),
        recurrence: Recurrence.NONE,
      });
    }
    updateEvent({
      ...draggedEvent,
      start: newStart,
      end: newEnd,
    });
  };

  const handelSwitchView = (newView: CalendarView) => {
    setView(newView);
  };

  return (
    <div className="calendar">
      <div className="calendar__settings">
        <CalendarHeader
          setWeekOffset={setWeekOffset}
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
