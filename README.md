# 📅 React Weekly Calendar with Recurring Events

This is a fully interactive calendar solution built with React, Zustand, Day.js, and react-beautiful-dnd. It supports:

* One-time, daily, and weekly recurring events
* Drag and drop to reschedule events
* Visual calendar grid with overlapping event support
* Day view and Week view toggling
* Edit or delete one  multiple events from a recurrence list

## 🚀 Getting Started

### 1. Install Dependencies

```bash
yarn install
# or
npm install
```

### 2. Run the Development Server

```bash
yarn dev
# or
npm run dev
```

Open (https://weekly-calendar-demo.netlify.app/) in your browser to view the app.

---

## 🔁 Recurrence Logic

Each event supports the following recurrence options:

### Types

* `none`: A one-time event that only shows on its exact start date & hour
* `daily`: Appears every day, starting from its original date, at the same hour
* `weekly`: Appears every week on the selected weekdays, starting from its original week, at the same hour

### Data Model (CalendarEvent)

```ts
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  recurrence: "none" | "daily" | "weekly";
  recurrenceDays?: RecurrenceDays[]; // For weekly only
  excludedDates?: Date[];            // For omitting specific instances of a recurring event
  category: "work" | "personal" | "meeting";
}
```

### Weekly Logic Example

A weekly event with:

```ts
start: 2025-12-29T08:00:00Z
recurrence: "weekly"
recurrenceDays: ["Monday", "Wednesday"]
```

Will appear:

* Every Monday and Wednesday
* Starting the week of Dec 29, 2025
* At 08:00 local time

### Daily Logic Example

A daily event with:

```ts
start: 2025-12-29T09:00:00Z
recurrence: "daily"
```

Will appear:

* Every day from Dec 29, 2025 onwards
* At 09:00

### One-time Event

A one-time event only shows:

* On the exact date of `start`
* If the calendar cell matches `start.hour()`

### Excluded Dates

Any date listed in `excludedDates` will suppress the recurring instance for that day.

---

## ✨ Features

* ✅ Drag-and-drop to reschedule events
* 🔁 Split logic for editing one instance or the entire series
* 🗓️ Toggle between Week and Day view
* 🎨 Colored categories: work, personal, and meeting

---

## 🧠 Tech Stack

* React + Vite
* TypeScript
* Zustand (for global event state)
* react-beautiful-dnd (for drag and drop)
* Day.js (for date logic)
* Ant Design (for forms and drawers)

---

## 🛠 Notes

* Events are rendered based on the hour they start
* Long-duration events span multiple visual rows
* Overlapping events are auto-split horizontally



---

## 📬 Feedback

If you have any questions or suggestions, feel free to open an issue or send a message.

Enjoy building with it! 🚀
