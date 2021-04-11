import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Form, FormField, FormFooter, FormHeader, FormLink, Submit } from '../components/Form';
import Layout from '../components/Layout';
import { pushAlert } from '../redux/alert/actions';
import { signin } from '../redux/auth/actions';
import { selectIsAuthorized } from '../redux/auth/selectors';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username required'),
  password: Yup.string().required('Password required'),
});

const Signin: React.FC = () => {
  const isAuthorized = useSelector(selectIsAuthorized);

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    if (isAuthorized) {
      router.push(typeof router.query.from === 'string' ? router.query.from : '/');
    }
  }, [isAuthorized]);

  return (
    <Layout isAuthPage>
      <Formik
        initialValues={{ username: '', password: '' }}
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
        onSubmit={({ username, password }) => {
          dispatch(signin(username, password));
        }}
      >
        <Form>
          <FormHeader>Login</FormHeader>
          <div>
            <FormField name="username" type="text" placeholder="Username" autoComplete="off" />
            <FormField name="password" type="password" placeholder="Password" />
          </div>
          <FormFooter>
            <FormLink href="/signup">Create account</FormLink>
            <Submit>Login</Submit>
          </FormFooter>
        </Form>
      </Formik>
    </Layout>
  );
};

export default Signin;
