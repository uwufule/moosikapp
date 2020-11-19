import { Theme } from '@components/ThemeProvider';
import genHash from '@core/infrastructure/crypto/genHash';
import { ChangeEvent } from 'react';
import styled from 'styled-components';

const Button = styled.label`
  position: relative;
  padding: 8px 16px;
  color: ${(props: Theme) => props.theme.uploadForm.fileSelect.text};
  font-size: 18px;
  font-weight: 400;
  line-height: 32px;
  text-align: center;
  background: ${(props: Theme) => props.theme.uploadForm.fileSelect.background.inactive};
  cursor: pointer;
  transition: background-color ${(props: Theme) => props.theme.transition};

  &:hover {
    background: ${(props: Theme) => props.theme.uploadForm.fileSelect.background.active};
  }
`;

const Input = styled.input.attrs({ type: 'file' })`
  width: 0;
  height: 0;
  position: absolute;
`;

interface FileSelectButtonProps {
  children: string;
  accept: string;
  multiple: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FileSelectButton = ({ children, accept, multiple, onChange }: FileSelectButtonProps) => {
  const id = genHash(children);

  return (
    <Button htmlFor={id}>
      <span>{children}</span>
      <Input id={id} accept={accept} multiple={multiple} onChange={onChange} />
    </Button>
  );
};

export default FileSelectButton;
