import useRestriction from '../hooks/useRestriction';
import UploadForm from '../components/UploadForm';

const Upload = () => {
  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  return (
    <UploadForm />
  );
};

export default Upload;
