import clsx from "clsx";
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
        className={clsx("switch-view__button", {
          "switch-view__button--active": view === CalendarView.WEEK,
        })}
      >
        Week
      </button>
      <button
        onClick={() => handelSwitchView(CalendarView.DAY)}
        className={clsx("switch-view__button", {
          "switch-view__button--active": view === CalendarView.DAY,
        })}
      >
        Day
      </button>
    </div>
  );
};

export default CalendarSwitch;
