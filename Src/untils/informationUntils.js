const { v4: uuidv4 } = require("uuid");
function generateUniqueID() {
  return uuidv4();
}
module.exports = {
  generateUniqueID,
};

