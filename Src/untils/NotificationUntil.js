const adminfirebase = require("firebase-admin");
const serviceAccount = require("./Src/untils/umatefirebase.json");

adminfirebase.initializeApp({
  credential: adminfirebase.credential.cert(serviceAccount),
});
async function getAccessToken() {
  const token = await adminfirebase.credential
    .cert(serviceAccount)
    .getAccessToken();
  console.log("token.access_token", token.access_token);

  return token.accessToken;
}
module.exports = { getAccessToken };
