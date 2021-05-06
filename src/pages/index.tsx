import { NavBar } from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <> you got no data </>;
  }
  return (
    <>
      <Layout>
        <Flex>
          <Heading>phReddit</Heading>
          <NextLink href='/create-post'>
            <Link ml={'auto'}>create post </Link>
          </NextLink>
        </Flex>
        <br />
        {fetching && !data ? (
          <>loading...</>
        ) : (
          <Stack spacing={8}>
            {data?.posts.posts.map((p) => (
              <Box key={p.id} p={5} shadow='md' borderWidth='1px'>
                <Heading fontSize='xl'>{p.title}</Heading><Text>posted by</Text>{p.creator.username}
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                console.log(data.posts.hasMore)
                setVariables({
                  limit: variables.limit,
                  cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              mx='auto'
              my={4}
            >
              more posts
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
