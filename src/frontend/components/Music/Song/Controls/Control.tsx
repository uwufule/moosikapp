import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

type ControlProps = Theme<{ active?: boolean }>;

export const Control = styled.button.attrs({ type: 'button' })<ControlProps>`
  width: 20px;
  height: 20px;
  margin: 0 8px 0 0;
  padding: 0;
  background: none;
  border: 0;
  outline: 0;
  fill: ${(props) => (props.active ? props.theme.colors.accent : props.theme.colors.secondary)};
  cursor: pointer;
`;

export const Icon = styled.svg.attrs({ viewBox: '0 0 24 24' })`
  width: 100%;
  height: 100%;
`;
