import useWithAuthorization from '../hooks/useWithAuthorization';
import UploadForm from '../components/UploadForm';

const Upload = () => {
  useWithAuthorization();

  return (
    <UploadForm />
  );
};

export default Upload;
