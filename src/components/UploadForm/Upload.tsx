import { useState } from 'react';
import styled from 'styled-components';
import FileDropArea from './FileDropArea';
import UploadProgress from './UploadProgress';
import createHash from '../../utils/hash';
import { Theme } from '../ThemeProvider';

const Wrapper = styled.div`
  margin-top: 24px;
  background: ${(props: Theme) => props.theme.colors.light};
  box-shadow: ${(props: Theme) => props.theme.shadow};
`;

const UploadList = styled.div``;

const Upload = () => {
  const [files, setFiles] = useState<File[]>(null);

  return (
    <Wrapper>
      {!files ? (
        <FileDropArea
          handler={(fileList) => {
            // validation
            setFiles(Array.from(fileList));
          }}
        />
      ) : (
        <UploadList>
          {files.map((file) => (
            <UploadProgress key={createHash().update(file.name).digest(36)} file={file} />
          ))}
        </UploadList>
      )}
    </Wrapper>
  );
};

export default Upload;
