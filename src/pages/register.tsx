import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Wrapper } from '../components/wrapper';
import { InputField } from '../components/InputField';
// import { useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
interface registerProps {}

// const REGISTER_MUT = `mutation Register($username: String!, $password:String!) {
//     register(options: { username: $username, password: $password }) {
//       errors {
//         field
//         message
//       }
//       user {
//         id
//         username
//       }
//     }
//   }`

export const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter()
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({options: values});
          if (response.data?.register.errors) {
            console.log(response.data.register.errors)
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
              router.push('/login')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='username'
              label='Username'
            />
            <Box mt='4'>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>
            <Box mt='4'>
              <InputField
                name='email'
                placeholder='email'
                label='email'
                type="email"
              />
            </Box>
            <Button
              mt='6'
              backgroundColor='whitesmoke'
              isLoading={isSubmitting}
              type='submit'
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
