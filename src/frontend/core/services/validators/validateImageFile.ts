import ValidationResult from './interfaces/ValidationResult';

const checkImageType = (file: File) => {
  return /image\/(png|webp|jpe?g)/.test(file.type);
};

const checkImageSize = (file: File) => {
  return file.size <= 1048576; // 1MB
};

const validateImageFile = (file: File) => {
  const result: ValidationResult<File | null> = {
    value: null,
    errors: [],
  };

  if (!checkImageType(file)) {
    result.errors.push({
      filename: file.name,
      error: new Error('Unsupported image type.'),
    });
  } else if (!checkImageSize(file)) {
    result.errors.push({
      filename: file.name,
      error: new Error('File too large.'),
    });
  } else {
    result.value = file;
  }

  return result;
};

export default validateImageFile;
