import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

// import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery(
    // skip: isServer()
  );
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;
  if (fetching) {
    //user not logged in
  } else if (!fetching && !data?.me) {
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
          {data?.me.username}
        </Box>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} postion='sticky' top={0} p={4} bg='tomato'>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};
