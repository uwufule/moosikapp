import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

const Container = styled.div`
  display: flex;
  width: 256px;
  margin-left: 10px;

  @media (max-width: 960px) {
    & {
      display: none;
    }
  }
`;

type SongCoverProps = Theme<{ coverUrl?: string }>;

const SongCover = styled.div<SongCoverProps>`
  width: 32px;
  height: 32px;
  background: ${(props: SongCoverProps) => (
    props.coverUrl
      ? `url(${props.coverUrl}) center no-repeat`
      : props.theme.colors.cover.background
  )};
  background-repeat: no-repeat;
`;

const TitleAndAuthor = styled.div`
  display: flex;
  flex-direction: column;
  width: 214px;
  margin-left: 10px;
`;

const Truncate = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
  white-space: nowrap;
`;

const SongTitle = styled(Truncate)`
  font-size: 14px;
  line-height: 17px;
  color: ${(props: Theme) => props.theme.colors.primary};
`;

const SongAuthor = styled(Truncate)`
  font-size: 12px;
  line-height: 15px;
  color: ${(props: Theme) => props.theme.colors.secondary};
`;

interface SoundBadgeProps {
  author?: string;
  title?: string;
  cover?: string;
}

const SoundBadge = ({ author, title, cover }: SoundBadgeProps) => (
  <Container>
    <SongCover coverUrl={cover} />
    <TitleAndAuthor>
      <SongTitle>{title}</SongTitle>
      <SongAuthor>{author}</SongAuthor>
    </TitleAndAuthor>
  </Container>
);

export default SoundBadge;
