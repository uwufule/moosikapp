import { useState } from 'react';
import styled from 'styled-components';
import useErrorHandler from '@hooks/useErrorHandler';
import HashUtils from '@utils/HashUtils';
import validateFiles from '@utils/validator';
import { Theme } from '@components/ThemeProvider';
import FileDropArea from './FileDropArea';
import UploadFile from './UploadFile';

const UploadFormWrapper = styled.div`
  margin-top: 24px;
  background: ${(props: Theme) => props.theme.uploadForm.background};
  box-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const UploadsList = styled.div`
  border-top: 2px solid ${(props: Theme) => props.theme.uploadForm.dividerLine};
  padding: 16px 8px;
`;

const UploadForm = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleError = useErrorHandler();

  const handlePickFiles = (fileList: FileList | null) => {
    handleError(() => {
      if (!fileList) {
        throw new Error('No file selected.');
      }

      const result = validateFiles(Array.from(fileList), files);
      if (result.errors.length > 0) {
        throw new Error(
          result.errors.reduce(
            (acc, val) => (acc.includes(val.error.message) ? acc : `${acc} ${val.error.message}`),
            '',
          ),
        );
      }

      setFiles([...files, ...result.files]);
    });
  };

  return (
    <UploadFormWrapper>
      <FileDropArea handler={handlePickFiles} />
      {files.length > 0 && (
        <UploadsList>
          {files.map((file) => (
            <UploadFile key={HashUtils.genHash(file.name, 36)} file={file} />
          ))}
        </UploadsList>
      )}
    </UploadFormWrapper>
  );
};

export default UploadForm;
