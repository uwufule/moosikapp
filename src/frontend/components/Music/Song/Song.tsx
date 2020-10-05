import Link from 'next/link';
import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';
import PlayPauseButton from './Controls/PlayPause';
import EditButton from './Controls/Edit';
import FavButton from './Controls/Fav';
import DefaultCover from './DefaultCover';

const StyledPlayPauseButton = styled(PlayPauseButton)`
  @media (min-width: 960px) {
    & {
      opacity: 0;
      transition: opacity ${(props: Theme) => props.theme.transition};
    }
  }
`;

const StyledEditButton = styled(EditButton)`
  @media (min-width: 960px) {
    & {
      opacity: 0.7;
      transition: all ${(props: Theme) => props.theme.transition};
    }
  }
`;

const StyledFavButton = styled(FavButton)`
  @media (min-width: 960px) {
    & {
      opacity: 0.7;
      transition: all ${(props: Theme) => props.theme.transition};
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 960px) {
    & {
      transition: all ${(props: Theme) => props.theme.transition};
    }

    &:hover {
      background: ${(props: Theme) => props.theme.songList.song.background};
    }

    &:hover ${StyledPlayPauseButton}, &:hover ${StyledEditButton}, &:hover ${StyledFavButton} {
      opacity: 1;
    }
  }
`;

type CoverProps = Theme<{ url: string }>;

const Cover = styled.div<CoverProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  position: relative;
  background: ${(props: CoverProps) =>
      props.url ? `url(${props.url})` : props.theme.songList.song.cover.background}
    50% no-repeat;
  background-size: cover;
`;

const TitleAndAuthor = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
`;

const Title = styled.span`
  font-size: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${(props: Theme) => props.theme.songList.song.title};
`;

const Author = styled.span`
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${(props: Theme) => props.theme.songList.song.author};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ControlsGroup = styled.div`
  display: flex;
`;

interface SongProps {
  id: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

const Song = ({ id, author, title, cover, favorite = true, edit = false }: SongProps) => (
  <Wrapper>
    <Cover url={cover}>
      {!cover && <DefaultCover />}
      <StyledPlayPauseButton songId={id} />
    </Cover>
    <TitleAndAuthor>
      <Title>{title}</Title>
      <Link href={`/music/search?query=${author}`}>
        <Author>{author}</Author>
      </Link>
    </TitleAndAuthor>
    <ControlsGroup>
      {edit && <StyledEditButton />}
      <StyledFavButton songId={id} isFav={favorite} />
    </ControlsGroup>
  </Wrapper>
);

export default Song;
