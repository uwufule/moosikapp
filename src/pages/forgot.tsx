import styled from 'styled-components';
import { useState } from 'react';
import useWithoutAuthorization from '../hooks/useWithoutAuthorization';
import Form, { TextInput, Button, TextInputType } from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';
import { Theme } from '../components/ThemeProvider';

const StyledTextInput = styled(TextInput)`
  margin-bottom: 10px;

&:last-child {
  margin-bottom: 0;
}
`;

const Text = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  color: ${(props: Theme) => props.theme.colors.lightGray};
  text-shadow: ${(props: Theme) => props.theme.shadow};
  
  &>p {
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

  useWithoutAuthorization();

  return (
    <CenteringComponent>
      <Form
        title="Forgot"
        handler={() => {}}
      >
        <Text>
          <p>To request a new password please enter your account email in the box below.</p>
          <p>We will send you an email with further instructions</p>
        </Text>
        <StyledTextInput type={TextInputType.text} required handler={setEmail}>
          Email
        </StyledTextInput>
        <Footer>
          <Button>Request Password Change</Button>
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Forgot;
