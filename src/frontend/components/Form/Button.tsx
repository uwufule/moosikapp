import styled from 'styled-components';
import { Theme } from '../ThemeProvider';

const Button = styled.input.attrs({ type: 'submit' })`
  margin: 0;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.colors.button.background};
  color: ${(props: Theme) => props.theme.colors.button.text};
  border: 0;
  border-radius: 0;
  outline: 0;
  cursor: pointer;
  transition: all ${(props: Theme) => props.theme.transition};

  &:hover {
    background: ${(props: Theme) => props.theme.colors.button.accent};
    box-shadow: 0 0 2px ${(props: Theme) => props.theme.colors.button.accent};
  }
`;

interface FormButtonProps {
  children: string;
  className?: string;
}

const FormButton = ({ children, className }: FormButtonProps) => (
  <Button className={className} value={children} />
);

export default FormButton;
