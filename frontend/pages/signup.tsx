import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Form, FormField, FormFooter, FormHeader, FormLink, Submit } from '../components/Form';
import Layout from '../components/Layout';
import { pushAlert } from '../redux/alert/actions';
import { resetSignupSuccessStatus, signup } from '../redux/auth/actions';
import { selectSignupSuccessStatus } from '../redux/auth/selectors';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username required'),
  email: Yup.string().required('Email required'),
  password1: Yup.string()
    .required('Password required')
    .min(8, 'Password must be at least 8 characters'),
  password2: Yup.string()
    .required('Re-type password')
    .oneOf([Yup.ref('password1')], "Passwords didn't match"),
});

const Signup: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const signupSuccessStatus = useSelector(selectSignupSuccessStatus);
  if (signupSuccessStatus) {
    router.push('/login');
    dispatch(resetSignupSuccessStatus());
  }

  return (
    <Layout isAuthPage>
      <Formik
        initialValues={{ username: '', email: '', password1: '', password2: '' }}
        validateOnMount={false}
        validateOnChange={false}
        validateOnBlur={false}
        validate={async (values) => {
          try {
            await validationSchema.validate(values, { abortEarly: false });
          } catch (e) {
            dispatch(pushAlert(e.errors[0], 'error'));
            return e.errors;
          }
        }}
        onSubmit={({ username, email, password1 }) => {
          dispatch(signup(username, email, password1));
        }}
      >
        <Form>
          <FormHeader>Create account</FormHeader>
          <div>
            <FormField name="username" type="text" placeholder="Username" autoComplete="off" />
            <FormField name="email" type="text" placeholder="Email" autoComplete="off" />
            <FormField name="password1" type="password" placeholder="Password" />
            <FormField name="password2" type="password" placeholder="Password again" />
          </div>
          <FormFooter>
            <FormLink href="/signin">Back to login</FormLink>
            <Submit>Create account</Submit>
          </FormFooter>
        </Form>
      </Formik>
    </Layout>
  );
};

export default Signup;
