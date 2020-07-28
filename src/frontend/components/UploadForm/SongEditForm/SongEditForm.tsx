import { useState, useCallback, ChangeEvent } from 'react';
import styled from 'styled-components';
import useRequest from '@hooks/useRequest';
import { Theme } from '@components/ThemeProvider';
import CoverImage, { CoverImageContainer } from './CoverImage';
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

const EditTab = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  flex: 1;

  @media (max-width: 640px) {
    & {
      margin-top: 8px;
    }
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: ${(props: Theme) => props.theme.uploadForm.editForm.text};

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
  background: ${(props: Theme) => props.theme.uploadForm.editForm.input.background};
  color: ${(props: Theme) => props.theme.uploadForm.editForm.input.text};
  border: 1px solid ${(props: Theme) => props.theme.uploadForm.editForm.input.border.inactive};
  border-radius: 0;
  outline: 0;
  transition: all ${(props: Theme) => props.theme.transition};

  &:focus {
    border-color: ${(props: Theme) => props.theme.uploadForm.editForm.input.border.active};
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
  background: ${(props: Theme) => props.theme.uploadForm.editForm.saveButton.background.inactive};
  color: ${(props: Theme) => props.theme.uploadForm.editForm.saveButton.text};
  border: 0;
  border-radius: 0;
  outline: 0;
  cursor: pointer;
  transition: all ${(props: Theme) => props.theme.transition};

  &:hover {
    background: ${(props: Theme) => props.theme.uploadForm.editForm.saveButton.background.active};
  }
`;

interface SongEditFormProps {
  songId: string;
}

const SongEditForm = ({ songId }: SongEditFormProps) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [isCoverLoading, setIsCoverLoading] = useState(false);

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
      setIsCoverLoading(true);
      setCover(image);

      await authRequest(`/songs/${songId}/cover`, { method: 'PUT', data: image });

      setIsCoverLoading(false);
    } catch (e) {
      // e.response.data.message
    }
  };

  return (
    <Wrapper>
      <CoverImageContainer>
        {cover && <CoverImage imageUrl={URL.createObjectURL(cover)} blurred={isCoverLoading} />}
        <PickImageButton onChange={onCoverUpdate} />
        {isCoverLoading && <Loader />}
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
