import FlexCenterAlignment from '@components/FlexCenterAlignment';
import Form, { Submit, TextField } from '@components/Form';
import { Theme } from '@components/ThemeProvider';
import useRestriction from '@hooks/useRestriction';
import React from 'react';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TextContainer = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  color: ${(props: Theme) => props.theme.text.secondary};
  text-shadow: ${(props: Theme) => props.theme.shadow.long};

  & > p {
    margin: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Forgot: React.FC = () => {
  const restriction = useRestriction();
  restriction.forbidAuth();

  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {};

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <FlexCenterAlignment>
      <Form title="Forgot" onSubmit={handleSubmit}>
        <TextContainer>
          <p>To request a new password please enter your account email in the box below.</p>
          <p>We will send you an email with further instructions</p>
        </TextContainer>
        <StyledTextField
          required
          autoFocus
          placeholder="Email"
          type="email"
          onChange={handleChangeEmail}
        />
        <Footer>
          <Submit>Request Password Change</Submit>
        </Footer>
      </Form>
    </FlexCenterAlignment>
  );
};

export default Forgot;
