import styled from 'styled-components';
import { Song as SongType } from '@redux/player/types';
import { Theme } from '@components/ThemeProvider';
import Song from './Song';

const Wrapper = styled.div`
  padding: 8px;
  background: ${(props: Theme) => props.theme.songList.background};
  box-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const Message = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.songList.text};
`;

interface SongListProps {
  songs: SongType[];
  searching?: boolean;
}

const SongList = ({ songs, searching = false }: SongListProps) => (
  <Wrapper>
    {songs.map(({ id, author, title, cover, favorite, edit }) => (
      <Song
        key={id}
        id={id}
        author={author}
        title={title}
        cover={cover}
        favorite={favorite}
        edit={edit}
      />
    ))}
    {songs.length === 0 && (
      <Message>
        {searching ? 'Enter your request in the input field ...' : 'Nothing to show :('}
      </Message>
    )}
  </Wrapper>
);

export default SongList;
