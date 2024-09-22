"use client";

import React, { useState } from "react";
import { addHours } from "date-fns";
import {
  CalendarSelectYearAndMonth,
  Label,
} from "lumir-internal-design-system";

const InterviewTime = () => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(addHours(new Date(), 1));

  return (
    <section className="flex flex-col gap-5">
      <h2>면접 가능 시간 추가</h2>
      <div className="flex gap-10">
        <p className="flex flex-col flex-1 max-w-[300px] gap-1.5">
          <Label id="interview-start-time">면접 시작 시간</Label>
          <CalendarSelectYearAndMonth
            date={startTime}
            onDateChange={setStartTime}
          />
        </p>
        <p className="flex flex-col flex-1 max-w-[300px] gap-1.5">
          <Label id="interview-end-time">면접 종료 시간</Label>
          <CalendarSelectYearAndMonth
            date={endTime}
            onDateChange={setEndTime}
          />
        </p>
      </div>
    </section>
  );
};

export default InterviewTime;
