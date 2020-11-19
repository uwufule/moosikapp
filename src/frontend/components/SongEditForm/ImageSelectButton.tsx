import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

const Button = styled.label`
  position: relative;
  margin-bottom: 16px;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: ${(props: Theme) => props.theme.uploadForm.editForm.cover.button.text};
  background: ${(props: Theme) => props.theme.uploadForm.editForm.cover.button.background.inactive};
  cursor: pointer;
  transition: background-color ${(props: Theme) => props.theme.transition};
  box-shadow: ${(props: Theme) => props.theme.shadow.long};

  &:hover {
    background: ${(props: Theme) => props.theme.uploadForm.editForm.cover.button.background.active};
  }
`;

const Input = styled.input.attrs({
  type: 'file',
  accept: 'image/png,image/jpg,image/jpeg,image/webp',
})`
  width: 0;
  height: 0;
  position: absolute;
`;

interface ImageSelectButtonProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ImageSelectButton = ({ onChange }: ImageSelectButtonProps) => (
  <Button>
    <span>Upload image</span>
    <Input onChange={onChange} />
  </Button>
);

export default ImageSelectButton;
