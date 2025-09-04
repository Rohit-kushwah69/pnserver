const contactModel = require('../models/contact')

class ContactController {
    static contact = async (req, res) => {
        try {
            const { name, email, phone, message } = req.body;

            if (!name || !email || !phone || !message) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }

            const newContact = new contactModel({ name, email, phone, message });
            const contact = await newContact.save();

            return res.status(201).json({
                success: true,
                message: "Contact form submitted successfully",
                contact,
            });
        } catch (error) {
            console.error("Error inserting contact:", error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    };

    // static insertContact = async (req, res) => {
    //     try {
    //         const { name, email, phone, message } = req.body;
    //         if (!name || !email || !phone || !message) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "All fields are required",
    //             });
    //         }
    //         const newContact = await contactModel.create({ name, email, phone, message });
    //         return res.status(201).json({
    //             success: true,
    //             message: "Data inserted successfully",
    //             contactData: newContact,
    //         });
    //     } catch (error) {
    //         console.error("Contact Insert Error:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'API error',
    //         });
    //     }
    // }

    // static display = async (req, res) => {
    //     try {
    //         const contact = await contactModel.find();
    //         return res.status(200).json({
    //             success: true,
    //             message: "Contacts fetched successfully",
    //             contact: contact
    //         });
    //     } catch (error) {
    //         console.error("Display Contact Error:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'API error',
    //             error: error.message
    //         });
    //     }
    // };
  
    static display = async (req, res) => {
        try {
            const contact = await contactModel.find();
            return res.status(200).json({
                success: true,
                message: "display api successfully",
                contact: contact
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'display api error',
                error: error.message
            })

        }
    }
    static view = async (req, res) => {
        try {
            const id = req.params.id;
            const contact = await contactModel.findById(id);
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: "Contact not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Contact fetched successfully",
                contact: contact
            });
        } catch (error) {
            console.error("View Contact Error:", error);
            return res.status(500).json({
                success: false,
                message: 'API error',
                error: error.message
            });
        }
    };
    static delete = async (req, res) => {
        try {
            const id = req.params.id;
            const contact = await contactModel.findByIdAndDelete(id);
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: "Contact not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Contact deleted successfully",
                contact: contact
            });
        } catch (error) {
            console.error("Delete Contact Error:", error);
            return res.status(500).json({
                success: false,
                message: 'API error',
                error: error.message
            });
        }
    };
    static update = async (req, res) => {
        try {
            const id = req.params.id;
            const { name, email, phone, message } = req.body;

            if (!name || !email || !phone || !message) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }

            const contact = await contactModel.findByIdAndUpdate(
                id,
                { name, email, phone, message },
                { new: true }
            );

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: "Contact not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Contact updated successfully",
                contact: contact,
            });

        } catch (error) {
            console.error("Update Contact Error:", error);
            return res.status(500).json({
                success: false,
                message: "API error",
                error: error.message
            });
        }
    };

}
module.exports = ContactController