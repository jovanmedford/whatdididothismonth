"use client";
import { ChangeEvent } from "react";

export default function ProgressSquare({
  isActive = false,
  isHighlighted = false,
  day,
  name,
  className,
  label,
  onChange,
}: {
  /**
   * Fills the square on success
   */
  isActive: boolean;
  /**
   *  Highlights a square in a special case (for e.g today)
   */
  isHighlighted: boolean;
  /**
   * Date represented by the square
   */
  day: number;
  /**
   * Input name
   */
  name: string;
  /**
   * Visually hidden label
   */
  label: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(e);
    }
  }

  return (
    <li>
      <label
        className={`
        h-8 w-8 checkbox-parent block
      ${chooseBackgroundColor(isHighlighted, isActive)}
      ${hoverStyle(isActive)}
      ${className ?? ""}`}
      >
        <input
          name={name}
          type="checkbox"
          checked={isActive}
          value={day}
          onChange={handleChange}
        ></input>
        <span className="sr-only">
          {label}: Day {day}
        </span>
      </label>
    </li>
  );
}

const chooseBackgroundColor = (isHighlighted: boolean, isActive: boolean) => {
  if (isActive) {
    return "bg-primary-500";
  }

  if (isHighlighted) {
    return "bg-secondary-100";
  }

  return "bg-neutral";
};

const hoverStyle = (isActive: boolean = false) => {
  if (isActive) return "hover:opacity-75";
  return "hover:bg-primary-300";
};
