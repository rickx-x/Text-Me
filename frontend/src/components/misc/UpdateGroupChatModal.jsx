import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../User/UserBadgeItem";
import axios from "axios";
import UserListItem from "../User/UserListItem";
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [chatName, setChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [renameLoading, setRenameLoading] = useState();

  const toast = useToast();
  const handleRemoveUser = async (userToBeRemoved) => {
    if (
      selectedChat.groupAdmin._id === userToBeRemoved._id &&
      userToBeRemoved._id === user._id
    ) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
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

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToBeRemoved._id,
        },
        config
      );
      userToBeRemoved._id === user._id
        ? setSelectedChat()
        : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "an error occured",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const addUserToGroup = async (userToBeAdded) => {
    if (await selectedChat.users.find((u) => u._id === userToBeAdded._id)) {
      toast({
        title: "User already the part of group",
        status: "warning",
        duration: 1500,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    if (user._id !== selectedChat.groupAdmin._id) {
      toast({
        title: "only admins can add or Remove Someone",
        status: "warning",
        duration: 1500,
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

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToBeAdded._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "an error occured",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!chatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: chatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error can't update group name",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top-left",
      });
      setRenameLoading(false);
    }
    setChatName("");
  };
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
      setLoading(false);
    }
  };
  return (
    <div>
      <IconButton
        display={{ base: "flex" }}
        icon={<EditIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" pb={3}>
              {/* {selectedChat.groupAdmin} */}
              {/* <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemoveUser(u)}
              /> */}

              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemoveUser(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="chat name"
                mb={3}
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
              ></Input>
              <Button
                variant="solid"
                colorScheme="red"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
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
            <Button onClick={() => handleRemoveUser(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModal;
