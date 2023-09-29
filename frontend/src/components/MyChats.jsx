import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Text,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { AddIcon } from "@chakra-ui/icons";
import { getChat } from "../config/chatsLogic";
import GroupChatModal from "./misc/GroupChatModal";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured ",
        description: "failed to load chats",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My Chats</Text>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "18px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="%f8f8f8"
        w="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#FFE302" : "#f5f5f5"}
                // color={selectedChat === chat ? "black" : "white"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                {/* name of the chat */}
                <Text>
                  {chat.isGroupChat ? (
                    <Wrap>
                      <WrapItem>
                        <i className="bx-lg bx bxs-group"></i>
                      </WrapItem>
                      <WrapItem pl={2} display="flex" flexDir="column">
                        <Text fontSize="xl">{chat.chatName}</Text>
                        <Text>
                          {chat.latestMessage ? (
                            <p>
                              <b>{chat.latestMessage.sender.name + ": "}</b>
                              {chat.latestMessage.content}
                            </p>
                          ) : (
                            <>click to start chatting</>
                          )}
                        </Text>
                      </WrapItem>
                    </Wrap>
                  ) : (
                    <Wrap>
                      <WrapItem>
                        <Avatar src={getChat(loggedUser, chat.users).pic} />
                      </WrapItem>
                      <WrapItem pl={2} display="flex" flexDir="column">
                        <Text fontSize="xl">
                          {getChat(loggedUser, chat.users).name}
                        </Text>
                        <Text>
                          {/* need to work here */}
                          {chat.latestMessage ? (
                            <p>
                              <b>{chat.latestMessage.sender.name + ": "}</b>
                              {chat.latestMessage.content}
                            </p>
                          ) : (
                            <>click to start chatting</>
                          )}
                        </Text>
                      </WrapItem>
                    </Wrap>
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
