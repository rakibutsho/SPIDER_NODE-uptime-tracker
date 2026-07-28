"use client";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Default Icons
import React, { useState } from "react";

interface MyFormSelectProps {
  name: string;
  label?: string;
  options: {
    label: string;
    keyOption: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  required?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  setSelectedState?: (value: string | number) => void;
  upIcon?: React.ReactNode; // Custom Up Icon (Optional)
  downIcon?: React.ReactNode; // Custom Down Icon (Optional)
}

const MyFormSelect = ({
  name,
  label,
  options,
  required = true,
  className,
  labelClassName,
  selectClassName,
  setSelectedState,
  upIcon = <FaChevronUp />, // Default Up Icon
  downIcon = <FaChevronDown />, // Default Down Icon
}: MyFormSelectProps) => {
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative flex flex-col gap-1 w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className={cn("text-base font-normal", labelClassName)}
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={required ? { required: `${label || name} is required` } : {}} // Fix: Show correct field name
        render={({
          field: { value, onChange, ...field },
          fieldState: { error },
        }) => (
          <div className="relative">
            {/* Custom Select Dropdown */}
            <select
              {...field}
              value={value || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                onChange(newValue);
                if (setSelectedState) setSelectedState(newValue);
                setIsOpen(false); // Fix: Close dropdown immediately after selection
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              className={cn(
                "w-full  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 appearance-none",
                "transition-all ease-in-out ",
                error ? "border-danger" : "border-gray-600",
                selectClassName
              )}
            >
              <option value="" disabled>
                Select an option
              </option>
              {options?.map(({ label, value, keyOption }) => (
                <option key={keyOption} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {/* Custom Up/Down Icons */}
            <div className="absolute right-5 top-1/3 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-all">
              {isOpen ? upIcon : downIcon}
            </div>

            <div className="h-4 mb-1">
              {error && (
                <small className="text-red-500 text-xs">{error.message}</small>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default MyFormSelect;
