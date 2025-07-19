import { useCombobox } from "downshift";
import { useState } from "react";

export function Combobox<T>({
  label,
  itemList,
  getItemFilter,
}: ComboboxProps<T>) {
  const [items, setItems] = useState(itemList);
  // Combobox
  const {
    isOpen,
    getInputProps,
    getToggleButtonProps,
    highlightedIndex,
    selectedItem,
    getItemProps,
    getMenuProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(itemList.filter(getItemFilter(inputValue)));
    },
    items,
    itemToString(item) {
      return item ? item.label : "";
    },
  });

  return (
    <div>
      <label>{label}</label>
      <div>
        <input {...getInputProps()} />
        <button aria-label="toggle menu" {...getToggleButtonProps()}>
          {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </button>
      </div>
      <ul
        className={`flex-col absolute w-60 bg-white mt-1 shadow-md max-h-80 overflow-y-auto p-0 z-10 ${
          !(isOpen && items.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              key={item.key}
              {...getItemProps({ item, index })}
              className={`py-2 px-3 shadow-sm flex flex-col 
                        ${highlightedIndex === index && "bg-blue-300"} 
                        ${selectedItem === item && "font-bold"}`}
            >
              <span>{item.label}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

interface ComboboxProps<T> {
  label: string;
  itemList: Item<T>[];
  getItemFilter: (inputValue: string) => (item: Item<T>) => boolean;
}

export interface Item<T> {
  key: string;
  label: string;
  value: string;
  data: T;
}
