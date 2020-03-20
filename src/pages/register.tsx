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
  justify-content: flex-end;
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retryPassword, SetRetryPassword] = useState('');

  return (
    <Center>
      <Form
        title="Register"
        handler={() => {}}
      >
        <TextField
          id="98808f14-0697-40b5-9985-a4aa40a618e1"
          type={TextFieldType.text}
          required
          caption="Username"
          handler={setUsername}
        />
        <TextField
          id="ad129357-dfaa-4028-9fa1-e65167c15691"
          type={TextFieldType.email}
          required
          caption="Email"
          handler={setEmail}
        />
        <TextField
          id="69359da4-f745-4290-b6dd-0e51e803ffb8"
          type={TextFieldType.password}
          required
          caption="Password"
          handler={setPassword}
        />
        <TextField
          id="71736e8e-a74a-4c00-85a6-513ee421d379"
          type={TextFieldType.password}
          required
          caption="Re-type password"
          handler={SetRetryPassword}
        />
        <Footer>
          <Link to="/login">Already have account?</Link>
          <Button style={{ marginLeft: '8px' }} caption="Register" />
        </Footer>
      </Form>
    </Center>
  );
};

export default Register;
