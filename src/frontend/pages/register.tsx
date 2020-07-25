import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '@hooks/useRequest';
import Form, { Input, SubmitButton, Link } from '@components/Form';
import FlexCenterAlignment from '@components/FlexCenterAlignment';
import useRestriction from '../hooks/useRestriction';

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

  const router = useRouter();

  const restriction = useRestriction();
  restriction.disallowAuthorizedUser();

  const { request } = useRequest();

  return (
    <FlexCenterAlignment>
      <Form
        title="Register"
        handler={async () => {
          // validation ...
          if (password !== retryPassword) {
            return;
          }

          try {
            await request('/register', {
              method: 'POST',
              data: {
                username,
                email,
                password,
              },
            });

            // message 'successfully registered new account. redirect to login page'

            router.push('/login');
          } catch (e) {
            // error message (e.response.data)
          }
        }}
      >
        <StyledInput type="text" required handler={setUsername}>
          Username
        </StyledInput>
        <StyledInput type="email" required handler={setEmail}>
          Email
        </StyledInput>
        <StyledInput type="password" required handler={setPassword}>
          Password
        </StyledInput>
        <StyledInput type="password" required handler={SetRetryPassword}>
          Password again
        </StyledInput>
        <Footer>
          <Link to="/login">Already have account?</Link>
          <StyledSubmitButton>Register</StyledSubmitButton>
        </Footer>
      </Form>
    </FlexCenterAlignment>
  );
};

export default Register;
