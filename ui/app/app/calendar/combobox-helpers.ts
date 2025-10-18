import { Item } from "@/app/_components/form/combobox";
import { Category } from "@/app/_types/types";

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

export const getCategoryFilter = (inputValue: string) => {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function categoryFilter(category: Item<Category>) {
    return (
      !inputValue || category.label.toLowerCase().includes(lowerCasedInputValue)
    );
  };
};
