import styled from 'styled-components';
import { Link } from '@components/Form';

const StyledLink = styled(Link)`
  margin-top: 16px;
  text-decoration: underline;
`;

const DifferentUploadMethodsLink = () => (
  <StyledLink to="/upload/advanced">or use different methods to upload song</StyledLink>
);

export default DifferentUploadMethodsLink;
