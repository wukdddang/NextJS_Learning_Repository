"use client";

import EDSCTimeline from "@edsc/timeline";

const Timeline = () => {
  return (
    <>
      <EDSCTimeline
        data={[
          {
            id: "row1",
            title: "Test",
            intervals: [],
          },
        ]}
      />
      <EDSCTimeline
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
      />
    </>
  );
};

export default Timeline;
