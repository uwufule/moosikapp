import styled from 'styled-components';
import { useState } from 'react';
import Form, {
  TextField, Link, Button, TextFieldType,
} from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const RegisterButton = styled(Button)`
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

  return (
    <CenteringComponent>
      <Form
        title="Register"
        handler={() => {}}
      >
        <TextField type={TextFieldType.text} required handler={setUsername}>
          Username
        </TextField>
        <TextField type={TextFieldType.email} required handler={setEmail}>
          Email
        </TextField>
        <TextField type={TextFieldType.password} required handler={setPassword}>
          Password
        </TextField>
        <TextField type={TextFieldType.password} required handler={SetRetryPassword}>
          Re-type password
        </TextField>
        <Footer>
          <Link to="/login">Already have account?</Link>
          <RegisterButton caption="Register" />
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Register;
