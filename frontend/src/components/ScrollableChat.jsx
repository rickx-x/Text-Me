import React, { useCallback } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatsLogic";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((msg, i) => (
          <div style={{ display: "flex" }} key={msg._id}>
            {(isSameSender(messages, msg, i, user._id) ||
              isLastMessage(messages, msg, i, user._id)) && (
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={msg.sender._id}
                src={msg.sender.pic}
              />
            )}
            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user._id ? "#bee3f8" : "#b9f5d0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, msg, i, user._id),
                marginTop: isSameUser(messages, msg, i, user._id) ? 3 : 10,
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
