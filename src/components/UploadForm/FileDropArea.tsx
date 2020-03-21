import { useState } from 'react';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';
import FileSelectButton from './FileSelectButton';

type DropAreaProps = ThemeProps<{ isDrop: boolean }>;

const DropArea = styled.div<DropAreaProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 8px;
  padding: 24px;
  border: 2px dashed ${(props: DropAreaProps) => (
    props.isDrop ? props.theme.colors.darkGray : 'transparent'
  )};
  outline: 0;
  transition: border-color ${(props: DropAreaProps) => props.theme.transition};
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.colors.dark};
`;

const Note = styled.div`
  margin-top: 16px;
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.colors.darkGray};

  & > p {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
  }
`;

interface FileDropAreaProps {
  handler: (files: FileList) => void;
}

const FileDropArea = ({ handler }: FileDropAreaProps) => {
  const [isDrop, setDrop] = useState(false);

  return (
    <DropArea
      isDrop={isDrop}
      onDrop={(event) => {
        event.preventDefault();
        handler(event.dataTransfer.files);
        setDrop(false);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDrop(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDrop(false);
      }}
    >
      <Title>Drag and drop your tracks here</Title>
      <FileSelectButton
        accept="audio/mpeg"
        multiple
        handler={(event) => {
          handler(event.target.files);
        }}
      >
        or choose files to upload
      </FileSelectButton>
      <Note>
        <p>Your audio file may not exceed 10 MB and has to be in MP3 format.</p>
      </Note>
    </DropArea>
  );
};

export default FileDropArea;
