"use client";

import { useState } from "react";
import AppHeader from "../app-header";
import LogManager from "./log-manager";
import { FilterContext } from "./filter-context";
import DateFilters from "./date-filters";

const ActivityManager = () => {
  let [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  return (
    <main className="px-2 md:px-10">
      <FilterContext.Provider value={{ filters, setFilters }}>
        <DateFilters />
        <LogManager />
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
