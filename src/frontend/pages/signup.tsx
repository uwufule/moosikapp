import FlexCenterAlignment from '@components/FlexCenterAlignment';
import Form, { Link, Submit, TextField } from '@components/Form';
import useRestriction from '@hooks/useRestriction';
import useSignupReducer, { SignupActionType } from '@hooks/useSignupReducer';
import { resetSignupSuccessStatus, signup } from '@redux/auth/actions';
import { selectSignupSuccessStatus } from '@redux/auth/selectors';
import { showErrorMessage } from '@redux/modal/actions';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSubmit = styled(Submit)`
  margin-left: 8px;

  @media (max-width: 450px) {
    margin-left: 0;
  }
`;

const Signup: React.FC = () => {
  const restriction = useRestriction();
  restriction.forbidAuth();

  const router = useRouter();

  const dispatch = useDispatch();

  const signupSuccessStatus = useSelector(selectSignupSuccessStatus);
  if (signupSuccessStatus) {
    router.push('/login');
    dispatch(resetSignupSuccessStatus());
  }

  const [signupState, signupDispatch] = useSignupReducer();

  const handleSubmit = () => {
    const { username, email, password, passwordAgain } = signupState;
    if (!username || !email || !password || !passwordAgain) {
      throw new Error('Please fill the 4 fields before attempting to register.');
    }

    if (password !== passwordAgain) {
      dispatch(showErrorMessage('Make sure both passwords match.'));
      return;
    }

    dispatch(signup({ username, email, password }));
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    signupDispatch({ type: SignupActionType.SET_USERNAME, payload: event.target.value });
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    signupDispatch({ type: SignupActionType.SET_EMAIL, payload: event.target.value });
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    signupDispatch({ type: SignupActionType.SET_PASSWORD, payload: event.target.value });
  };

  const handleChangePasswordAgain = (event: React.ChangeEvent<HTMLInputElement>) => {
    signupDispatch({ type: SignupActionType.SET_PASSWORD_AGAIN, payload: event.target.value });
  };

  return (
    <FlexCenterAlignment>
      <Form title="Register" onSubmit={handleSubmit}>
        <StyledTextField
          required
          autoFocus
          placeholder="Username"
          type="text"
          onChange={handleChangeUsername}
        />
        <StyledTextField required placeholder="Email" type="email" onChange={handleChangeEmail} />
        <StyledTextField
          required
          placeholder="Password"
          type="password"
          onChange={handleChangePassword}
        />
        <StyledTextField
          required
          placeholder="Password again"
          type="password"
          onChange={handleChangePasswordAgain}
        />
        <Footer>
          <Link to="/login">Already have account?</Link>
          <StyledSubmit>Register</StyledSubmit>
        </Footer>
      </Form>
    </FlexCenterAlignment>
  );
};

export default Signup;
