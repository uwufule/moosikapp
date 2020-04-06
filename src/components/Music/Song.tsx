import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Theme } from '../ThemeProvider';
import { setPaused, setNowPlaying } from '../../redux/player/actions';
import { RootState } from '../../redux/store';
import { SongData, DetailedSongData } from '../../redux/player/types';

type CoverProps = Theme<{ coverUrl: string }>;

const Cover = styled.div<CoverProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  position: relative;
  background: ${(props: CoverProps) => (
    props.coverUrl
      ? `url(${props.coverUrl})`
      : props.theme.colors.cover.background
  )} 50% no-repeat;
  background-size: cover;
`;

const DefaultCover = styled.svg.attrs({ viewBox: '0 0 24 24' })`
  width: 32px;
  height: 32px;
  fill: ${(props: Theme) => props.theme.colors.cover.foreground};
`;

const PlayPauseButton = styled.button`
  width: 36px;
  height: 36px;
  position: absolute;
  margin: 0;
  padding: 0;
  background: none;
  border: 0;
  outline: 0;
  fill: ${(props: Theme) => props.theme.colors.otherText};
  filter: drop-shadow(${(props: Theme) => props.theme.shadow.short});
  z-index: 1;
  cursor: pointer;

  @media (min-width: 960px) {
    & {
      opacity: 0;
      transition: opacity ${(props: Theme) => props.theme.transition};
    }

    &:hover {
      opacity: 1;
    }
  }
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
  color: ${(props: Theme) => props.theme.colors.primary};
`;

const Author = styled.span`
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${(props: Theme) => props.theme.colors.secondary};
`;

const Actions = styled.div`
  display: flex;
`;

type ActionButtonProps = Theme<{ active?: boolean }>;

const ActionButton = styled.button.attrs({ type: 'button' })<ActionButtonProps>`
  width: 20px;
  height: 20px;
  margin: 0 8px 0 0;
  padding: 0;
  background: none;
  border: 0;
  outline: 0;
  fill: ${(props: ActionButtonProps) => (
    props.active
      ? props.theme.colors.accent
      : props.theme.colors.secondary
  )};
  cursor: pointer;
`;

const ActionButtonIcon = styled.svg.attrs({ viewBox: '0 0 24 24' })`
  width: 100%;
  height: 100%;

  @media (min-width: 960px) {
    & {
      opacity: .7;
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
      background: ${(props: Theme) => props.theme.colors.accentBackground};
    }

    &:hover ${PlayPauseButton} {
      opacity: 1;
    }

    &:hover ${ActionButtonIcon} {
      opacity: 1;
    }
  }
`;

interface SongProps {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

const Song = ({
  uuid, author, title, cover, favorite, edit,
}: SongProps) => {
  const songList = useSelector<RootState, SongData[]>(
    (state) => state.player.songList,
  );
  const currentSong = useSelector<RootState, DetailedSongData>(
    (state) => state.player.currentSong,
  );
  const paused = useSelector<RootState, boolean>(
    (state) => state.player.paused,
  );

  const dispatch = useDispatch();

  return (
    <Wrapper>
      <Cover coverUrl={cover}>
        {!cover && (
          <DefaultCover>
            <path
              d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21
                10.5,21C13,21 15,19 15,16.5V6H19V3H12Z"
            />
          </DefaultCover>
        )}
        <PlayPauseButton
          title="Play / Pause"
          onClick={() => {
            if (currentSong?.uuid === uuid) {
              dispatch(setPaused(!paused));
              return;
            }

            dispatch(setNowPlaying(songList?.findIndex((s) => s.uuid === uuid)));
            dispatch(setPaused(false));
          }}
        >
          <svg viewBox="0 0 24 24">
            <path
              d={(!paused && currentSong?.uuid === uuid)
                ? 'M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
                : 'M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'}
            />
          </svg>
        </PlayPauseButton>
      </Cover>
      <TitleAndAuthor>
        <Title>{title}</Title>
        <Author>{author}</Author>
      </TitleAndAuthor>
      <Actions>
        {edit && (
          <ActionButton title="Edit song">
            <ActionButtonIcon>
              <path
                d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9
                  16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
              />
            </ActionButtonIcon>
          </ActionButton>
        )}
        <ActionButton active={favorite} title={favorite ? 'Remove from favorite' : 'Add to favorite'}>
          <ActionButtonIcon>
            <path
              d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3
                10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27
                18.6,15.36 13.45,20.03L12,21.35Z"
            />
          </ActionButtonIcon>
        </ActionButton>
      </Actions>
    </Wrapper>
  );
};

export default Song;
