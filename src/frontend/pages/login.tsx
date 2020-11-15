import FlexCenterAlignment from '@components/FlexCenterAlignment';
import Form, { Link, Submit, TextField } from '@components/Form';
import useRestriction from '@hooks/useRestriction';
import { login } from '@redux/auth/actions';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ForgotLinkContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 7px 0;
`;

const ButtonAndLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 450px) {
    & {
      flex-direction: column;
      align-items: unset;
    }
  }
`;

const StyledSubmit = styled(Submit)`
  margin-left: 16px;

  @media (max-width: 450px) {
    margin-left: 0;
  }
`;

const Login: React.FC = () => {
  const restriction = useRestriction();
  restriction.forbidAuth();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const dispatch = useDispatch();

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    dispatch(login({ username, password }));
  };

  return (
    <FlexCenterAlignment>
      <Form title="Login" onSubmit={handleSubmit}>
        <StyledTextField
          required
          autoFocus
          placeholder="Username / Email"
          type="text"
          onChange={handleChangeUsername}
        />
        <StyledTextField
          required
          placeholder="Password"
          type="password"
          onChange={handleChangePassword}
        />
        <Footer>
          <ForgotLinkContainer>
            <Link to="/forgot">Forgot your password?</Link>
          </ForgotLinkContainer>
          <ButtonAndLinkContainer>
            <Link to="/signup">Need an account?</Link>
            <StyledSubmit>Login</StyledSubmit>
          </ButtonAndLinkContainer>
        </Footer>
      </Form>
    </FlexCenterAlignment>
  );
};

export default Login;
