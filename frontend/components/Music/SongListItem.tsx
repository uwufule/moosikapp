import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { copySongListToPlaylist, playSongById, setPlaying } from '../../redux/player/actions';
import { selectCurrentSongId, selectPlaying } from '../../redux/player/selectors';
import { toggleFavoriteStateForSong } from '../../redux/songs/actions';

interface SongListItemProps {
  id: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

const SongContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;

  :nth-child(2n) {
    background: #1d1f2b;
  }
`;

interface SongCoverProps {
  coverUrl: string;
}

const SongCoverContainer = styled.div.attrs((props: SongCoverProps) =>
  props.coverUrl
    ? {
        style: { backgroundImage: `url(${props.coverUrl})` },
      }
    : undefined,
)<SongCoverProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  position: relative;
  background: transparent no-repeat center center;
  background-size: cover;
  ${(props) =>
    props.coverUrl !== '' &&
    css`
      ::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        background: #1b1d27b8;
      }
    `}
`;

const SongAuthorAndTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  flex: 1;
`;

const SongTitle = styled.span`
  margin-bottom: 10px;
  font-size: 1rem;
  color: #fff;
`;

const SongAuthor = styled.a`
  font-size: 0.875rem;
  color: #c7ccd8;
  text-decoration: none;
`;

const SongControlsGroup = styled.div`
  display: flex;
  align-items: center;
`;

const SongControl = styled.button<{ isActive?: boolean }>`
  width: 20px;
  height: 20px;
  margin: 0 0 0 10px;
  padding: 0;
  background: none;
  border: 0;
  outline: 0;
  fill: ${(props) => (props.isActive ? '#f1415f' : '#c7ccd8')};
  cursor: pointer;
  z-index: 1;

  :first-child {
    margin-left: 0;
  }
`;

const SongControlSvg = styled.svg.attrs({ viewBox: '0 0 24 24' })`
  width: 100%;
  height: 100%;
`;

const SongFavoriteControl: React.FC<{ songId: string; favorite: boolean }> = ({
  songId,
  favorite,
}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(toggleFavoriteStateForSong(songId, !favorite));
  };

  return (
    <SongControl
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      isActive={favorite}
      onClick={handleClick}
    >
      <SongControlSvg fillRule="evenodd" clipRule="evenodd">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181" />
      </SongControlSvg>
    </SongControl>
  );
};

const SongEditControl: React.FC = () => {
  return (
    <SongControl title="Edit song">
      <SongControlSvg fillRule="evenodd" clipRule="evenodd">
        <path d="M8.071 21.586l-7.071 1.414 1.414-7.071 14.929-14.929 5.657 5.657-14.929 14.929zm-.493-.921l-4.243-4.243-1.06 5.303 5.303-1.06zm9.765-18.251l-13.3 13.301 4.242 4.242 13.301-13.3-4.243-4.243z" />{' '}
      </SongControlSvg>
    </SongControl>
  );
};

const SongPlayPauseControl: React.FC<{ songId: string }> = ({ songId }) => {
  const playing = useSelector(selectPlaying);
  const currentSongId = useSelector(selectCurrentSongId);

  const dispatch = useDispatch();

  const flag = songId === currentSongId && playing;

  const handleClick = () => {
    if (songId === currentSongId) {
      dispatch(setPlaying(!playing));
      return;
    }

    dispatch(copySongListToPlaylist());
    dispatch(playSongById(songId));
  };

  return (
    <SongControl title={flag ? 'Pause' : 'Play'} onClick={handleClick}>
      <SongControlSvg fillRule="evenodd" clipRule="evenodd">
        {flag ? (
          <path d="M10 24h-6v-24h6v24zm10 0h-6v-24h6v24zm-11-23h-4v22h4v-22zm10 0h-4v22h4v-22z" />
        ) : (
          <path d="M23 12l-22 12v-24l22 12zm-21 10.315l18.912-10.315-18.912-10.315v20.63z" />
        )}
      </SongControlSvg>
    </SongControl>
  );
};

const SongListItem: React.FC<SongListItemProps> = ({
  id,
  author,
  title,
  cover,
  favorite = true,
  edit,
}) => (
  <SongContainer>
    <SongCoverContainer coverUrl={cover}>
      <SongPlayPauseControl songId={id} />
    </SongCoverContainer>
    <SongAuthorAndTitleContainer>
      <SongTitle>{title}</SongTitle>
      <Link href={`/music/search?query=${author}`} passHref>
        <SongAuthor>{author}</SongAuthor>
      </Link>
    </SongAuthorAndTitleContainer>
    <SongControlsGroup>
      {edit && <SongEditControl />}
      <SongFavoriteControl songId={id} favorite={favorite} />
    </SongControlsGroup>
  </SongContainer>
);

export default SongListItem;
