import UploadForm from '@components/UploadForm';
import useRestriction from '../hooks/useRestriction';

const Upload = () => {
  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  return (
    <UploadForm />
  );
};

export default Upload;
