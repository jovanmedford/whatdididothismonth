import { useCombobox } from "downshift";
import React, { forwardRef, Ref, useState } from "react";
import Input from "./input";

export const Combobox = forwardRef(
  (
    {
      name,
      label,
      className,
      onChange,
      onBlur,
      itemList,
      getItemFilter,
      ...delegated
    }: ComboboxProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const [inputValue, setInputValue] = useState("");
    const id = React.useId();
    let items = itemList.filter(getItemFilter(inputValue));
    const {
      isOpen,
      getInputProps,
      highlightedIndex,
      selectedItem,
      getItemProps,
      getMenuProps,
    } = useCombobox({
      onInputValueChange({ inputValue: newValue }) {
        setInputValue(newValue);
      },
      items,
      itemToString(item) {
        return item ? item.label : "";
      },
    });

    return (
      <div className={className}>
        <div>
          <Input
            {...delegated}
            label={label}
            {...getInputProps({
              id,
              name,
              ref,
              onChange,
              onBlur,
            })}
          />
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
);

export interface ComboboxProps<T = any> {
  name?: string;
  label: string;
  itemList: Item[];
  className?: string;
  onChange?: any;
  onBlur?: any;
  getItemFilter: (inputValue: string) => (item: Item) => boolean;
}

export interface Item<T = any> {
  key: string;
  label: string;
  value: string;
  data: T;
}
