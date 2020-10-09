import { useDispatch } from 'react-redux';
import useRequest from '@hooks/useRequest';
import useErrorHandler from '@hooks/useErrorHandler';
import { setFav } from '@redux/player/actions';
import { Control, Icon } from './Control';

interface FavButtonProps {
  songId: string;
  isFav: boolean;
  className?: string;
}

const FavButton = ({ songId, isFav, className }: FavButtonProps) => {
  const dispatch = useDispatch();

  const { authRequest } = useRequest();

  const handleError = useErrorHandler();

  const toggleFav = () => {
    handleError(async () => {
      if (isFav) {
        await authRequest(`/favorites/${songId}`, { method: 'DELETE' });

        dispatch(setFav(songId, false));
        return;
      }

      await authRequest('/favorites', { method: 'PUT', data: { songId } });

      dispatch(setFav(songId, true));
    });
  };

  return (
    <Control
      className={className}
      title={isFav ? 'Remove from favorite' : 'Add to favorite'}
      active={isFav}
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

FavButton.defaultProps = {
  className: '',
};

export default FavButton;
