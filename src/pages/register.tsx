import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Form, {
  TextInput, Link, Button, TextInputType,
} from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';
import registerNewAccount from '../utils/transport/registerNewAccount';
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
`;

const StyledButton = styled(Button)`
  margin-left: 8px;

  @media (max-width: 450px) {
    margin-left: 0;
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retryPassword, SetRetryPassword] = useState('');

  const router = useRouter();

  const isLoggedIn = useSelector<RootState, boolean>((state) => state.login.accessToken !== '');

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  return (
    <CenteringComponent>
      <Form
        title="Register"
        handler={async () => {
          // validation
          if (password !== retryPassword) {
            console.log('Passwords don\'t match.');
            return;
          }

          try {
            await registerNewAccount(username, email, password);

            // message 'successfully registered new account. redirect to login page'

            router.push('/login');
          } catch (e) {
            // error message
            console.log('error:', e.response.data);
          }
        }}
      >
        <StyledTextInput type={TextInputType.text} required handler={setUsername}>
          Username
        </StyledTextInput>
        <StyledTextInput type={TextInputType.email} required handler={setEmail}>
          Email
        </StyledTextInput>
        <StyledTextInput type={TextInputType.password} required handler={setPassword}>
          Password
        </StyledTextInput>
        <StyledTextInput type={TextInputType.password} required handler={SetRetryPassword}>
          Password again
        </StyledTextInput>
        <Footer>
          <Link to="/login">Already have account?</Link>
          <StyledButton>Register</StyledButton>
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Register;
