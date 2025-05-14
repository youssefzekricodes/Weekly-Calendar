import type dayjs from "dayjs";

import CalendarGrid from "../components/calendar-grid";
import CalendarIcon from "../../../assets/icons/ic-calendar";

interface DayViewProps {
  daysOfWeek: dayjs.Dayjs[];
}
const CalendarTableView = ({ daysOfWeek }: DayViewProps) => {
  return (
    <table className="calendar__table">
      <thead>
        <tr className="calendar__table__header">
          <th className="calendar__key-cell">
            <CalendarIcon className="calendar__icon" />
          </th>
          {daysOfWeek.map((day, i) => (
            <th key={i}>{day.format("dddd D")}</th>
          ))}
        </tr>
      </thead>
      <CalendarGrid daysOfWeek={daysOfWeek} />
    </table>
  );
};

export default CalendarTableView;
