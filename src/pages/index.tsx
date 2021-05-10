import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { UpvoteSection } from '../components/UpvoteSection';
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
  data ? console.log(data.posts.posts[0]) : null;
  return (
    <>
      <Layout>
        <Flex>
          {/* <Heading ml='2'>Phreddit</Heading> */}
          <NextLink href='/create-post'>
            <Link ml={'auto'} mr='2'>
              create post{' '}
            </Link>
          </NextLink>
        </Flex>
        <br />
        {fetching && !data ? (
          <>loading...</>
        ) : (
          <Stack spacing={8}>
            {data?.posts.posts.map((p) => (
              <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
                <UpvoteSection post={p} />
                <Box>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                  <Heading fontSize='xl'>{p.title}</Heading>
                  </Link></NextLink>
                  <Text>posted by: {p.creator.username}</Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
