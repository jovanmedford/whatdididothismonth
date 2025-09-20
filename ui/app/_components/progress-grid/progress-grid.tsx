"use client";
import { generateArray } from "@/app/utils";
import ProgressSquare from "./progress-square";
import React, { ChangeEvent } from "react";
import { Activity } from "@/app/_types/types";

export default function ProgressGrid({
  numOfDays,
  successes,
  highlight,
  activity,
  className,
  onToggleSuccess,
}: {
  /**
   * Number of days shown in the grid
   */
  numOfDays: number;
  /**
   * Activity being tracked
   */
  activity: Activity;
  /**
   * Days the activity was done
   */
  successes?: number[];
  /**
   * Special day (for.eg today)
   */
  highlight?: number;
  className?: string;
  onToggleSuccess?: (
    e: ChangeEvent<HTMLInputElement>,
    successSet: Set<number>
  ) => void;
}) {
  const days = generateArray(0, numOfDays);
  const successSet = new Set(successes);

  function handleSquareChange(e: ChangeEvent<HTMLInputElement>) {
    if (onToggleSuccess) {
      onToggleSuccess(e, successSet);
    }
  }

  return (
    <ul className={`flex flex-wrap gap-4 ${className ?? ""}`}>
      {days.map((day) => (
        <ProgressSquare
          key={day}
          isActive={successSet.has(day)}
          isHighlighted={highlight === day}
          day={day}
          onChange={handleSquareChange}
          name={activity.id}
          label={activity.label}
        ></ProgressSquare>
      ))}
    </ul>
  );
}
