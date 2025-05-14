import { type Dispatch, type SetStateAction } from "react";
import NextArrowIcon from "../../../../assets/icons/ic-next-arrow";
import PrevArrowIcon from "../../../../assets/icons/ic-prev-arrow";
import { CalendarView } from "../../types";
interface CalendarHeaderProps {
  setWeekOffset: Dispatch<SetStateAction<number>>;
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
        onClick={() => setWeekOffset((prev) => prev - 1)}
        className="calendar__header__arrow"
      />
      <div className="calendar__header__range">{weekRangeLabel}</div>
      <NextArrowIcon
        onClick={() => setWeekOffset((prev) => prev + 1)}
        className="calendar__header__arrow"
      />
    </div>
  );
};

export default CalendarHeader;
