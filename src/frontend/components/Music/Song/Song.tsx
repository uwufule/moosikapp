import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';
import PlayPauseButton from './Controls/PlayPause';
import EditButton from './Controls/Edit';
import FavButton from './Controls/Fav';

const StyledPlayPauseButton = styled(PlayPauseButton)`
  @media (min-width: 960px) {
    & {
      opacity: 0;
      transition: opacity ${(props: Theme) => props.theme.transition};
    }
  }
`;

const StyledEditButton = styled(EditButton)`
  @media (min-width: 960px) {
    & {
      opacity: .7;
      transition: all ${(props: Theme) => props.theme.transition};
    }
  }
`;

const StyledFavButton = styled(FavButton)`
  @media (min-width: 960px) {
    & {
      opacity: .7;
      transition: all ${(props: Theme) => props.theme.transition};
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

   @media (min-width: 960px) {
     & {
       transition: all ${(props: Theme) => props.theme.transition};
     }

     &:hover {
       background: ${(props: Theme) => props.theme.colors.accentBackground};
     }

     &:hover ${StyledPlayPauseButton},
     &:hover ${StyledEditButton},
     &:hover ${StyledFavButton} {
       opacity: 1;
     }
   }
`;

type CoverProps = Theme<{ url: string }>;

const Cover = styled.div<CoverProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  position: relative;
  background: ${(props) => (
    props.url ? `url(${props.url})` : props.theme.colors.cover.background
  )} 50% no-repeat;
  background-size: cover;
`;

const DefaultCover = styled.svg.attrs({ viewBox: '0 0 24 24' })`
  width: 32px;
  height: 32px;
  fill: ${(props: Theme) => props.theme.colors.cover.foreground};
`;

const TitleAndAuthor = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
`;

const Title = styled.span`
  font-size: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${(props: Theme) => props.theme.colors.primary};
`;

const Author = styled.span`
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${(props: Theme) => props.theme.colors.secondary};
`;

const ControlsGroup = styled.div`
  display: flex;
`;

interface SongProps {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

const Song = ({
  uuid, author, title, cover, favorite = true, edit,
}: SongProps) => (
  <Wrapper>
    <Cover url={cover}>
      {!cover && (
        <DefaultCover>
          <path
            d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21
              10.5,21C13,21 15,19 15,16.5V6H19V3H12Z"
          />
        </DefaultCover>
      )}
      <StyledPlayPauseButton songUuid={uuid} />
    </Cover>
    <TitleAndAuthor>
      <Title>{title}</Title>
      <Author>{author}</Author>
    </TitleAndAuthor>
    <ControlsGroup>
      {edit && <StyledEditButton />}
      <StyledFavButton isFav={favorite} />
    </ControlsGroup>
  </Wrapper>
);

export default Song;
