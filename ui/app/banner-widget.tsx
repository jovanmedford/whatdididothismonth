"use client";
import { ChangeEvent, useState } from "react";
import ProgressGrid from "./_components/progress-grid/progress-grid";
import { ActivityLog } from "./_types/types";

export default function BannerWidget() {
  const logUnit = log.target > 1 ? "times" : "time";
  const [successes, setSuccesses] = useState<number[]>([]);

  function handleToggle(
    e: ChangeEvent<HTMLInputElement>,
    successSet: Set<number>
  ) {
    let checkbox = e.target;
    let day = Number(e.target.value);
    let newSet = new Set(successSet);

    if (!checkbox.checked) {
      newSet.delete(day);
      setSuccesses([...newSet]);
      return;
    }
    newSet.add(day);
    setSuccesses([...newSet]);
  }

  return (
    <div>
      <div className="flex gap-x-8 mb-8">
        <span className="border-b-primary-500 border-b-2">
          {log.activityName}
        </span>{" "}
        <span>
          {log.target} {logUnit}
        </span>
      </div>
      <ProgressGrid
        activity={{ id: log.activityId, label: log.activityName }}
        numOfDays={7}
        className="flex gap-x-5"
        successes={successes}
        onToggleSuccess={handleToggle}
      />
    </div>
  );
}

const log: ActivityLog = {
  id: "test",
  activityId: "test-activity",
  activityName: "Walk 10,000 steps",
  target: 4,
  successes: [1, 2],
};
