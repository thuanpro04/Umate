const hanleLoginWithGoogle = async (req, res) => {
  console.log("hêlllo");
  const users = req.body;
  console.log(users);

  res.status(200).send({ message: "Login successful" });
};
module.exports = { hanleLoginWithGoogle };
