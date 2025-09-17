import { useCombobox } from "downshift";
import React, { Dispatch, forwardRef, SetStateAction, useState } from "react";
import Button from "../button/button";

export const Combobox = forwardRef<
  HTMLInputElement,
  {
    name: string;
    label: string;
    className?: string;
    isNew?: boolean;
    onChange?: any;
    onBlur?: any;
    itemList: Item[];
    onNewClick: () => void;
    getItemFilter: (inputValue: string) => (item: Item) => boolean;
  }
>(
  (
    {
      name,
      label,
      className,
      isNew,
      onChange,
      onBlur,
      itemList,
      onNewClick,
      getItemFilter,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    let items = itemList.filter(getItemFilter(inputValue));
    // Combobox
    const {
      isOpen,
      getInputProps,
      getLabelProps,
      highlightedIndex,
      selectedItem,
      getItemProps,
      getMenuProps,
      closeMenu,
    } = useCombobox({
      onInputValueChange({ inputValue: newValue }) {
        setInputValue(newValue);
      },
      items,
      itemToString(item) {
        return item ? item.label : "";
      },
    });

    const handleNewButton = () => {
      onNewClick();
      closeMenu();
    };

    const isExistingOption = items.find((item) => item.label == inputValue);
    const hasInput = inputValue.length > 0;
    const shouldShowNewButton = !isExistingOption && hasInput && isOpen && !isNew;

    return (
      <div className={className}>
        <label {...getLabelProps()}>{label} {isNew && "(New)"}</label>
        <div>
          <input
            className="border-1"
            {...getInputProps({
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
            !isNew &&
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
          {shouldShowNewButton && (
            <Button type="button" onClick={handleNewButton}>
              {inputValue} (New)
            </Button>
          )}
        </ul>
      </div>
    );
  }
);

export interface ComboboxProps<T = any> {
  label: string;
  itemList: Item<T>[];
  getItemFilter: (inputValue: string) => (item: Item<T>) => boolean;
}

export interface Item<T = any> {
  key: string;
  label: string;
  value: string;
  data: T;
}
