import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

export const Icon = styled.svg`
  width: 24px;
  height: 24px;
`;

type ControlProps = Theme<{ active?: boolean }>;

const Control = styled.button.attrs({ type: 'button' })<ControlProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 48px;
  margin: 0;
  padding: 12px 0;
  background: transparent;
  border: 0;
  outline: 0;
  fill: ${(props: ControlProps) =>
    props.active ? props.theme.player.controls.active : props.theme.player.controls.inactive};
  cursor: pointer;
  transition: ${(props: ControlProps) => props.theme.transition};
`;

export const IndentedControl = styled(Control)`
  margin-left: 10px;

  &:first-child {
    margin-left: 0;
  }
`;

export default Control;
