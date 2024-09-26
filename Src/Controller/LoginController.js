const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel.js");
const bcryp = require("bcrypt");
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
    const { id, email, name, familyName, givenName, photo, access } = req.body;
    console.log(req.body);

    // Process the received data here
    // For example, you can store the user data in a database
    const existingUser = await usersModel.findOne({ email });
    if (!existingUser) {
      const newUser = new usersModel({
        id,
        name,
        email,
        familyName,
        givenName,
        photo,
        access,
      });
      await newUser.save();
    }
    res.status(200).json({
      message: "Login Successfully !!!",
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        familyName: newUser.familyName,
        givenName: newUser.givenName,
        photo: newUser.photo,
        accesstoken: await getJsonWebToken(email, newUser.id),
        access: newUser.access,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};
module.exports = { hanleLoginWithGoogle };
