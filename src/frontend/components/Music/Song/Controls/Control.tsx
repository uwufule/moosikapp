import { Theme } from '@components/ThemeProvider';
import styled from 'styled-components';

export const Icon = styled.svg.attrs({ viewBox: '0 0 24 24' })`
  width: 100%;
  height: 100%;
`;

type ControlProps = Theme<{ active?: boolean }>;

const Control = styled.button.attrs({ type: 'button' })<ControlProps>`
  width: 20px;
  height: 20px;
  margin: 0 8px 0 0;
  padding: 0;
  background: none;
  border: 0;
  outline: 0;
  fill: ${(props: ControlProps) =>
    props.active
      ? props.theme.songList.song.controls.active
      : props.theme.songList.song.controls.inactive};
  cursor: pointer;
`;

export default Control;
