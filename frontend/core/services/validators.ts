import * as Yup from 'yup';

export const validateAudioFiles = Yup.array().of(
  Yup.mixed()
    .test('size', 'Your audio file may not exceed 10 MB', (file) => file.size <= 10485760)
    .test('type', 'Your audio file must be in MP3 format', (file) =>
      /audio\/(mp3|mpeg)/.test(file.type),
    ),
);

export const validateImageFile = Yup.mixed()
  .test('size', 'Cover image may not exceed 1 MB', (file) => file.size <= 1048576)
  .test('type', 'Cover image must be in png or jpeg format', (file) =>
    /image\/(png|jpe?g)/.test(file.type),
  );
