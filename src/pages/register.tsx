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

  return (
    <CenteringComponent>
      <Form
        title="Register"
        handler={() => {}}
      >
        <StyledTextField type={TextFieldType.text} required handler={setUsername}>
          Username
        </StyledTextField>
        <StyledTextField type={TextFieldType.email} required handler={setEmail}>
          Email
        </StyledTextField>
        <StyledTextField type={TextFieldType.password} required handler={setPassword}>
          Password
        </StyledTextField>
        <StyledTextField type={TextFieldType.password} required handler={SetRetryPassword}>
          Password again
        </StyledTextField>
        <Footer>
          <Link to="/login">Already have account?</Link>
          <StyledButton>Register</StyledButton>
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Register;
