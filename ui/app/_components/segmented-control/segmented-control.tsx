import { InputItem } from "@/app/_types/types";
import { ChangeEvent, useId } from "react";

export default function SegmentedControl({
  name,
  controls,
  value,
  className,
  label,
  onChange,
  ...delegated
}: SegmentedControlProps) {
  const generatedId = useId();
  const inputName = name ? name : generatedId;
  return (
    <>
      <span id={`${generatedId}-label`} className="sr-only">
        {label}
      </span>
      <div
        className={`flex border-1 rounded-3xl border-primary-500 -ml-2  ${className ?? ""}`}
        role="radiogroup"
        aria-labelledby={`${generatedId}-label`}
      >
        {controls.map((item) => {
          const isChecked = value === item.value;
          return (
            <label
              key={item.value}
              className={`block px-4 py-0.5 rounded-3xl focus-within:outline-2 focus-within:outline-black focus-within:outline-offset-0 ${isChecked && "bg-primary-500 text-white"}`}
            >
              <input
                {...delegated}
                type="radio"
                value={item.value}
                checked={isChecked}
                onChange={onChange}
                name={inputName}
              />
              {item.label}
            </label>
          );
        })}
      </div>
    </>
  );
}

interface SegmentedControlProps {
  /**
   * Input name
   */
  name?: string;
  /**
   * Label for screen reader support
   */
  label?: string;
  /**
   * Additional styles applied to radiogroup
   */
  className?: string;
  /**
   * Buttons data
   */
  controls: InputItem[];
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
