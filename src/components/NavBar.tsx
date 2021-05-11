import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const { data, loading } = useMeQuery({
    skip: isServer()
  });
  const apolloClient = useApolloClient();
  const [logout, {loading: logoutFetching  }] = useLogoutMutation();

  let body = null;
  if (loading) {
    //user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link color='whitesmoke' mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href='register'>
          <Link color='whitesmoke'>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align='center'>
         <NextLink href='/create-post'>
            <Button bg='orange' as={Link} ml={'auto'} mr='2'>
              create post{' '}
            </Button>
          </NextLink>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore()
          }}
          isLoading={logoutFetching}
          variant='link'
          ml={3}
        >logout
        </Button>
        <Box ml={3}>
          {data.me.username}
        </Box>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} postion='sticky' top={0} p={4} bg='tomato'>
      <Flex flex={1} m='auto' align="center" maxW={800}>
      <Link><NextLink href='/'>
      <Heading>phreddit</Heading>
      </NextLink>
      </Link>
      <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Flex>
  );
};
