import MonthPicker from "@/app/_components/form/month-picker";
import { Filters, useFilterContext } from "./filter-context";
import { ChangeEvent } from "react";
import MultiselectToolbar from "./multiselect-toolbar";

export default function DateFilters() {
  let { filters, setFilters } = useFilterContext();
  let years = getYears();

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((oldFilters: Filters) => ({
      ...oldFilters,
      month: Number(e.target.value),
    }));
  };

  function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
    setFilters((oldFilters: Filters) => ({
      ...oldFilters,
      year: Number(e.target.value),
    }));
  }

  return (
    <>
      <div className="flex h-8">
        <select
          onChange={handleYearChange}
          name="year"
          aria-label="Choose the year."
          value={filters.year}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <MultiselectToolbar />
      </div>
      <div className="flex flex-wrap justify-start  md:justify-between border-t-1 border-b-1 pt-2 pb-2">
        <MonthPicker
          month={String(filters.month)}
          onChange={handleMonthChange}
        />
      </div>
    </>
  );
}

const getYears = (): number[] => {
  let thisYear = new Date().getFullYear();
  let range = [0, 1, 2, 3, 4];
  return range.map((num) => thisYear - Number(num));
};
