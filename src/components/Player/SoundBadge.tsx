import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

const Container = styled.div`
  display: flex;
  width: 256px;
  margin-left: 10px;
`;

type SongCoverProps = ThemeProps<{ coverUrl?: string }>;

const SongCover = styled.div<SongCoverProps>`
  width: 32px;
  height: 32px;
  background: ${(props: SongCoverProps) => (
    props.coverUrl
      ? `url(${props.coverUrl}) center no-repeat`
      : props.theme.colors.lightGray
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
  color: ${(props: ThemeProps) => props.theme.colors.dark};
`;

const SongAuthor = styled(Truncate)`
  font-size: 12px;
  line-height: 15px;
  color: ${(props: ThemeProps) => props.theme.colors.darkGray};
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
