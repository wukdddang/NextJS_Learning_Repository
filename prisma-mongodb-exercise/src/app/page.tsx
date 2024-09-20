"use client";
import "lumir-internal-design-system/index.css";

import { CalendarSelectYearAndMonth } from "lumir-internal-design-system";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date());
  return (
    <div className="p-10">
      <CalendarSelectYearAndMonth date={date} onDateChange={setDate} />
    </div>
  );
}
