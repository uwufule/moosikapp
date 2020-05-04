import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useRestriction from '../hooks/useRestriction';
import useRequest from '../hooks/useRequest';
import Form, {
  Input, InputType, SubmitButton, Link,
} from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';

const StyledInput = styled(Input)`
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

const StyledSubmitButton = styled(SubmitButton)`
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

  const restriction = useRestriction();
  restriction.disallowAuthorizedUser();

  const request = useRequest();

  const router = useRouter();

  return (
    <CenteringComponent>
      <Form
        title="Register"
        handler={async () => {
          // validation ...
          if (password !== retryPassword) {
            return;
          }

          try {
            await request(
              '/register',
              {
                method: 'POST',
                data: {
                  username, email, password,
                },
              },
            );

            // message 'successfully registered new account. redirect to login page'

            router.push('/login');
          } catch (e) {
            // error message (e.response.data)
          }
        }}
      >
        <StyledInput type={InputType.text} required handler={setUsername}>
          Username
        </StyledInput>
        <StyledInput type={InputType.email} required handler={setEmail}>
          Email
        </StyledInput>
        <StyledInput type={InputType.password} required handler={setPassword}>
          Password
        </StyledInput>
        <StyledInput type={InputType.password} required handler={SetRetryPassword}>
          Password again
        </StyledInput>
        <Footer>
          <Link to="/login">Already have account?</Link>
          <StyledSubmitButton>Register</StyledSubmitButton>
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Register;
