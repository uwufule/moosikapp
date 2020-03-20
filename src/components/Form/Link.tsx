import Link from 'next/link';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

const StyledLink = styled.a`
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: ${(props: ThemeProps) => props.theme.colors.light};
  text-decoration: none;
  cursor: pointer;
  text-shadow: ${(props: ThemeProps) => props.theme.shadow};
  transition: color ${(props: ThemeProps) => props.theme.transition};

  &:hover {
    color: ${(props: ThemeProps) => props.theme.colors.red};
  }
`;

interface FormLinkProps {
  children: JSX.Element | JSX.Element[] | string;
  to: string;
}

const FormLink = ({ to, children }: FormLinkProps) => (
  <Link href={to}>
    <StyledLink>
      {children}
    </StyledLink>
  </Link>
);

export default FormLink;
