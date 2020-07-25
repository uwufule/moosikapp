interface FileValidationError {
  file: string;
  error: Error;
}

interface FileValidationResult {
  files: File[];
  errors: FileValidationError[];
}

const validate = (files: File[], existentFiles?: File[]) =>
  files.reduce<FileValidationResult>(
    (acc, file) => {
      if (existentFiles?.find((f) => f.name === file.name)) {
        acc.errors.push({
          file: file.name,
          error: new Error('File already exists.'),
        });
      } else if (!/audio\/(mp3|mpeg)/.test(file.type)) {
        acc.errors.push({
          file: file.name,
          error: new Error('Invalid file type.'),
        });
      } else if (file.size > 10 * 1024 * 1024) {
        acc.errors.push({
          file: file.name,
          error: new Error('File too large.'),
        });
      } else {
        acc.files.push(file);
      }

      return acc;
    },
    { files: [], errors: [] },
  );

export default validate;
