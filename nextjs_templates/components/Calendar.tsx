"use client";

import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import Timeline from "@/components/Timeline";

// dayjs.locale("ko"); // 한국어 로케일을 설정합니다.

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedYear, setSelectedYear] = useState(currentMonth.year());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.month() + 1);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Update the calendar when the user selects a different month or year
  const handleMonthYearChange = (year: number, month: number) => {
    setCurrentMonth(dayjs(new Date(year, month)));
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  // Generate month and year dropdown options
  const years = Array.from(
    new Array(20),
    (val, index) => currentMonth.year() - 10 + index
  );
  const months = Array.from(new Array(12), (val, index) => index + 1);

  const daysInMonth = () => {
    const days = [];
    const firstDayOfMonth = currentMonth.startOf("month").day();
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // 일요일이면 6, 그 외에는 하루 빼기
    const endDayOfMonth = currentMonth.endOf("month").date();

    // Empty days for start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Actual days of the month
    for (let i = 1; i <= endDayOfMonth; i++) {
      const day = currentMonth.date(i);
      const isSelected =
        day.isAfter(startDate, "day") && day.isBefore(endDate, "day");
      const isStartOrEnd =
        day.isSame(startDate, "day") || day.isSame(endDate, "day");

      const dayOfWeek = day.day();
      const isSaturday = dayOfWeek === 6; // 토요일 체크
      const isSunday = dayOfWeek === 0; // 일요일 체크
      const dayClasses = `calendar-day ${isSaturday ? "saturday" : ""} ${
        isSunday ? "sunday" : ""
      }`;

      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day ${isSelected ? "selected" : ""} ${
            isStartOrEnd ? "start-or-end" : ""
          } ${dayClasses}`}
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
    <>
      <div className="calendar">
        <div className="calendar-header">
          <button
            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
          >
            Prev
          </button>
          <select
            value={selectedYear}
            onChange={(e) =>
              handleMonthYearChange(parseInt(e.target.value), selectedMonth)
            }
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {/* <select
            value={selectedMonth}
            onChange={(e) =>
              handleMonthYearChange(selectedYear, parseInt(e.target.value))
            }
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select> */}
          <div>{selectedMonth}</div>
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
      <Timeline startDate={startDate} endDate={endDate} />
    </>
  );
};

export default Calendar;
