/**
 * Validation error types for handling backend validation responses
 */

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse extends Error {
  validationErrors: ValidationError[];
  isValidationError: boolean;
}
