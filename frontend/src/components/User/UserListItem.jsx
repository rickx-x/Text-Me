import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleClick }) => {
  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      bg="#e5e8eb"
      _hover={{
        background: "#FDDA0D",
        color: "#7b3f00",
      }}
      display="flex"
      w="100%"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text fontSize="18px">{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
