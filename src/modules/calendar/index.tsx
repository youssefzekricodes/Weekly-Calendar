const WeeklyCalendar = () => {
  return (
    <div className="calendar">
      <div className="calendar__grid">
        <div className="calendar__header">
          {days.map((day, index) => (
            <div className="calendar__header__item" key={index}>
              {day}
            </div>
          ))}
        </div>
        {/* <div className="calendar-body">
        {sessions.map((session, index) => (
          <div className="calendar-row" key={index}>
            <div className="calendar-session">
              {session.start} - {session.end}
            </div>
            {days.map((_, dayIndex) => (
              <div
                className={`calendar-cell ${index % 2 === 0 ? "even" : "odd"}`}
                key={dayIndex}
              ></div>
            ))}
          </div>
        ))}
      </div> */}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const sessions = [
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "12:00", end: "13:00" },
  { start: "13:00", end: "14:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" },
];
