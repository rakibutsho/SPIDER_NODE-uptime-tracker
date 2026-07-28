"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface RadioOption {
  value: string;
  label: string;
  image?: string;
}

interface MyFormInputProps {
  type?: string;
  name: string;
  label?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  rows?: number;
  radioOptions?: RadioOption[];
  radioGroupClassName?: string;
  radioLabelClassName?: string;
  radioInputClassName?: string;
  radioImageClassName?: string;
  radioItemClassName?: string;
  isMultiple?: boolean;
  disabled?: boolean;
  filePlaceholder?: string;
  acceptType?: "image/*";
}

const MyFormInput = ({
  type = "text",
  name,
  label,
  onValueChange,
  placeholder = "",
  required = true,
  className,
  labelClassName,
  inputClassName,
  rows,
  radioOptions,
  radioGroupClassName,
  radioLabelClassName,
  radioInputClassName,
  radioImageClassName,
  radioItemClassName,
  isMultiple = false,
  disabled = false,
  filePlaceholder,
  acceptType,
}: MyFormInputProps) => {
  const { control, getValues, setValue } = useFormContext();

  const inputValue = useWatch({ control, name }) ?? "";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (onValueChange) onValueChange(inputValue);
  }, [inputValue, onValueChange]);

  // Set default for radio on mount (only if empty)
  useEffect(() => {
    if (type === "radio" && radioOptions?.length) {
      const current = getValues(name);
      if (!current) setValue(name, radioOptions[0].value);
    }
  }, [type, radioOptions, name, setValue, getValues]);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const baseFieldClass = cn(
    "w-full px-4 py-3 font-normal rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-300",
    "focus:outline-none focus:ring-2 focus:ring-gray-400",
    disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
  );

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={name}
          className={cn("font-normal mb-1 text-gray-900", labelClassName)}
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={getValues(name) ?? radioOptions?.[0]?.value ?? ""}
        rules={
          required
            ? {
                required: `${label ? `${label} is required` : "This field is required"}`,
              }
            : {}
        }
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            {/* File Input */}
            {type === "file" ? (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={name}
                  className={cn(
                    "border border-gray-300 text-gray-700 bg-white rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden",
                    "min-h-25",
                    disabled &&
                      "bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100",
                    error && "border-red-500",
                    inputClassName,
                  )}
                >
                  {preview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </div>
                      <p className="text-center">
                        {filePlaceholder || "Upload Image"}
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    id={name}
                    accept={acceptType}
                    multiple={isMultiple}
                    className="hidden"
                    disabled={disabled}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;

                      if (isMultiple) {
                        setValue(name, Array.from(files), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setPreview(URL.createObjectURL(files[0]));
                      } else {
                        setValue(name, files[0], {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setPreview(URL.createObjectURL(files[0]));
                      }
                    }}
                  />
                </label>
              </div>
            ) : type === "textarea" ? (
              <textarea
                {...field}
                id={name}
                placeholder={placeholder}
                rows={rows || 3}
                disabled={disabled}
                className={cn(
                  baseFieldClass,
                  error ? "border-red-500 focus:ring-red-300" : "",
                  inputClassName,
                )}
                value={field.value ?? ""}
              />
            ) : type === "radio" && radioOptions ? (
              <div className={cn("flex flex-col gap-2", radioGroupClassName)}>
                {radioOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-2 text-gray-900",
                      disabled && "opacity-60 cursor-not-allowed",
                      radioLabelClassName,
                    )}
                  >
                    <input
                      {...field}
                      type="radio"
                      value={option.value}
                      disabled={disabled}
                      checked={field.value === option.value}
                      className={cn(
                        "form-radio text-gray-800 focus:ring-gray-400",
                        radioInputClassName,
                      )}
                    />
                    <div
                      className={cn(
                        "flex gap-2 items-center",
                        radioItemClassName,
                      )}
                    >
                      {option.image && (
                        <Image
                          src={option.image || "/placeholder.svg"}
                          alt={option.label}
                          width={100}
                          height={100}
                          className={cn("w-6 h-6", radioImageClassName)}
                        />
                      )}
                      <div>{option.label}</div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <input
                {...field}
                id={name}
                placeholder={placeholder}
                type={
                  type === "password"
                    ? isPasswordVisible
                      ? "text"
                      : "password"
                    : type
                }
                disabled={disabled}
                className={cn(
                  baseFieldClass,
                  error ? "border-red-500 focus:ring-red-300" : "",
                  inputClassName,
                )}
                value={field.value ?? ""}
              />
            )}

            {/* Password Toggle */}
            {type === "password" && (
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                disabled={disabled}
              >
                {isPasswordVisible ? (
                  <FiEye size={20} />
                ) : (
                  <FiEyeOff size={20} />
                )}
              </button>
            )}

            {/* Validation Error */}
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

export default MyFormInput;
