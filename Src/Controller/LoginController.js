const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/usersModel");
const getJsonWebToken = async (email, id) => {
  const payload = {
    email,
    id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const hanleLoginWithGoogle = async (req, res) => {
  try {
    const userInfo = req.body;
    console.log(req.body);
    const user = { ...userInfo, avatar: userInfo.photo };
    // Kiểm tra người dùng có tồn tại không
    const existingUser = await UserModel.findOne({ email: userInfo.email });
    if (existingUser) {
      await UserModel.findByIdAndUpdate(existingUser.id, {
        ...userInfo,
        updateAt: Date.now(),
      });
      user.accesstoken = await getJsonWebToken(userInfo.email, existingUser.id);
      console.log("Update Done.");
      // Người dùng mới, tạo tài khoản mới
    } else {
      // Cập nhật thông tin người dùng hiện tại nếu cần
      const newUser = new UserModel({
        userId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        familyName: userInfo.familyName,
        givenName: userInfo.givenName,
        avatar: userInfo.photo,
        access: userInfo.access,
      });
      await newUser.save();
      user.accesstoken = await getJsonWebToken(userInfo.email, userInfo.id);
      console.log("newUser", user.accesstoken);
      console.log("Create user.");
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
module.exports = { hanleLoginWithGoogle };
