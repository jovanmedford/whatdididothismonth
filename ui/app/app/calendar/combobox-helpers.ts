import { Item } from "@/app/_components/form/combobox";
import { Activity, Category } from "@/app/_types/types";

export const activityToItemList = (data: Activity[]): Item<Activity>[] => {
  return Array.isArray(data)
    ? data.map((activity) => ({
        key: activity.id,
        label: activity.label,
        value: activity.id,
        data: activity,
      }))
    : [];
};

export const categoryToItemList = (data: Category[]): Item<Category>[] => {
  return Array.isArray(data)
    ? data.map((category) => ({
        key: category.id,
        label: category.label,
        value: category.id,
        data: category,
      }))
    : [];
};

export const getItemFilter = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function activityFilter(activity: Item<Activity>) {
    return (
      !inputValue ||
      activity.data.label.toLowerCase().includes(lowerCasedInputValue)
    );
  };
};

export const getCategoryFilter = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function categoryFilter(category: Item<Category>) {
    return (
      !inputValue || category.label.toLowerCase().includes(lowerCasedInputValue)
    );
  };
};
