import React, { useState } from 'react';
import styled from 'styled-components';
import { Maybe } from 'yup/lib/types';

const FileDropWrapper = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  box-shadow: 0 0 2px #000;
`;

const FileDropContainer = styled.div<{ drop?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 0;
  border: 2px dashed ${(props) => (props.drop ? '#c7ccd8' : 'transparent')};
  transition: 200ms ease border-color;
`;

const FileSelectButtonContainer = styled.label`
  position: relative;
  padding: 0.625rem 3rem;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  background: #262838;
  color: #c7ccd8;
  border: 1px solid transparent;
  outline: 0 solid transparent;
  border-radius: 5px;
  cursor: pointer;
  transition: 200ms ease all;

  :hover {
    background: #4f82d1;
    color: #fff;
  }
`;

const FileSelectButtonInput = styled.input.attrs({
  type: 'file',
  accept: 'audio/mpeg',
  multiple: true,
})`
  display: none;
  position: absolute;
`;

const FileSelectButton: React.FC<{ onChange: (fileList: Maybe<FileList>) => void }> = ({
  onChange,
}) => {
  const id = 'choose-files-button';

  return (
    <FileSelectButtonContainer htmlFor={id}>
      <FileSelectButtonInput
        id={id}
        onChange={(event) => {
          onChange(event.target.files);
        }}
      />
      <span>or choose files to upload</span>
    </FileSelectButtonContainer>
  );
};

const Title = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 2rem;
  color: #fff;
  text-align: center;
`;

const Note = styled.p`
  margin: 1rem 0 0 0;
  font-size: 1rem;
  color: #c7ccd8;
  text-align: center;
`;

const FileDropArea: React.FC<{ onChange: (fileList: Maybe<FileList>) => void }> = ({
  onChange,
}) => {
  const [drop, setDrop] = useState(false);

  return (
    <FileDropWrapper>
      <FileDropContainer
        drop={drop}
        onDrop={(event) => {
          event.preventDefault();
          setDrop(false);

          onChange(event.dataTransfer.files);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDrop(true);
        }}
        onDragLeave={() => setDrop(false)}
      >
        <Title>Drag and drop your tracks here</Title>
        <FileSelectButton onChange={onChange} />
        <Note>Note: Your audio file may not exceed 10 MB and has to be in MP3 format.</Note>
      </FileDropContainer>
    </FileDropWrapper>
  );
};

export default FileDropArea;
