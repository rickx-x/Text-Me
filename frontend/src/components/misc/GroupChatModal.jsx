import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import UserListItem from "../User/UserListItem";
import UserBadgeItem from "../User/UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      // console.log(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured ",
        description: "failed fetch users",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupName || !members) {
      toast({
        title: "Fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(members.map((mem) => mem._id)),
        },
        config
      );

      await setChats((prevChat) => [data, ...prevChat]);
      setLoading(false);
      onClose();
      toast({
        title: "Group Successfully Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "couldn't create the group",
        description: "someting gone wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      // console.log(error);
    }
  };

  const handleDelete = (userToBeDeleted) => {
    setMembers(members.filter((mem) => mem._id !== userToBeDeleted._id));
  };
  const addUserToGroup = (userToBeAdded) => {
    if (members.includes(userToBeAdded)) {
      toast({
        title: "User already the part of group",
        status: "warning",
        duration: 1500,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setMembers([...members, userToBeAdded]);
  };
  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent fontSize="35px" display="flex" justifyContent="center">
          <ModalHeader>Create Group Chat </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* Selected Users */}
            <Box display="flex" flexWrap="wrap">
              {members.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {/* render Search Users */}
            {loading ? (
              <Spinner />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => addUserToGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
