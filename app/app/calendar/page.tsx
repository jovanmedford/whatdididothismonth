"use client";

import { useState } from "react";
import AppHeader from "../app-header";
import ActivityTable from "./activity-table";
import { months } from "./data";

const getYears = (): number[] => {
  let thisYear = new Date().getFullYear();
  let range = [0, 1, 2, 3, 4];
  return range.map((num) => thisYear - Number(num));
};

const YearSelector = () => {
  let years = getYears();
  return (
    <select name="year" aria-label="Choose the year.">
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

const MonthSelector = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="flex flex-wrap justify-start  md:justify-between border-t-1 border-b-1 pt-2 pb-2">
      {months.map((month) => {
        return (
          <label
            className={`${
              selectedMonth === month ? "bg-peach-100" : ""
            } block rounded-3xl px-3 py-1 focus:outline-2 radio-parent`}
          >
            {month}
            <input
              value={month}
              onChange={handleMonthChange}
              name="month"
              type="radio"
            ></input>
          </label>
        );
      })}
    </div>
  );
};

/**
 * Main app landing page - shows consistency chart for each activity that month
 */
export default function Page() {
  return (
    <>
      <body>
        <AppHeader />
        <main className="px-2 md:px-10">
          <YearSelector />
          <MonthSelector />
          <ActivityTable />
        </main>
      </body>
    </>
  );
}
