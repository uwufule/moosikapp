import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

const Submit = styled.input.attrs({ type: 'submit' })`
  margin: 0;
  padding: 6px 12px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.songList.searchBox.button.background.inactive};
  color: ${(props: Theme) => props.theme.songList.searchBox.button.text};
  border: 0;
  border-radius: 0;
  outline: 0;
  cursor: pointer;
  transition: all ${(props: Theme) => props.theme.transition};
  flex: 1;

  &:hover {
    background: ${(props: Theme) => props.theme.songList.searchBox.button.background.active};
    box-shadow: 0 0 2px ${(props: Theme) => props.theme.songList.searchBox.button.background.active};
  }
`;

export default Submit;
