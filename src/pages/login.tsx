import styled from 'styled-components';
import { useState } from 'react';
import Form, {
  TextField, Link, Button, TextFieldType,
} from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';

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

  return (
    <CenteringComponent>
      <Form
        title="Login"
        handler={() => {}}
      >
        <StyledTextField type={TextFieldType.text} required handler={setUsername}>
          Username / Email
        </StyledTextField>
        <StyledTextField type={TextFieldType.password} required handler={setPassword}>
          Password
        </StyledTextField>
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
