import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { NavBar } from './NavBar';
import { Wrapper, WrapperVariant } from './wrapper';

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

