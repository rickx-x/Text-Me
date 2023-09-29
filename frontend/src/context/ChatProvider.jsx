import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Chatcontext = createContext("");
const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState("");
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Chatcontext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </Chatcontext.Provider>
  );
};
export const ChatState = () => {
  return useContext(Chatcontext);
};
export default ChatProvider;
