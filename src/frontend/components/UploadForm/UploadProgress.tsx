import styled from 'styled-components';

interface UploadProgressProps {
  file: File;
}

const UploadProgress = ({ file }: UploadProgressProps) => (
  <div>
    {file.name}
  </div>
);

export default UploadProgress;
