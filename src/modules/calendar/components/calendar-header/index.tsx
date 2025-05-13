import React, { type Dispatch, type SetStateAction } from "react";
import { CalendarView } from "../../types";
interface CalendarHeaderProps {
  setWeekOffset: Dispatch<SetStateAction<number>>;
  weekRangeLabel: string;
  view: CalendarView;
}

const CalendarHeader = ({
  setWeekOffset,
  weekRangeLabel,
  view,
}: CalendarHeaderProps) => {
  return (
    <div className="calendar__header">
      <button onClick={() => setWeekOffset((prev) => prev - 1)}>
        ← Previous {view === CalendarView.DAY ? "Day" : "Week"}
      </button>
      <div>{weekRangeLabel}</div>
      <button onClick={() => setWeekOffset((prev) => prev + 1)}>
        Next {view === CalendarView.DAY ? "Day" : "Week"} →
      </button>
    </div>
  );
};

export default CalendarHeader;
