import { useState } from 'react';
import styled from 'styled-components';
import createHash from '@utils/hash';
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

  const handlePickFiles = (fileList: FileList) => {
    const result = validateFiles(Array.from(fileList), files);
    if (result.errors.length > 0) {
      // result.errors
    }

    setFiles([...files, ...result.files]);
  };

  return (
    <UploadFormWrapper>
      <FileDropArea handler={handlePickFiles} />
      {files.length > 0 && (
        <UploadsList>
          {files.map((file) => (
            <UploadFile key={createHash().update(file.name).digest(36)} file={file} />
          ))}
        </UploadsList>
      )}
    </UploadFormWrapper>
  );
};

export default UploadForm;
