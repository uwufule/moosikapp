import styled from 'styled-components';
import { useState } from 'react';
import Form, {
  TextField, Link, Button, TextFieldType,
} from '../components/Form';

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Center>
      <Form
        title="Login"
        handler={() => {}}
      >
        <TextField
          id="3d3c8400-2066-43db-97f4-cec0de372a31"
          type={TextFieldType.text}
          required
          caption="Username"
          handler={setUsername}
        />
        <TextField
          id="e83a7542-fa81-47c8-b94c-de354522852b"
          type={TextFieldType.password}
          required
          caption="Password"
          handler={setPassword}
        />
        <Footer>
          <Link to="/forgot">Forgot your password?</Link>
          <div>
            <Link to="/register">Need an account?</Link>
            <Button style={{ marginLeft: '8px' }} caption="Login" />
          </div>
        </Footer>
      </Form>
    </Center>
  );
};

export default Login;
