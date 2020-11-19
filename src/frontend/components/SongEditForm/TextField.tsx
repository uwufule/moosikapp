import { ChangeEvent } from 'react';
import styled from 'styled-components';
import uuidv4 from 'uuid/v4';
import { Theme } from '@components/ThemeProvider';

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: ${(props: Theme) => props.theme.uploadForm.editForm.text};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Text = styled.span`
  margin-bottom: 6px;
`;

const Input = styled.input.attrs({ type: 'text' })`
  margin: 0;
  padding: 6px 8px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.uploadForm.editForm.input.background};
  color: ${(props: Theme) => props.theme.uploadForm.editForm.input.text};
  border: 1px solid ${(props: Theme) => props.theme.uploadForm.editForm.input.border.inactive};
  border-radius: 0;
  outline: 0;
  transition: all ${(props: Theme) => props.theme.transition};

  &:focus {
    border-color: ${(props: Theme) => props.theme.uploadForm.editForm.input.border.active};
  }
`;

interface TextFieldProps {
  title: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextField = ({ title, onChange }: TextFieldProps) => {
  const uuid = uuidv4();

  return (
    <Label htmlFor={uuid}>
      <Text>{title}</Text>
      <Input id={uuid} type="text" onChange={onChange} />
    </Label>
  );
};

export default TextField;
