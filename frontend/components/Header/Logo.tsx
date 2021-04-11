import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const LogoAnchor = styled.a`
  width: 36px;
  height: 36px;
  margin-right: 0.75rem;
  fill: #fff;
`;

const LogoSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const Logo: React.FC = () => (
  <Link href="/" passHref>
    <LogoAnchor>
      <LogoSvg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M6 23v-11c-4.036 0-6 2.715-6 5.5 0 2.807 1.995 5.5 6 5.5zm18-5.5c0-2.785-1.964-5.5-6-5.5v11c4.005 0 6-2.693 6-5.5zm-12-13.522c-3.879-.008-6.861 2.349-7.743 6.195-.751.145-1.479.385-2.161.716.629-5.501 4.319-9.889 9.904-9.889 5.589 0 9.29 4.389 9.916 9.896-.684-.334-1.415-.575-2.169-.721-.881-3.85-3.867-6.205-7.747-6.197z" />{' '}
      </LogoSvg>
    </LogoAnchor>
  </Link>
);

export default Logo;
