/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FormProvider, useForm, useWatch } from "react-hook-form"; // Fixed missing useWatch import
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface MyFormWrapperProps {
  onSubmit: (data: any) => void;
  className?: string;
  children: React.ReactNode;
  defaultValues?: any;
  resolver?: import("react-hook-form").Resolver<any, any>;
  setFormState?: (data: any) => void; // Optional state setter function
}

const MyFormWrapper = ({
  onSubmit,
  className,
  children,
  defaultValues,
  resolver,
  setFormState, // Optional setter function
}: MyFormWrapperProps) => {
  const methods = useForm({
    defaultValues,
    resolver,
  });
  const { handleSubmit, reset, control } = methods;

  // Watch the entire form state
  const formValues = useWatch({ control });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Update external state on change
  useEffect(() => {
    if (setFormState) {
      setFormState(formValues);
    }
  }, [formValues, setFormState]);

  const submit = (data: any) => {
    onSubmit(data);
    reset();
  };

  return (
    <FormProvider {...methods}>
      <form className={cn("", className)} onSubmit={handleSubmit(submit)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default MyFormWrapper;
