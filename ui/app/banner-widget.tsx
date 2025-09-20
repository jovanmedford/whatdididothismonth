"use client";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import ProgressGrid from "./_components/progress-grid/progress-grid";
import { ActivityLog } from "./_types/types";

export default function BannerWidget() {
  const [visibleGrid, setVisibleGrid] = useState("log-1");
  const gridIndex = logs.findIndex((log) => log.id === visibleGrid);
  const logUnit = logs[gridIndex].target > 1 ? "times" : "time";

  return (
    <div>
      <p className="flex 8 mb-8">
        I want to
        <span className="border-b-primary-500 border-b-2">
          <Select
            value={visibleGrid}
            onChange={(e) => setVisibleGrid(e.target.value)}
          ></Select>
        </span>{" "}
        at least 
        <span className="mx-1 font-bold">
          {logs[gridIndex].target} {logUnit}
        </span>  this month.
      </p>
      <ul className="overflow-hidden">
        {logs.map((log) => (
          <ProgressItem
            key={log.id}
            log={log}
            isVisible={visibleGrid === log.id}
            defaultSuccess={log.successes}
          />
        ))}
      </ul>
    </div>
  );
}

const ProgressItem = ({
  log,
  isVisible,
  defaultSuccess,
}: {
  log: ActivityLog;
  isVisible: boolean;
  defaultSuccess: number[];
}) => {
  const [successes, setSuccesses] = useState<number[]>(() => defaultSuccess);
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
    <li>
      <ProgressGrid
        activity={{ id: log.activityId, label: log.activityName }}
        numOfDays={7}
        className={`flex gap-x-5 ${!isVisible ? "w-0 h-0 overflow-hidden" : ""}`}
        successes={successes}
        onToggleSuccess={handleToggle}
      />
    </li>
  );
};

const Select = ({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}) => {
  return (
    <select className="truncate" name="activity" onChange={onChange} value={value}>
      {logs.map((log) => (
        <option key={log.id} value={log.id}>
          {log.activityName}
        </option>
      ))}
    </select>
  );
};

const logs: ActivityLog[] = [
  {
    id: "log-1",
    activityId: "activity-jog",
    activityName: "jog around the neighborhood", // 24 chars
    target: 5,
    successes: [1, 3, 5],
  },
  {
    id: "log-2",
    activityId: "activity-meditate",
    activityName: "practice mindful breathing", // 24 chars
    target: 7,
    successes: [2, 4, 5, 6],
  },
  {
    id: "log-3",
    activityId: "activity-read",
    activityName: "read a nonfiction chapter", // 24 chars
    target: 4,
    successes: [1, 2],
  },
  {
    id: "log-4",
    activityId: "activity-water",
    activityName: "drink two bottles of water", // 24 chars
    target: 7,
    successes: [1, 3, 4, 7],
  },
];
