import { Box, Button, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router, { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/wrapper';
import { MeDocument, useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <>
      <Wrapper variant='small'>
        <Formik
          initialValues={{ newPassword: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({
              variables: {newPassword: values.newPassword,
              token:
                typeof router.query.token === 'string'
                  ? router.query.token
                  : '',
            },
            update: (cache, { data } ) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user
                }
              })
            }});
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              if ('token' in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name='newPassword'
                placeholder='new password'
                label='new password'
                type='password'
              />
              {tokenError ? <Box color='orange'> {tokenError}</Box> : null}
              <NextLink href='/forgot-password'>
                <Link>get a new token</Link>
              </NextLink>
              <Button
                mt='6'
                backgroundColor='whitesmoke'
                isLoading={isSubmitting}
                type='submit'
              >
                change password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default ChangePassword;
