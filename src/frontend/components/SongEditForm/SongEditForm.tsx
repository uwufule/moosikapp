import { Theme } from '@components/ThemeProvider';
import useUpdateSong from '@hooks/useUpdateSong';
import { showErrorMessage } from '@redux/modal/actions';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import CoverImage from './CoverImage';
import TextField from './TextField';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 8px 16px 0 16px;

  @media (max-width: 640px) {
    & {
      flex-direction: column;
    }
  }
`;

const EditTab = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 16px;
  flex: 1;

  @media (max-width: 640px) {
    & {
      margin-top: 8px;
    }
  }
`;

const FormFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 16px 0;

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
  const [author, setAuthor] = React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');

  const dispatch = useDispatch();

  const methods = useUpdateSong();

  const onAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onSave = React.useCallback(async () => {
    try {
      await methods.update(songId, { author, title });
    } catch (e) {
      dispatch(showErrorMessage(e.message));
    }
  }, [author, title]);

  return (
    <Wrapper>
      <CoverImage songId={songId} />
      <EditTab>
        <div>
          <TextField title="Author:" onChange={onAuthorChange} />
          <TextField title="Title:" onChange={onTitleChange} />
        </div>
        <FormFooter>
          <SaveButton onClick={onSave}>Save</SaveButton>
        </FormFooter>
      </EditTab>
    </Wrapper>
  );
};

export default SongEditForm;
