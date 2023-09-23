import asyncHandler from "express-async-handler";
import Chat from "../models/chat.js";
import User from "../models/user.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.sendStatus(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat, _id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    // { $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] },
    Chat.find({ $or: [{ users: req.user._id }, { groupAdmin: req.user._id }] })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  //"[\"_id\",\"_id\"]";
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "please fill all the Fields" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  const groupChat = await Chat.create({
    chatName: req.body.name,
    isGroupChat: true,
    users: users,
    groupAdmin: req.user,
  });
  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
});

const renameGroup = asyncHandler(async (req, res) => {
  // group id , new name -->req.body.

  const { chatId, chatName } = req.body;
  const UpdatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!UpdatedChat) {
    res.status(400);
    throw new Error("chat not found");
  } else {
    res.status(200).json(UpdatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const UpdatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!UpdatedChat) {
    res.status(400);
    throw new Error("chat not found");
  } else {
    res.status(200).json(UpdatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const UpdatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!UpdatedChat) {
    res.status(400);
    throw new Error("chat not found");
  } else {
    res.status(200).json(UpdatedChat);
  }
});

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
