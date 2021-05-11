import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../utils/createUrqlClient';
import React from 'react'
import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql';
import { Layout } from '../../components/Layout';
import { Heading } from '@chakra-ui/react';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

export const Post = ({}) => {
    const router = useRouter();
    // console.log(router.query)

    const {data, error, loading} = useGetPostFromUrl()
    if (error) {
        return error.message
    }
    if (loading) {
        return(
            <Layout>
                <>...loading....</>
            </Layout>
        )
    }

    if (!data?.post) {
        return (
            <Layout>
                <>could not find post </>
            </Layout>
        )
    }
    return (
        <Layout>
            <Heading>{data?.post?.title}</Heading>
            {data?.post?.text}
        </Layout>
    )
}

export default withApollo({ ssr: true })(Post);
