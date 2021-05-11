import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useDeletePostMutation, useMeQuery, usePostsQuery } from '../generated/graphql';
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
  const [, deletePost] = useDeletePostMutation();
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{data: meData}] = useMeQuery()
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <> {error?.message} </>;
  }
  // data ? console.log(data.posts.posts[0]) : null;
  return (
    <>
      <Layout>
        <Flex>{/* <Heading ml='2'>Phreddit</Heading> */}</Flex>
        <br />
        {fetching && !data ? (
          <>loading...</>
        ) : (
          <Stack spacing={8}>
            {data?.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
                  <UpvoteSection post={p} />
                  <Box flex={1}>
                    <NextLink href='/post/[id]' as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize='xl'>{p.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text>posted by: {p.creator.username}</Text>
                   
                    <Flex>
                      <Text flex={1} mt={4}>
                        {p.textSnippet}
                      </Text> 
                      {meData?.me?.id !== p.creator.id ? null :
                      <Box ml='auto'>
                        <Button
                          ml='auto'
                          onClick={() => deletePost({ id: p.id })}
                        >
                          delete
                        </Button>
                        <NextLink
                          href='/post/edit/[id]'
                          as={`/post/edit/${p.id}`}
                        >
                          <Link>
                            <Button ml='auto'>edit</Button>
                          </Link>
                        </NextLink>
                      </Box>}
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
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
