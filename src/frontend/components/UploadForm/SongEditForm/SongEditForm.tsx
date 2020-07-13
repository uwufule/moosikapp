import useRequest from '@hooks/useRequest';

interface SongEditFormProps {
  songUuid: string;
}

const SongEditForm = ({ songUuid }: SongEditFormProps) => {
  const { authRequest } = useRequest();

  return (
    <div>
      {songUuid}
    </div>
  );
};

export default SongEditForm;
