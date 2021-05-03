import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // pause: isServer()
  });
  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link color='whitesmoke' mr={2}>login</Link>
        </NextLink>
        <NextLink href='register'>
          <Link color='whitesmoke'>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant='link'
        >
          logout
        </Button>
        <Box pl={'4'} ml={'auto'}>
          {data.me.username}
        </Box>
      </Flex>
    );
  }
  return (
    <Flex p={4} bg='tomato'>
      {body}
      {/* <Box ml={'auto'}>
        <NextLink href='/login'>
          <Link color='whitesmoke' mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href='register'>
          <Link color='whitesmoke'>register</Link>
        </NextLink>
      </Box> */}
    </Flex>
  );
};
