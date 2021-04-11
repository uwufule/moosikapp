import { Field, Form as FormikForm } from 'formik';
import Link from 'next/link';
import React, { InputHTMLAttributes, PropsWithChildren } from 'react';
import styled from 'styled-components';

export const Form = styled(FormikForm)`
  width: 300px;

  @media (max-width: 300px) {
    width: 100%;
  }
`;

export const FormHeader = styled.h1`
  margin: 0 0 1rem 0;
  color: #fff;
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;

  :last-child {
    margin-bottom: 0;
  }
`;

const Input = styled(Field)`
  padding: 0.625rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  background: #262838;
  color: #8898aa;
  border: 1px solid transparent;
  outline: 0 solid transparent;
  border-radius: 5px;
  transition: 200ms ease all;

  :focus {
    box-shadow: #4f82d1 0px 0px 5px;
  }
`;

export const FormField: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <InputLabel htmlFor={props.name}>
      <Input id={props.name} {...props} />
    </InputLabel>
  );
};

export const Submit = styled.button.attrs({ type: 'submit' })`
  padding: 0.625rem 1.25rem;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  background: #262838;
  color: #c7ccd8;
  border: 1px solid transparent;
  outline: 0 solid transparent;
  border-radius: 5px;
  cursor: pointer;
  transition: 200ms ease all;

  :focus {
    box-shadow: #4f82d1 0px 0px 5px;
  }

  @media not screen and (pointer: coarse) {
    :hover {
      background: #4f82d1;
      color: #fff;
    }
  }

  @media only screen and (hover: none) and (pointer: coarse) {
    :active {
      background: #4f82d1;
      color: #fff;
    }
  }
`;

const Anchor = styled.a`
  margin-right: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #c7ccd8;
  text-decoration: none;
  outline: none;
  transition: 200ms ease all;

  :hover {
    color: #fff;
  }

  :focus {
    text-decoration: underline;
  }
`;

export const FormLink: React.FC<PropsWithChildren<{ href: string }>> = (props) => (
  <Link href={props.href} passHref>
    <Anchor {...props} />
  </Link>
);
