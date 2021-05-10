import React from 'react';
import { Button, Flex, IconButton } from '@chakra-ui/react';
import { PostsQuery, useVoteMutation } from '../generated/graphql';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { PostSnippetFragment } from '../generated/graphql';

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  
  const [, vote] = useVoteMutation();
  return (
    <Flex direction='column' alignItems='center' justifyContent='center' mr='4'>
      <Button
        my={2}
        aria-label='upvote'
        onClick={() => {
          vote({ postId: post.id, value: 1 });
        }}
      >+</Button>

      <Box>{post.points}</Box>

      <Button
        my={2}

        aria-label='downvote'
        onClick={() => {
          vote({ postId: post.id, value: -1 });
        }}
      >-</Button>
    </Flex>
  );
};
