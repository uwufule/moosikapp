import { useState, useCallback } from 'react';
import styled from 'styled-components';
import useRequest from '@hooks/useRequest';
import useErrorHandler from '@hooks/useErrorHandler';
import { Theme } from '@components/ThemeProvider';
import Input from './Input';
import CoverImage from './CoverImage';

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

  const { authRequest } = useRequest();

  const handleError = useErrorHandler();

  const onSave = useCallback(() => {
    handleError(async () => {
      if (!author || !title) {
        throw new Error('No title or author.');
      }

      await authRequest(`/songs/${songId}`, { method: 'PUT', data: { author, title } });
    });
  }, [author, title]);

  return (
    <Wrapper>
      <CoverImage songId={songId} />
      <EditTab>
        <Input title="Author:" onChange={(event) => setAuthor(event.target.value)} />
        <Input title="Title:" onChange={(event) => setTitle(event.target.value)} />
        <FormButtons>
          <SaveButton onClick={onSave}>Save</SaveButton>
        </FormButtons>
      </EditTab>
    </Wrapper>
  );
};

export default SongEditForm;
