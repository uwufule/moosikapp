import React, { createRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchSongs } from '../../redux/songs/actions';
import { selectSongList } from '../../redux/songs/selectors';
import SongListItem from './SongListItem';

const SongListItemsContainer = styled.div`
  padding: 10px;
  background: #1b1d27;
`;

const SearchSongsProgressMessage = styled.span`
  color: #c7ccd8;
`;

const SongList: React.FC<{ isSearching?: boolean }> = ({ isSearching }) => {
  const intersectionObserverTargetRef = createRef<HTMLDivElement>();

  const songList = useSelector(selectSongList);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!intersectionObserverTargetRef.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const isIntersecting = entries.reduce(
        (result, current) => result || current.isIntersecting,
        false,
      );

      if (isIntersecting) {
        dispatch(fetchSongs());
      }
    });

    observer.observe(intersectionObserverTargetRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <SongListItemsContainer>
        {songList.map(({ id, author, title, cover, favorite, edit }) => (
          <SongListItem
            key={id}
            id={id}
            author={author}
            title={title}
            cover={cover}
            favorite={favorite}
            edit={edit}
          />
        ))}
        {songList.length === 0 && (
          <SearchSongsProgressMessage>
            {isSearching === true
              ? 'Enter your request in the input field ...'
              : 'Nothing to show :('}
          </SearchSongsProgressMessage>
        )}
      </SongListItemsContainer>
      <div ref={intersectionObserverTargetRef} />
    </>
  );
};

export default SongList;
