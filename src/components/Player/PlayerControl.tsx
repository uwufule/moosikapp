import { MouseEvent } from 'react';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

type ButtonProps = ThemeProps<{ active: boolean }>;

const Button = styled.button.attrs({ type: 'button' })<ButtonProps>`
  width: 24px;
  height: 36px;
  margin: 0;
  padding: 6px 0;
  background: transparent;
  border: 0;
  outline: 0;
  fill: ${(props: ButtonProps) => (
    props.active
      ? props.theme.colors.red
      : props.theme.colors.dark
  )};
  cursor: pointer;
  transition: ${(props: ButtonProps) => props.theme.transition};
`;

const Control = styled(Button)`
  margin-left: 10px;

  &:first-child {
    margin-left: 0;
  }
`;

const Icon = styled.svg`
  width: 24px;
  height: 24px;
`;

interface PlayerControlProps {
  children: JSX.Element;
  active?: boolean;
  caption: string;
  handler: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void
}

const PlayerControl = ({
  active = false, children, caption, handler,
}: PlayerControlProps) => (
  <Control active={active} title={caption} onClick={handler}>
    <Icon>
      {children}
    </Icon>
  </Control>
);

export default PlayerControl;
