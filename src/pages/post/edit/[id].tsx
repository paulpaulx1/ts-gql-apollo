import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient'
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { useIsAuth } from '../../../utils/useIsAuth';
import createPost from '../../create-post';
import Id from '../[id]';

const EditPost = ({}) => {
    const router = useRouter();
    const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
    const [{data, fetching}] = useGetPostFromUrl()

    if (fetching) {
        return (
        <Layout>
            <>...loading</>
        </Layout>
        );
    }

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
        //   const { error } = await createPost({ input: values });
 console.log('debla la lal')
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='title' placeholder='title' label='title' />
            <Box mt='4'>
              <InputField
                name='text'
                placeholder='text'
                label='body'
                type='text'
                textarea={true}
              />
            </Box>
            <Button
              mt='6'
              backgroundColor='whitesmoke'
              isLoading={isSubmitting}
              type='submit'
            >
             update post
            </Button>{' '}
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(EditPost)