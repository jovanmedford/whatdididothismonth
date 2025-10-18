import { Activity } from "@/app/_types/types";
import { Combobox, Item } from "./combobox";
import { ComponentProps } from "react";

export default function ActivityCombobox({
  activities,
  className,
  ...delegated
}: ActivityComboboxProps) {
  return (
    <Combobox
      {...delegated}
      label="Name"
      getItemFilter={getActivitiesFilter}
      itemList={activityToItemList(activities)}
      className={className}
    />
  );
}

interface ActivityComboboxProps extends ComponentProps<"input"> {
  activities: Activity[];
  className?: string;
}

export const getActivitiesFilter = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function activityFilter(activity: Item<Activity>) {
    return (
      !inputValue ||
      activity.data.label.toLowerCase().includes(lowerCasedInputValue)
    );
  };
};

function activityToItemList(data: Activity[]): Item<Activity>[] {
  return Array.isArray(data)
    ? data.map((activity) => ({
        key: activity.id,
        label: activity.label,
        value: activity.id,
        data: activity,
      }))
    : [];
}
