import FileValidationError from './ValidationError';

interface ValidationResult<T> {
  value: T;
  errors: FileValidationError[];
}

export default ValidationResult;
