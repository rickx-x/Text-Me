import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { getChat } from "../config/chatsLogic";
import ProfileModal from "./misc/ProfileModal";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3001";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const fetchMessages = async () => {
    if (!messages) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured ",
        description: "failed to fetch chats",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        // console.log(messages);
      } catch (error) {
        toast({
          title: "Error Occured ",
          description: "failed to send message",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // { typing Indicator }
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "20px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <HStack>
                  <Avatar
                    src={getChat(user, selectedChat.users).pic}
                    mr={2}
                  ></Avatar>
                  <Text>
                    {getChat(user, selectedChat.users).name.toUpperCase()}
                  </Text>
                </HStack>
                <ProfileModal user={getChat(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <HStack>
                  <AvatarGroup max={2}>
                    {selectedChat.users.map((user) => (
                      <Avatar key={user._id} src={user.pic}></Avatar>
                    ))}
                  </AvatarGroup>
                  <Text>{selectedChat.chatName.toUpperCase()}</Text>
                </HStack>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="blackAlpha.200"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {/* Messages here */}
            {loading ? (
              <Spinner
                thickness="4px"
                speed="1s"
                emptyColor="white"
                color="blue.500"
                size="xl"
                margin=" auto "
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                {/* Messages */}
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div>typing...</div> : <></>}
              <InputGroup>
                <Input
                  variant="filled"
                  onChange={typingHandler}
                  value={newMessage}
                  color="blackAlpha.800"
                  placeholder="Enter a message"
                />
                <InputRightElement>
                  <Button
                    h="1.75rem"
                    mr={1.5}
                    size={"sm"}
                    _hover={{ bg: "green.300" }}
                    onClick={sendMessage}
                  >
                    <ArrowRightIcon />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
