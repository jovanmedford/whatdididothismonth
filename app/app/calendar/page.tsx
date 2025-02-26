"use client";

import { useState } from "react";
import AppHeader from "../app-header";
import ActivityTable from "./activity-table";
import { months } from "./data";
import { FilterContext, Filters, useFilterContext } from "./filter-context";

const getYears = (): number[] => {
  let thisYear = new Date().getFullYear();
  let range = [0, 1, 2, 3, 4];
  return range.map((num) => thisYear - Number(num));
};

const YearSelector = () => {
  let years = getYears();
  let { filters, setFilters } = useFilterContext();

  function handleChange(e) {
    setFilters((oldFilters: Filters) => ({
      ...oldFilters,
      year: Number(e.target.value),
    }));
  }

  return (
    <select onChange={handleChange} name="year" aria-label="Choose the year." value={filters.year}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

const MonthSelector = () => {
  let { filters, setFilters } = useFilterContext();

  const handleMonthChange = (e) => {
    setFilters((oldFilters: Filters) => ({
      ...oldFilters,
      month: Number(e.target.value),
    }));
  };

  return (
    <div className="flex flex-wrap justify-start  md:justify-between border-t-1 border-b-1 pt-2 pb-2">
      {months.map((month, index) => {
        return (
          <label
            key={index}
            className={`${
              filters.month === index ? "bg-peach-100" : ""
            } block rounded-3xl px-3 py-1 focus:outline-2 radio-parent`}
          >
            {month}
            <input
              value={index}
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

const ActivityManager = () => {
  let [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  return (
    <main className="px-2 md:px-10">
      <FilterContext.Provider value={{ filters, setFilters }}>
        <YearSelector />
        <MonthSelector />
        <ActivityTable />
      </FilterContext.Provider>
    </main>
  );
};

/**
 * Main app landing page - shows consistency chart for each activity that month
 */
export default function Page() {
  return (
    <>
        <AppHeader />
        <ActivityManager />
    </>
  );
}
