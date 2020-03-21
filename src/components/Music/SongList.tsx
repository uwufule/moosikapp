import styled from 'styled-components';
import { Theme } from '../ThemeProvider';

const Wrapper = styled.div`
  padding: 8px;
  background: ${(props: Theme) => props.theme.colors.light};
  box-shadow: ${(props: Theme) => props.theme.shadow};
`;

const Message = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.colors.dark};
`;

interface SongListProps {
  songs: any[];
  searching?: boolean;
}

const SongList = ({ songs, searching = false }: SongListProps) => (
  <Wrapper>
    {songs.length === 0 && (
      <Message>
        {searching
          ? 'Enter your request in the input field ...'
          : 'Nothing to show :('}
      </Message>
    )}
  </Wrapper>
);

export default SongList;
