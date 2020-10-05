import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '@hooks/useRequest';
import useRestriction from '@hooks/useRestriction';
import useErrorHandler from '@hooks/useErrorHandler';
import Form, { Input, SubmitButton, Link } from '@components/Form';
import FlexCenterAlignment from '@components/FlexCenterAlignment';

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

  const handleError = useErrorHandler();

  const register = () => {
    handleError(async () => {
      if (password !== retryPassword) {
        throw new Error("Passwords doesn't match.");
      }

      await request('/register', {
        method: 'POST',
        data: { username, email, password },
      });

      router.push('/login');
    });
  };

  return (
    <FlexCenterAlignment>
      <Form title="Register" handler={register}>
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
