import { CalendarView } from "../../types";

interface CalendarSwitchProps {
  handelSwitchView: (view: CalendarView) => void;
  view: CalendarView;
}

const CalendarSwitch = ({ handelSwitchView, view }: CalendarSwitchProps) => {
  return (
    <div className="switch-view">
      <button
        onClick={() => handelSwitchView(CalendarView.WEEK)}
        disabled={view === CalendarView.WEEK}
      >
        Weekly
      </button>
      <button
        onClick={() => handelSwitchView(CalendarView.DAY)}
        disabled={view === CalendarView.DAY}
      >
        Daily
      </button>
    </div>
  );
};

export default CalendarSwitch;
