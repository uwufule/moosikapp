import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';
import hash from '../../utils/hash';

const ButtonWrapper = styled.label`
  position: relative;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 400;
  
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.colors.light};
  background: ${(props: ThemeProps) => props.theme.colors.red};
  cursor: pointer;
  transition: background-color ${(props: ThemeProps) => props.theme.transition};

  & > span {
    line-height: 32px;
  }

  &:hover {
    background: ${(props: ThemeProps) => props.theme.colors.darkRed};
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
  handler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FileSelectButton = ({
  children, accept, multiple, handler,
}: FileSelectButtonProps) => {
  const id = hash(children);

  return (
    <ButtonWrapper htmlFor={id}>
      <span>{children}</span>
      <Input
        id={id}
        accept={accept}
        multiple={multiple}
        onChange={handler}
      />
    </ButtonWrapper>
  );
};

export default FileSelectButton;
