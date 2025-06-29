import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ValidationError, ValidationErrorResponse } from "@/types/validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractValidationErrors = (error: unknown): string[] => {
  const validationError = error as ValidationErrorResponse;
  if (validationError.isValidationError && validationError.validationErrors) {
    return validationError.validationErrors.map(
      (err: ValidationError) => err.msg
    );
  }
  return [];
};
