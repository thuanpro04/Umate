const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/usersModel");
const { findUserById } = require("../Services/userServices");
const getJsonWebToken = async (email, id) => {
  const payload = {
    email,
    id,
  };
  const token = jwt.sign(payload, process.env.SECRETKEY, {
    expiresIn: "7d",
  });
  return token;
};
const getUserInfo = async (existingUser, email) => {
  return {
    authSlice: {
      userId: existingUser.userId,
      online: existingUser.online,
      theme: existingUser.theme ?? "light",
      accesstoken: await getJsonWebToken(email, existingUser.id),
      language: existingUser.language ?? "vi",
    },
    profileSlice: {
      name: existingUser.name,
      email: existingUser.email,
      avatar: existingUser.avatar,
      bio: existingUser.bio,
      sex: existingUser.sex,
      address: existingUser.address,
      link: existingUser.link,
      className: existingUser.className,
      majoring: existingUser.majoring,
      majorCategory: existingUser.majorCategory,
      myLove: existingUser.myLove ?? [],
    },
    friendSlice: {
      friends: existingUser.friends,
      friendRequests: existingUser.friendRequests,
      removeFriends: existingUser.removeFriends,
      block: existingUser.block,
    },
    eventSlice: {
      eventShares: existingUser.eventShares,
      like: existingUser.like ?? 0,
    },
  };
};
const handleLoginWithGoogle = async (req, res) => {
  try {
    const userInfo = req.body;
    // Kiểm tra người dùng có tồn tại không
    const existingUser = await findUserById(userInfo.userId);
    console.log("existingUser", existingUser);

    let user;
    if (existingUser) {
      await UserModel.findByIdAndUpdate(existingUser.id, {
        ...userInfo,
        updateAt: Date.now(),
      });
      user = await getUserInfo(existingUser, userInfo.email);

      console.log("Update Done.", user);
      // Người dùng mới, tạo tài khoản mới
    } else {
      // Cập nhật thông tin người dùng hiện tại nếu cần
      const newUser = new UserModel({
        userId: userInfo.userId,
        name: userInfo.name,
        email: userInfo.email,
        familyName: userInfo.familyName,
        givenName: userInfo.givenName,
        avatar: userInfo.avatar,
        access: userInfo.access,
        online: true,
        theme: "light",
      });
      // console.log("newUser", newUser);

      await newUser.save();
      user = await getUserInfo(newUser._doc, userInfo.email);
      console.log("Create user.", user);
      // Sau khi cập nhật, trả về phản hồi
    }

    res.status(200).json({
      message: "Login with google successfully!!",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};
module.exports = { handleLoginWithGoogle };
