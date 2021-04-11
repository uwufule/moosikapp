import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const SongBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  width: 250px;
  margin-left: 10px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  margin-left: 10px;
  overflow: hidden;
  box-sizing: border-box;
`;

const Span = styled.span`
  line-height: 1.5;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: normal;
  overflow: hidden;
`;

const SongTitle = styled(Span)`
  color: #fff;
  font-size: 0.875rem;
`;

const SongAuthor = styled(Span)`
  color: #c7ccd8;
  font-size: 0.725rem;
`;

const NoStyleLink = styled.a`
  color: inherit;
  text-decoration: none;
`;

interface SongCoverProps {
  coverUrl: string;
}

const SongCover = styled.div.attrs((props: SongCoverProps) =>
  props.coverUrl !== ''
    ? {
        style: { backgroundImage: `url(${props.coverUrl})` },
      }
    : undefined,
)<SongCoverProps>`
  width: 40px;
  height: 40px;
  background: #1d1f2b no-repeat center center;
  background-size: cover;
`;

const SongBadge: React.FC<{ author?: string; title?: string; coverUrl?: string }> = ({
  author = 'No Author',
  title = 'No Title',
  coverUrl = '',
}) => (
  <SongBadgeContainer>
    <SongCover coverUrl={coverUrl} />
    <SongInfo>
      <SongTitle>{title}</SongTitle>
      <SongAuthor>
        <Link href={`/music/search?query=${author}`} passHref>
          <NoStyleLink>{author}</NoStyleLink>
        </Link>
      </SongAuthor>
    </SongInfo>
  </SongBadgeContainer>
);

export default SongBadge;
