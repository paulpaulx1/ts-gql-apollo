import React from "react"
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { Button } from "@chakra-ui/react";

interface EditDeleteButtonsProps {
    id: number;
    creatorId: number;
  }

export const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
    id,
    creatorId
}) => {
const { data: meData } = useMeQuery()
const [deletePost] = useDeletePostMutation()

if (meData?.me?.id !== creatorId) {
    return null
}

return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <Button as={Link} mr={4} icon="edit" aria-label="Edit Post" >edit</Button>
      </NextLink>
      <Button

        aria-label="Delete Post"
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
 
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
      >delete</Button>
    </Box>
  );
};