import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Maybe } from 'yup/lib/types';
import axios from 'axios';
import * as songsApi from '../../core/services/api/songs';
import { selectAccessToken } from '../../redux/auth/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { pushAlert } from '../../redux/alert/actions';

const SongEditContainer = styled.div`
  display: flex;
  flex: 1;
`;

interface CoverBoxProps {
  url: Maybe<string>;
}

const CoverBox = styled.div.attrs((props: CoverBoxProps) => ({
  style: { backgroundImage: props.url ? `url(${props.url})` : undefined },
}))<CoverBoxProps>`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 260px;
  height: 260px;
  box-sizing: border-box;
  padding: 1rem;
  background: #1d1f2b no-repeat center center;
  background-size: cover;
`;

const ChooseCoverButtonContainer = styled.label`
  position: relative;
  padding: 0.525rem 0.725rem;
  font-family: inherit;
  font-size: 0.825rem;
  line-height: 1.5;
  background: #262838;
  color: #c7ccd8;
  border: 1px solid #0000;
  outline: 0 solid #0000;
  border-radius: 2px;
  box-shadow: 0 0 2px #000;
  cursor: pointer;
  transition: 200ms ease all;

  &:hover {
    background: #4f82d1;
    color: #fff;
  }
`;

const ChooseCoverButtonInput = styled.input.attrs({
  type: 'file',
  accept: 'image/jpeg, image/png',
})`
  display: none;
  position: fixed;
`;

const SongEditCover: React.FC<{ songId: string }> = ({ songId }) => {
  const [image, setImage] = useState<Maybe<File>>(null);

  const accessToken = useSelector(selectAccessToken);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!image) {
      return;
    }

    const updateCoverImage = async () => {
      try {
        await songsApi.updateSongCover(accessToken, songId, image);
        dispatch(pushAlert('Successfully updated song cover', 'info'));
      } catch (e) {
        dispatch(pushAlert(e.message, 'error'));
      }
    };

    updateCoverImage();
  }, [image]);

  const id = 'choose-cover-button';

  return (
    <CoverBox url={image ? URL.createObjectURL(image) : undefined}>
      <ChooseCoverButtonContainer htmlFor={id}>
        <ChooseCoverButtonInput id={id} onChange={(event) => setImage(event.target.files?.[0])} />
        <span>Upload image</span>
      </ChooseCoverButtonContainer>
    </CoverBox>
  );
};

const SongEditFields = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  flex: 1;
`;

const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  color: #fff;
  margin-bottom: 1rem;

  :last-child {
    margin-bottom: 0;
  }
`;

const InputLabelText = styled.span`
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.625rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  background: #262838;
  color: #8898aa;
  border: 1px solid transparent;
  outline: 0 solid transparent;
  border-radius: 5px;
  transition: 200ms ease all;

  :focus {
    border-color: #4f82d1;
  }
`;

const TextField: React.FC<{
  title: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}> = ({ title, defaultValue, onChange }) => {
  const id = title.toLowerCase();

  return (
    <InputLabel htmlFor={id}>
      <InputLabelText>{title}</InputLabelText>
      <Input
        id={id}
        defaultValue={defaultValue}
        onChange={(event) => onChange(event.target.value)}
      />
    </InputLabel>
  );
};

const SongEditFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex: 1;
`;

const Submit = styled.button.attrs({ type: 'submit' })`
  padding: 0.625rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  background: #262838;
  color: #8898aa;
  border: 1px solid #0000;
  outline: 0 solid #0000;
  border-radius: 5px;
  cursor: pointer;
  transition: 200ms ease all;

  :hover {
    background: #4f82d1;
    color: #fff;
  }
`;

const SongEditForm: React.FC<{ songId: string; songAuthor?: string; songTitle?: string }> = ({
  songId,
  songAuthor,
  songTitle,
}) => {
  const [author, setAuthor] = useState<string | undefined>(songAuthor);
  const [title, setTitle] = useState<string | undefined>(songTitle);

  const accessToken = useSelector(selectAccessToken);

  const dispatch = useDispatch();

  const updateSongData = async () => {
    try {
      await songsApi.updateSong(accessToken, songId, { author, title });
      dispatch(pushAlert('Successfully updated song', 'info'));
    } catch (e) {
      dispatch(pushAlert(e.message, 'error'));
    }
  };

  return (
    <SongEditContainer>
      <SongEditCover songId={songId} />
      <SongEditFields>
        <TextField title="Author" defaultValue={songAuthor} onChange={setAuthor} />
        <TextField title="Title" defaultValue={songTitle} onChange={setTitle} />
        <SongEditFormFooter>
          <Submit onClick={updateSongData}>Save</Submit>
        </SongEditFormFooter>
      </SongEditFields>
    </SongEditContainer>
  );
};

export default SongEditForm;
