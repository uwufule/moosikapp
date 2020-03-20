import styled from 'styled-components';
import { useState } from 'react';
import Form, {
  TextField, Link, Button, TextFieldType,
} from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';

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

const LoginButton = styled(Button)`
  margin-left: 8px;

  @media (max-width: 450px) {
    margin-left: 0;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <CenteringComponent>
      <Form
        title="Login"
        handler={() => {}}
      >
        <TextField type={TextFieldType.text} required handler={setUsername}>
          Username
        </TextField>
        <TextField type={TextFieldType.password} required handler={setPassword}>
          Password
        </TextField>
        <Footer>
          <Link to="/forgot">Forgot your password?</Link>
          <div>
            <Link to="/register">Need an account?</Link>
            <LoginButton caption="Login" />
          </div>
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Login;
