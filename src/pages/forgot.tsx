import styled from 'styled-components';
import { useState } from 'react';
import Form, {
  TextField, Button, TextFieldType,
} from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';
import { ThemeProps } from '../components/ThemeProvider';

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
    <CenteringComponent>
      <Form
        title="Forgot"
        handler={() => {}}
      >
        <Text>
          <p>To request a new password please enter your account email in the box below.</p>
          <p>We will send you an email with further instructions</p>
        </Text>
        <TextField type={TextFieldType.text} required handler={setEmail}>
          Email
        </TextField>
        <Footer>
          <Button caption="Request Password Change" />
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Forgot;
