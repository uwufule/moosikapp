import styled from 'styled-components';
import Song, { ISong } from './Song';
import { Theme } from '../ThemeProvider';

const Wrapper = styled.div`
  padding: 8px;
  background: ${(props: Theme) => props.theme.colors.background};
  box-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const Message = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.colors.primary};
`;

interface SongListProps {
  songs: ISong[];
  searching?: boolean;
}

const SongList = ({ songs, searching = false }: SongListProps) => (
  <Wrapper>
    {songs.map((song) => (
      <Song
        key={song.uuid}
        author={song.author}
        title={song.title}
        cover={song.cover}
        favorite={song.favorite}
        edit={song.edit}
      />
    ))}
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
