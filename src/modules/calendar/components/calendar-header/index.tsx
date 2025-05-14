import NextArrowIcon from "../../../../assets/icons/ic-next-arrow";
import PrevArrowIcon from "../../../../assets/icons/ic-prev-arrow";
import { CalendarView } from "../../types";
interface CalendarHeaderProps {
  setWeekOffset: (direction: "prev" | "next") => void;
  weekRangeLabel: string;
  view: CalendarView;
}

const CalendarHeader = ({
  setWeekOffset,
  weekRangeLabel,
}: CalendarHeaderProps) => {
  return (
    <div className="calendar__header">
      <PrevArrowIcon
        onClick={() => setWeekOffset("prev")}
        className="calendar__header__arrow"
      />
      <div className="calendar__header__range">{weekRangeLabel}</div>
      <NextArrowIcon
        onClick={() => setWeekOffset("next")}
        className="calendar__header__arrow"
      />
    </div>
  );
};

export default CalendarHeader;
