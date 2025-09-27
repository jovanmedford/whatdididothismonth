import { ChangeEvent } from "react";
import { months } from "@/app/app/calendar/data";

export default function MonthPicker({ month, onChange }: MonthPickerProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
  };

  return (
    <>
      {months.map((monthName, index) => {
        return (
          <label
            key={index}
            className={`${
              Number(month) === index ? "bg-primary-500 text-white" : ""
            } block rounded-3xl px-3 py-1 focus:outline-2 radio-parent`}
          >
            {monthName}
            <input
              value={index}
              onChange={handleChange}
              checked={Number(month) === index}
              name="month"
              type="radio"
            ></input>
          </label>
        );
      })}
    </>
  );
}

export type MonthPickerProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * String version of current month i.e "1", "2"
   */
  month: string;
};
