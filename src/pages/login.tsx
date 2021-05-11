import React from 'react';
import { Form, Formik } from 'formik';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
} from '@chakra-ui/react';
import { Wrapper } from '../components/wrapper';
import { InputField } from '../components/InputField';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import NextLink from 'next/link';
import { withApollo } from '../utils/withApollo';

export const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [ login] = useLoginMutation();
  return (
    <Wrapper variant="small">
    <Formik
      initialValues={{ usernameOrEmail: "", password: "" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await login({
          variables: values,
          update: (cache, { data }) => {
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                __typename: "Query",
                me: data?.login.user,
              },
            });
            cache.evict({ fieldName: "posts:{}" });
          },
        });
        if (response.data?.login.errors) {
          setErrors(toErrorMap(response.data.login.errors));
        } else if (response.data?.login.user) {
          if (typeof router.query.next === "string") {
            router.push(router.query.next);
          } else {
            // worked
            router.push("/");
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField
            name="usernameOrEmail"
            placeholder="username or email"
            label="Username or Email"
          />
          <Box mt={4}>
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
          </Box>
          <Flex mt={2}>
            <NextLink href="/forgot-password">
              <Link ml="auto">forgot password?</Link>
            </NextLink>
          </Flex>
          <Button
            mt={4}
            type="submit"
            isLoading={isSubmitting}
     
          >
            login
          </Button>
        </Form>
      )}
    </Formik>
  </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);