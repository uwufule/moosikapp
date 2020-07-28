import styled from 'styled-components';
import { useState } from 'react';
import Form, { Input, SubmitButton } from '@components/Form';
import FlexCenterAlignment from '@components/FlexCenterAlignment';
import { Theme } from '@components/ThemeProvider';
import useRestriction from '../hooks/useRestriction';

const StyledInput = styled(Input)`
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

const Forgot = () => {
  const [email, setEmail] = useState('');

  const restriction = useRestriction();
  restriction.disallowAuthorizedUser();

  return (
    <FlexCenterAlignment>
      <Form
        title="Forgot"
        handler={() => {
          // request
        }}
      >
        <TextContainer>
          <p>To request a new password please enter your account email in the box below.</p>
          <p>We will send you an email with further instructions</p>
        </TextContainer>
        <StyledInput type="email" required handler={setEmail}>
          Email
        </StyledInput>
        <Footer>
          <SubmitButton>Request Password Change</SubmitButton>
        </Footer>
      </Form>
    </FlexCenterAlignment>
  );
};

export default Forgot;
