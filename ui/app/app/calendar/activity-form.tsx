import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, FieldError } from "react-hook-form";
import { Combobox, Item } from "@/app/_components/form/combobox";
import { useAuthSession } from "@/app/_hooks/use-auth-session";
import Button from "@/app/_components/button/button";
import * as helpers from "./combobox-helpers";
import {
  fetchActivities,
  fetchCategories,
  createActivityLog,
} from "@/app/_lib/api";
import { useState } from "react";
import Input from "@/app/_components/form/input";
import { useFilterContext } from "./filter-context";
import { showNotification } from "@/app/_components/toast/toast";
import { ColorResult, ChromePicker } from "react-color";
import { Activity, Category } from "@/app/_types/types";
import { error } from "console";
import { daysInMonth } from "@/app/utils";

export default function ActivityForm({ onCancel }: { onCancel }) {
  const [isNewActivity, setIsNewActivity] = useState<boolean>(false);
  const [isNewCategory, setIsNewACategory] = useState<boolean>(false);
  const [showSketch, setShowSketch] = useState<boolean>(false);
  const [color, setColor] = useState<string>("gray");
  const filterState = useFilterContext();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActivityLogForm>();
  let { token } = useAuthSession();
  let activityLabel = watch("activityLabel");
  let categoryLabel = watch("categoryLabel");

  let { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await fetchCategories(token),
    enabled: !!token,
  });

  let { data: activities = [] } = useQuery({
    queryKey: ["form-activities"],
    queryFn: async () => await fetchActivities(token),
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: (obj: ActivityLogInput) => createActivityLog(token, obj),
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
        description: `Now tracking new ${activityLabel}`,
      });

      return queryClient.invalidateQueries({
        queryKey: [
          "activties",
          filterState.filters.year,
          filterState.filters.month,
        ],
      });
    },
  });

  const handleSwatchClick = () => {
    setShowSketch(true);
  };

  const onSubmit = (data) => {
    let activity = activities.find((item) => item.label == activityLabel);
    let category = categories.find((item) => item.label == categoryLabel);

    if (!isNewActivity) {
      mutation.mutate({
        activityId: activity!.id,
        month: filterState.filters.month,
        year: filterState.filters.year,
        target: data.targetValue,
      });
    }

    if (!isNewCategory) {
      mutation.mutate({
        activityName: activityLabel,
        categoryId: category!.id,
        month: filterState.filters.month,
        year: filterState.filters.year,
        target: data.targetValue,
      });
      return;
    }

    mutation.mutate({
      activityName: activityLabel,
      categoryName: categoryLabel!,
      categoryColor: color,
      categoryIcon: "none",
      month: filterState.filters.month,
      year: filterState.filters.year,
      target: data.targetValue,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Combobox
        label="Activity"
        itemList={helpers.activityToItemList(activities)}
        getItemFilter={helpers.getItemFilter}
        onNewClick={() => setIsNewActivity(true)}
        isNew={isNewActivity}
        {...register("activityLabel", {
          required: "You must enter an activity.",
        })}
      />
      <FieldErrorMessage err={errors.activityLabel} />

      {isNewActivity && (
        <div className="border-l-3 border-l-gray-300 px-4 my-4 py-2">
          <Combobox
            label="Category"
            itemList={helpers.categoryToItemList(categories)}
            getItemFilter={helpers.getCategoryFilter}
            onNewClick={() => setIsNewACategory(true)}
            isNew={isNewCategory}
            {...register("categoryLabel", {
              required: "You must enter a category.",
            })}
          />
          <FieldErrorMessage err={errors.categoryLabel} />

          {isNewCategory && (
            <>
              <Swatch color={color} onClick={handleSwatchClick} />
              {showSketch && (
                <div className="absolute -mt-16 -ml-64">
                  <div className="shadow bg-white flex justify-between px-0.5 items-center">
                    <span>Choose</span>
                    <Button onClick={() => setShowSketch(false)}>Close</Button>
                  </div>
                  <ChromePicker
                    color={color}
                    onChange={(color) => setColor(color.hex)}
                    onChangeComplete={(color) => console.log(color)}
                    disableAlpha={true}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Input
        label="Target"
        type="number"
        min="0"
        max={daysInMonth(filterState.filters.month, filterState.filters.year)}
        {...register("targetValue", {
          required: "Please set a target.",
        })}
      />
      <FieldErrorMessage err={errors.targetValue} />
      <div className="flex flex-col mt-8 gap-4">
        <Button onClick={onSubmit} variant="emphasized">
          Save
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

const FieldErrorMessage = ({ err }: { err?: FieldError }) => {
  if (!err) return;
  return <p className="text-red-500">{err.message}</p>;
};

const Swatch = ({ color, onClick }: { color: string; onClick: any }) => {
  return (
    <div className=" flex my-4">
      <div
        className="w-8 h-4 hover:cursor-pointer"
        onClick={onClick}
        style={{ background: color }}
      ></div>
      <span className="ml-2">{color.replace("#", "")}</span>
    </div>
  );
};

interface ActivityLogForm {
  activityLabel: string;
  targetValue: number;
  categoryLabel?: string;
  categoryColor?: string;
}

type ActivityLogInput =
  | ExistingActivityInput
  | ExistingCategoryInput
  | NewCategoryInput;

interface ExistingActivityInput {
  activityId: string;
  month: number;
  year: number;
  target: number;
}

interface ExistingCategoryInput {
  activityName: string;
  categoryId: string;
  month: number;
  year: number;
  target: number;
}

interface NewCategoryInput {
  activityName: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  month: number;
  year: number;
  target: number;
}
