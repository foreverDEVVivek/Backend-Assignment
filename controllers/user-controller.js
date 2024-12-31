const User = require("../models/users.js");
const UserInfo = require("../models/userInfo.js");



//Get your profile information
const getProfileDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select({ password: 0 });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Get Your account details
const getYourDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate({
        path: "userData",
        model: "UserInfo",
      })
      .select({
        password: 0,
      });

    // Ensure `userData` is included even if it's null
    if (!user.userData) {
      user.userData = null;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// / Controller to add a friend
const addFriend = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    // Step 1: Get user's UserInfo and friend's UserInfo user->userInfo, friend->userInfoFriend
    let userInfo = await UserInfo.findById(userId);
    let userInfoFriend = await UserInfo.findById(friendId);

    // Step 2: Check if the friend is already in the friends list
    if (userInfo.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ success: false, message: "Friend already added." });
    }
    if (userInfoFriend.friends.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Friend already added." });
    }

    // Step 3: Add the friend's ID to the friends array
    userInfo.friends.push(friendId);
    userInfoFriend.friends.push(userId);

    // Step 4: Save the updated UserInfo and user
    await userInfo.save();
    await userInfoFriend.save();

    res
      .status(200)
      .json({ success: true, message: "Friend added successfully." });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const removeFriend = async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    //step 1: get user's userInfo user->userInfo friend->friendInfo
    let userInfoUser = await UserInfo.findById(userId);
    let userInfoFriend = await UserInfo.findById(friendId);

    //step 2: check if friend is in the friends list or not
    if (!userInfoUser.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ success: false, message: "Friend not found." });
    }
    if (!userInfoFriend.friends.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Friend not found." });
    }

    //step 3: remove friend's id from friends array
    userInfoUser.friends = userInfoUser.friends.filter(
      (friend) => friend.toString() !== friendId
    );
    userInfoFriend.friends = userInfoFriend.friends.filter(
      (friend) => friend.toString() !== userId
    );

    await userInfoUser.save();
    await userInfoFriend.save();

    //step4: send the response
    res
      .status(200)
      .json({ success: true, message: "Friend removed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  removeFriend,
  getYourDetails,
  addFriend,
  getProfileDetails,
};
