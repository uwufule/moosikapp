import styled from 'styled-components';
import { useState } from 'react';
import Form, {
  TextField, Button, TextFieldType,
} from '../components/Form';
import { ThemeProps } from '../components/ThemeProvider';

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Text = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.colors.lightGray};
  text-shadow: ${(props: ThemeProps) => props.theme.shadow};
  
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

  return (
    <Center>
      <Form
        title="Forgot"
        handler={() => {}}
      >
        <Text>
          <p>To request a new password please enter your account email in the box below.</p>
          <p>We will send you an email with further instructions</p>
        </Text>
        <TextField
          id="7d5ba82e-0e87-44ae-8541-bcb9a460d347"
          type={TextFieldType.text}
          required
          caption="Email"
          handler={setEmail}
        />
        <Footer>
          <Button caption="Request Password Change" />
        </Footer>
      </Form>
    </Center>
  );
};

export default Forgot;
