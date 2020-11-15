import ValidationResult from './interfaces/ValidationResult';

const checkAudioFileType = (file: File) => {
  return /audio\/(mp3|mpeg)/.test(file.type);
};

const checkFileSize = (file: File) => {
  return file.size <= 10485760; // 10MB
};

const validateAudioFiles = (fileList: FileList) => {
  const files = Array.from(fileList);

  return files.reduce<ValidationResult<File[]>>(
    ({ value, errors }, file) => {
      if (!checkAudioFileType(file)) {
        errors.push({
          filename: file.name,
          error: new Error('Unsupported audio type.'),
        });
      } else if (!checkFileSize(file)) {
        errors.push({
          filename: FileReader.name,
          error: new Error('File too large.'),
        });
      } else {
        value.push(file);
      }

      return { value, errors };
    },
    { value: [], errors: [] },
  );
};

export default validateAudioFiles;
