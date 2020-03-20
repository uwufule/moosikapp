import { CSSProperties } from 'react';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

const Button = styled.input.attrs({ type: 'submit' })`
  padding: 5px 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: ThemeProps) => props.theme.colors.red};
  color: ${(props: ThemeProps) => props.theme.colors.light};
  border: 0;
  border-radius: 0;
  outline: 0;
  cursor: pointer;
  transition: all ${(props: ThemeProps) => props.theme.transition};

  &:hover {
    background: ${(props: ThemeProps) => props.theme.colors.darkRed};
    box-shadow: 0 0 2px ${(props: ThemeProps) => props.theme.colors.red};
  }
`;

interface ButtonProps {
  caption: string;
  style?: CSSProperties;
}

export default ({ caption, style = {} }: ButtonProps) => (
  <Button style={style} value={caption} />
);
