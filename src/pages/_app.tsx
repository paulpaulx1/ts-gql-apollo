import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import theme from '../theme';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// const client = new ApolloClient({
//   uri: 'http://localhost:4111/graphql' as string,
//   credentials: 'include',
//   cache: new InMemoryCache(),
// });

function MyApp({ Component, pageProps }:any) {
  return (
    // <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        {/* </ColorModeProvider> */}
      </ChakraProvider>
      // </ApolloProvider>
  );
}

export default MyApp;