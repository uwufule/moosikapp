import styled from 'styled-components';
import SongComponent from './Song';
import { Theme } from '../ThemeProvider';
import { Song } from '../../redux/player/types';

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
  songs: Song[];
  searching?: boolean;
}

const SongList = ({ songs, searching = false }: SongListProps) => (
  <Wrapper>
    {songs.map((song) => (
      <SongComponent
        key={song.uuid}
        uuid={song.uuid}
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
