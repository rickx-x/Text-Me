import React, { useEffect } from "react";
import { Container, Text, Box } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <div className="bgImg">
      <Container>
        <Box mt="10px" d="flex" bg="white" p={3} borderRadius="4px" mb="7px">
          <Text fontSize="4xl" pl="35%" fontWeight="100">
            Text-Me
          </Text>
        </Box>
        <Box borderRadius="10px">
          <Tabs
            variant="soft-rounded"
            colorScheme="green"
            fontSize="3xl"
            bg="white"
          >
            <TabList pt={"5px"}>
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
