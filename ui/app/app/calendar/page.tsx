"use client";

import { useState } from "react";
import AppHeader from "../app-header";
import ActivityTable from "./activity-table";
import { months } from "./data";
import { FilterContext, Filters, useFilterContext } from "./filter-context";
import TextInput from "@/app/_components/form/text-input";
import Button from "@/app/_components/button/button";
import { Controller, useForm } from "react-hook-form";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";
import { showNotification } from "@/app/_components/toast/toast";
import { Activity } from "@/app/_types/types";

const client = generateClient<Schema>();

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

const createActivity = async (newData: Activity): Promise<Activity | null> => {
  const { data, errors } = await client.models.Activity.create(newData);

  if (errors) {
    throw new Error(errors[0].message);
  }

  return data;
};

const SidePanel = () => {
  let { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
  let [show, setShow] = useState(false);
  let {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const queryClient = useQueryClient();
  let {
    filters: { year, month },
  } = useFilterContext();

  const mutation = useMutation({
    mutationFn: createActivity,
    onError: (e) => {
      showNotification({
        type: "error",
        title: "Could not add activity",
        description: e.message,
      });
    },
    onSuccess: (data) => {
      let newActivity = data;

      if (!newActivity) {
        return showNotification({
          type: "error",
          title: "Could not add activity",
          description: "Please try again.",
        });
      }

      showNotification({
        type: "success",
        title: "Activity Update",
        description: `Now tracking ${newActivity.name}`,
      });

      return queryClient.invalidateQueries({
        queryKey: ["activties", year, month],
      });
    },
  });

  const onSubmit = (data) => {
    let newData = {
      ...data,
      userId: user?.userId,
      period: `${year}#${month}`,
      successes: [],
    };
    mutation.mutate(newData);
  };

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="name"
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  errors={errors.name}
                  className="mb-4 bg-white"
                  label="Name"
                  type="text"
                />
              )}
            />
            <Controller
              name="target"
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  errors={errors.target}
                  className="mb-4 bg-white"
                  label="Target"
                  type="number"
                />
              )}
            />
            <div className="flex flex-col mt-8 gap-4">
              <Button variant="emphasized">Save</Button>
              <Button onClick={() => setShow(false)}>Cancel</Button>
            </div>
          </form>
        </section>
      ) : null}
    </>
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
