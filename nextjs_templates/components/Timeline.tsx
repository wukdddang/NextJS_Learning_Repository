"use client";

import { Dayjs } from "dayjs";
// import EDSCTimeline from "@edsc/timeline";
import dynamic from "next/dynamic";

const EDSCTimeline = dynamic(() => import("@edsc/timeline"), { ssr: false });

interface TimelineProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const Timeline = ({ startDate, endDate }: TimelineProps) => {
  const startTime = startDate?.valueOf();
  const endTime = endDate?.valueOf();

  const isSelected = startTime && endTime;

  const handleTimelineMove = (values: any) => console.log("good", values);

  return (
    <>
      <EDSCTimeline
        data={[
          {
            id: "row1",
            title: "Test",
            intervals: isSelected
              ? [
                  [
                    startTime, // start time
                    endTime, // end time
                  ],
                ]
              : [], // no intervals if dates not selected
          },
        ]}
      />
      {/* <EDSCTimeline
        data={[
          {
            id: "row1",
            title:
              "Test Collection With A Really Really Really Super Long Name",
            intervals: [
              [
                new Date("2019-08-12").getTime(),
                new Date("2019-12-20").getTime(),
              ],
              [
                new Date("2020-01-04").getTime(),
                new Date("2020-05-20").getTime(),
              ],
            ],
          },
          {
            id: "row2",
            title: "Test Collection 2",
            color: "#3498DB",
            intervals: [
              [
                new Date("2019-07-01").getTime(),
                new Date("2021-12-20").getTime(),
              ],
            ],
          },
          {
            id: "row3",
            title: "Test Collection 3",
            color: "#dc3545",
            intervals: [
              [
                new Date("2019-07-12").getTime(),
                new Date("2019-07-13").getTime(),
              ],
              [
                new Date("2021-01-01").getTime(),
                new Date("2021-01-02").getTime(),
              ],
            ],
          },
        ]}
        center={new Date("2020-01-01T03:12:58.000Z").getTime()}
        focusedInterval={{
          start: new Date("2020-01-01T00:00:00.000Z").getTime(),
          end: new Date("2020-01-31T23:59:59.999Z").getTime(),
        }}
        temporalRange={{
          start: new Date("2020-01").getTime(),
          end: new Date("2020-03-15").getTime(),
        }}
      /> */}
    </>
  );
};

export default Timeline;
