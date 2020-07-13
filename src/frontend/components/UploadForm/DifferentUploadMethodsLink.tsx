import Link from 'next/link';
import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

const StyledLink = styled.a`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;
  transition: color ${(props: Theme) => props.theme.transition};

  &:hover {
    color: ${(props: Theme) => props.theme.colors.accent};
  }
`;

const DifferentUploadMethodsLink = () => (
  <Link href="/upload/advanced">
    <StyledLink>or use different methods to upload song</StyledLink>
  </Link>
);

export default DifferentUploadMethodsLink;
