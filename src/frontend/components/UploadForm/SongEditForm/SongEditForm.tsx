import { useState, useCallback, ChangeEvent } from 'react';
import styled from 'styled-components';
import useRequest from '@hooks/useRequest';
import { Theme } from '@components/ThemeProvider';
import CoverImage from './CoverImage';
import PickImageButton from './PickImageButton';
import Loader from './Loader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;

  @media (max-width: 640px) {
    & {
      flex-direction: column;
    }
  }
`;

const CoverImageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  max-width: 240px;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #cb5a52 15%, #313c44 100%);

  @media (max-width: 640px) {
    & {
      align-self: center;
    }
  }
`;

const EditTab = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  flex: 1;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: ${(props: Theme) => props.theme.colors.otherText};

  &:last-child {
    margin-bottom: 0;
  }
`;

const TextField = styled.input.attrs({ type: 'text' })`
  width: 100%;
  margin: 0;
  padding: 6px 8px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.colors.input.background};
  color: ${(props: Theme) => props.theme.colors.input.text};
  border: 1px solid ${(props: Theme) => props.theme.colors.input.border};
  border-radius: 0;
  outline: 0;
  transition: all ${(props: Theme) => props.theme.transition};

  &:focus {
    border-color: ${(props: Theme) => props.theme.colors.input.accent};
  }
`;

const FormButtons = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 20px 0;
  flex: 1;

  @media (max-width: 640px) {
    & {
      justify-content: center;
    }
  }
`;

const SaveButton = styled.button.attrs({ attrs: 'button' })`
  margin: 0;
  padding: 6px 12px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.colors.button.background};
  color: ${(props: Theme) => props.theme.colors.button.text};
  border: 0;
  border-radius: 0;
  outline: 0;
  cursor: pointer;
  transition: all ${(props: Theme) => props.theme.transition};

  &:hover {
    background: ${(props: Theme) => props.theme.colors.button.accent};
    box-shadow: 0 0 2px ${(props: Theme) => props.theme.colors.button.accent};
  }
`;

interface SongEditFormProps {
  songId: string;
}

const SongEditForm = ({ songId }: SongEditFormProps) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { authRequest } = useRequest();

  const onSave = useCallback(async () => {
    if (!author || !title) {
      return;
    }

    await authRequest(`/songs/${songId}`, { method: 'PUT', data: { author, title } });
  }, [author, title]);

  const onCoverUpdate = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.item(0);
    if (!image) {
      return;
    }

    if (!/image\/(png|jpeg)/.test(image.type)) {
      return;
    }

    if (image.size > 1024 * 1024) {
      return;
    }

    try {
      setIsLoading(true);
      setCover(image);

      await authRequest(`/songs/${songId}/cover`, { method: 'PUT', data: image });

      setIsLoading(false);
    } catch (e) {}
  };

  return (
    <Wrapper>
      <CoverImageContainer>
        {cover && <CoverImage imageUrl={URL.createObjectURL(cover)} blurred={isLoading} />}
        <PickImageButton onChange={onCoverUpdate} />
        {isLoading && <Loader />}
      </CoverImageContainer>
      <EditTab>
        <Label htmlFor="">
          <span>Author:</span>
          <TextField type="text" onChange={(event) => setAuthor(event.target.value)} />
        </Label>
        <Label htmlFor="">
          <span>Title:</span>
          <TextField type="text" onChange={(event) => setTitle(event.target.value)} />
        </Label>
        <FormButtons>
          <SaveButton onClick={onSave}>Save</SaveButton>
        </FormButtons>
      </EditTab>
    </Wrapper>
  );
};

export default SongEditForm;
