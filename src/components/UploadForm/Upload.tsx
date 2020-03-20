import { useState } from 'react';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

import FileDropArea from './FileDropArea';
import UploadProgress from './UploadProgress';

import hash from '../../utils/hash';

const Wrapper = styled.div`
  margin-top: 24px;
  background: ${(props: ThemeProps) => props.theme.colors.light};
  box-shadow: ${(props: ThemeProps) => props.theme.shadow};
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
            <UploadProgress key={hash(file.name)} file={file} />
          ))}
        </UploadList>
      )}
    </Wrapper>
  );
};

export default Upload;
