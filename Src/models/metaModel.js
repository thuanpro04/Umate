const { default: mongoose } = require("mongoose");
const metaSchema = new mongoose.Schema({
  lastScrapeTime: { type: Date, default: null },
});
const MetaModel = mongoose.model("meta", metaSchema);
module.exports = { MetaModel };
