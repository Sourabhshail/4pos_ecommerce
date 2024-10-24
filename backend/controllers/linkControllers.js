const formidable = require("formidable");
const { responseReturn } = require("../utiles/response");
const linkModel = require("../models/linkModel");
const {
  mongo: { ObjectId },
} = require("mongoose");

class linkController {
  add_linksContent = async (req, res) => {
    try {
      const { sellerId } = req.params;
      const { tab, content } = req.body;

      // Update if exists, otherwise create new
      const updatedContent = await linkModel.findOneAndUpdate(
        { sellerId, tab },
        { content },
        { new: true, upsert: true }
      );

      res.json({ [updatedContent.tab]: updatedContent.content });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating content", error: error.message });
    }
  };

  get_linksContent = async (req, res) => {
    try {
      const { sellerId } = req.params;
      const contents = await linkModel.find({ sellerId });
      const contentObject = contents.reduce((acc, item) => {
        acc[item.tab] = item.content;
        return acc;
      }, {});
      res.json(contentObject);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching content", error: error.message });
    }
  }
}

module.exports = new linkController();
