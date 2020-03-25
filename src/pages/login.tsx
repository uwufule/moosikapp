import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Form, {
  TextInput, Link, Button, TextInputType,
} from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';
import login from '../utils/transport/login';
import { setTokenChain } from '../redux/actions/login';
import { RootState } from '../redux/store';

const StyledTextInput = styled(TextInput)`
  margin-bottom: 10px;

&:last-child {
  margin-bottom: 0;
}
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

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

const StyledButton = styled(Button)`
  margin-left: 8px;

  @media (max-width: 450px) {
    margin-left: 0;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const isLoggedIn = useSelector<RootState, boolean>((state) => state.login.accessToken !== '');
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  return (
    <CenteringComponent>
      <Form
        title="Login"
        handler={async () => {
          const res = await login(username, password);

          localStorage.setItem('refreshToken', res.refreshToken);
          dispatch(setTokenChain(res.accessToken, res.refreshToken));
          router.push('/');
        }}
      >
        <StyledTextInput type={TextInputType.text} required handler={setUsername}>
          Username / Email
        </StyledTextInput>
        <StyledTextInput type={TextInputType.password} required handler={setPassword}>
          Password
        </StyledTextInput>
        <Footer>
          <Link to="/forgot">Forgot your password?</Link>
          <div>
            <Link to="/register">Need an account?</Link>
            <StyledButton>Login</StyledButton>
          </div>
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Login;
