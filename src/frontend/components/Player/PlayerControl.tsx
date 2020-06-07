import { MouseEvent } from 'react';
import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

type ButtonProps = Theme<{ active: boolean }>;

const Button = styled.button.attrs({ type: 'button' })<ButtonProps>`
  width: 24px;
  height: 48px;
  margin: 0;
  padding: 12px 0;
  background: transparent;
  border: 0;
  outline: 0;
  fill: ${(props: ButtonProps) => (
    props.active
      ? props.theme.colors.accent
      : props.theme.colors.primary
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
