import type dayjs from "dayjs";
import CalendarGrid from "../components/calendar-grid";
import ClockIcon from "../../../assets/icons/ic-clock";

interface DayViewProps {
  daysOfWeek: dayjs.Dayjs[];
}
const CalendarTableView = ({ daysOfWeek }: DayViewProps) => {
  return (
    <table className="calendar__table">
      <thead>
        <tr className="calendar__table__header">
          <th className="calendar__key-cell">
            <ClockIcon />
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
