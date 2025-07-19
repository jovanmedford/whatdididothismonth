"use client";

import { ChangeEvent, useState } from "react";
import AppHeader from "../app-header";
import ActivityTable from "./activity-table";
import { months } from "./data";
import { FilterContext, Filters, useFilterContext } from "./filter-context";
import TextInput from "@/app/_components/form/text-input";
import Button from "@/app/_components/button/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";
import { showNotification } from "@/app/_components/toast/toast";
import { Activity } from "@/app/_types/types";
import ActivityForm from "./activtiy-form";

const client = generateClient<Schema>();

const getYears = (): number[] => {
  let thisYear = new Date().getFullYear();
  let range = [0, 1, 2, 3, 4];
  return range.map((num) => thisYear - Number(num));
};

const YearSelector = () => {
  let years = getYears();
  let { filters, setFilters } = useFilterContext();

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setFilters((oldFilters: Filters) => ({
      ...oldFilters,
      year: Number(e.target.value),
    }));
  }

  return (
    <select
      onChange={handleChange}
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
  );
};

const MonthSelector = () => {
  let { filters, setFilters } = useFilterContext();

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
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

const SidePanel = () => {
  let [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="rounded-full text-white bg-primary-500 fixed bottom-4 right-4 py-1 px-4 hover:cursor-pointer"
      >
        <span className="text-3xl">+</span>
      </button>
      {show ? (
        <section
          className={`${
            show ? "block" : "hidden"
          } fixed z-10 right-0 py-12 px-20 top-0 bottom-0 bg-beige-100 rounded-l-3xl shadow-xl`}
        >
          <h2 className="text-xl font-bold mb-8">Add a New Activity</h2>
          <ActivityForm />
        </section>
      ) : null}
    </>
  );
};

type ActivityFormData = {
  name: string;
  target: number;
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
        <SidePanel />
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
