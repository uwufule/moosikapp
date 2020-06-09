import { useState } from 'react';
import { useSelector } from 'react-redux';
import useRequest from '@hooks/useRequest';
import { RootState } from '@redux/store';
import { Control, Icon } from './Control';

interface FavButtonProps {
  isFav?: boolean;
  className?: string;
}

const FavButton = ({ isFav = true, className }: FavButtonProps) => {
  const [fav, setFav] = useState(isFav);

  const songUuid = useSelector<RootState, string | undefined>(
    (state) => state.player.current.song?.uuid,
  );

  const { authRequest } = useRequest();

  const toggleFav = async () => {
    if (!songUuid) {
      return;
    }

    try {
      if (fav) {
        await authRequest(`/favorites/${songUuid}`, { method: 'DELETE' });
        setFav(false);

        return;
      }

      await authRequest(`/favorites/${songUuid}`, { method: 'POST' });
      setFav(true);
    } catch (e) {
      // error
    }
  };

  return (
    <Control
      className={className}
      title={fav ? 'Remove from favorite' : 'Add to favorite'}
      active={fav}
      onClick={toggleFav}
    >
      <Icon>
        <path
          d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3
            10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27
            18.6,15.36 13.45,20.03L12,21.35Z"
        />
      </Icon>
    </Control>
  );
};

export default FavButton;
