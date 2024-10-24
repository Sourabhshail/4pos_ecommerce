const contactModel = require("../models/contactModel");
const { responseReturn } = require("../utiles/response");

class contactController {
  saveContact = async (req, res) => {
    const { name, email, subject, message, sellerId } = req.body;

    try {
      const contact = await contactModel.create({
        name,
        email,
        subject,
        message,
        sellerId,
      });

      responseReturn(res, 201, {
        message: "Message sent successfully",
        contact,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  getContacts = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const contacts = await contactModel.find({ sellerId });
      responseReturn(res, 200, { contacts });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new contactController();
