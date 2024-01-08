"use client";

import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = () => {
    const days = [];
    const startDayOfMonth = currentMonth.startOf("month").day();
    const endDayOfMonth = currentMonth.endOf("month").date();

    // Empty days for start of the month
    for (let i = 0; i < startDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Actual days of the month
    for (let i = 1; i <= endDayOfMonth; i++) {
      const day = currentMonth.date(i);
      const isSelected =
        day.isAfter(startDate, "day") && day.isBefore(endDate, "day");
      const isStartOrEnd =
        day.isSame(startDate, "day") || day.isSame(endDate, "day");

      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day ${isSelected ? "selected" : ""} ${
            isStartOrEnd ? "start-or-end" : ""
          }`}
          onClick={() => handleDateClick(day)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const handleDateClick = (day: Dayjs) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (day.isAfter(startDate, "day")) {
      setEndDate(day);
    } else {
      setStartDate(day);
      setEndDate(null);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
        >
          Prev
        </button>
        <span>{currentMonth.format("MMMM YYYY")}</span>
        <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}>
          Next
        </button>
      </div>
      <div className="weekdays">
        {weekdaysShort.map((day) => (
          <div key={day} className="week-day">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">{daysInMonth()}</div>
      {startDate && (
        <div className="selected-date">
          선택한 기간: {startDate.format("YYYY-MM-DD")} -{" "}
          {endDate ? endDate.format("YYYY-MM-DD") : "..."}
        </div>
      )}
    </div>
  );
};

export default Calendar;
