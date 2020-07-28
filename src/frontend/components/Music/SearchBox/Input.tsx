import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

const Input = styled.input.attrs({ type: 'text' })`
  width: 100%;
  margin: 0;
  padding: 6px 8px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.songList.searchBox.input.background};
  color: ${(props: Theme) => props.theme.songList.searchBox.input.text};
  border: 1px solid ${(props: Theme) => props.theme.songList.searchBox.input.border.inactive};
  border-radius: 0;
  outline: 0;
  transition: all ${(props: Theme) => props.theme.transition};

  &:focus {
    border-color: ${(props: Theme) => props.theme.songList.searchBox.input.border.active};
    box-shadow: 0 0 2px ${(props: Theme) => props.theme.songList.searchBox.input.border.active};
  }
`;

export default Input;
