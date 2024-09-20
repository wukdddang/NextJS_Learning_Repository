'use client'

import React, {useState} from 'react';
import {CalendarWithTime} from "lumir-internal-design-system-nextjs";
import CalendarSelectYearAndMonth
  from "lumir-internal-design-system-nextjs/src/components/ui/calendar-select-year-and-month";



const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  return (
    <div className="inline-flex">
      
      <CalendarSelectYearAndMonth
        date={selectedDate}
        onDateChange={(date) => {
          setSelectedDate(date);
          console.log("Selected date:", date);
        }}
      />    </div>
  );
};

export default HomePage;
