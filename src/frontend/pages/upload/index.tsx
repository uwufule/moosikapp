import { Theme } from '@components/ThemeProvider';
import { FileDropArea, FileUploader } from '@components/UploadForm';
import genHash from '@core/infrastructure/crypto/genHash';
import validateAudioFiles from '@core/services/validators/validateAudioFiles';
import useRestriction from '@hooks/useRestriction';
import { showErrorMessage } from '@redux/modal/actions';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const FileUploadFormWrapper = styled.div`
  margin-top: 24px;
  background: ${(props: Theme) => props.theme.uploadForm.background};
  box-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const UploadsList = styled.div`
  border-top: 2px solid ${(props: Theme) => props.theme.uploadForm.dividerLine};
  padding: 16px 8px;
`;

const Upload: React.FC = () => {
  const restriction = useRestriction();
  restriction.requireAuth();

  const [files, setFiles] = React.useState<File[]>([]);

  const dispatch = useDispatch();

  const handlePickFiles = (fileList: FileList | null) => {
    try {
      if (!fileList) {
        throw new Error('No files selected.');
      }

      const validationResult = validateAudioFiles(fileList);
      if (validationResult.errors.length > 0) {
        throw new Error(
          validationResult.errors.reduce(
            (errorMessage, validationError) =>
              `${errorMessage} ${validationError.filename}: ${validationError.error.message}`,
            '',
          ),
        );
      }

      setFiles([...files, ...validationResult.value]);
    } catch (e) {
      dispatch(showErrorMessage(e.message));
    }
  };

  return (
    <FileUploadFormWrapper>
      <FileDropArea onFileListChange={handlePickFiles} />
      {files.length > 0 && (
        <UploadsList>
          {files.map((file) => (
            <FileUploader key={genHash(file.name)} file={file} />
          ))}
        </UploadsList>
      )}
    </FileUploadFormWrapper>
  );
};

export default Upload;
