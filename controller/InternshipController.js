const cloudinary = require("cloudinary");
const internshipModel = require("../models/internship");
const { sendAcceptanceEmail, sendRejectionEmail } = require("../utils/mail");

// Cloudinary Config
cloudinary.config({
  cloud_name: "dkzby6kvb",
  api_key: "996867418246358",
  api_secret: "0CkJzRqGRNB7kulUzw-nmqZEWXk",
});

class internshipController {
  // CREATE
  static internshipInsert = async (req, res) => {
    try {
      const { name, email, phone, message, internshipDomain, internshipType, skills } = req.body;

      if (!name || !email || !phone || !message || !internshipDomain) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      if (!req.files?.resume) {
        return res.status(400).json({ success: false, message: "Resume file is required" });
      }

      const file = req.files.resume;

      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "internships",
        resource_type: "auto",
      });

      const data = await internshipModel.create({
        name,
        email,
        phone,
        message,
        internshipDomain,
        internshipType,
        skills: skills ? skills.split(",").map(s => s.trim()) : [],
        resume: { public_id: uploaded.public_id, url: uploaded.secure_url },
      });

      res.status(201).json({ success: true, message: "Internship created successfully", data });
    } catch (error) {
      console.error("Insert error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  // GET ALL
  static internshipDisplay = async (req, res) => {
    try {
      const internships = await internshipModel.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: internships });
    } catch (error) {
      console.error("Fetch error:", error);
      res.status(500).json({ success: false, message: "Fetch error" });
    }
  };

  // GET SINGLE
  static viewInternship = async (req, res) => {
    try {
      const internship = await internshipModel.findById(req.params.id);
      if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });
      res.status(200).json({ success: true, data: internship });
    } catch (error) {
      console.error("View error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  // UPDATE
  static internshipUpdate = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, message, internshipDomain, internshipType, skills, status } = req.body;

      const updatedData = {
        name,
        email,
        phone,
        message,
        internshipDomain,
        internshipType,
        skills: skills ? skills.split(",").map(s => s.trim()) : [],
        status,
      };

      if (req.files?.resume) {
        const file = req.files.resume;
        const uploaded = await cloudinary.uploader.upload(file.tempFilePath, { folder: "internships", resource_type: "auto" });
        updatedData.resume = { public_id: uploaded.public_id, url: uploaded.secure_url };

        const old = await internshipModel.findById(id);
        if (old?.resume?.public_id) await cloudinary.uploader.destroy(old.resume.public_id, { resource_type: "auto" });
      }

      const updated = await internshipModel.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Internship not found" });

      // Send email if status changed
      if (status === "Selected") {
        await sendAcceptanceEmail(updated.email, updated.name, updated.internshipDomain);
      } else if (status === "Rejected") {
        await sendRejectionEmail(updated.email, updated.name, updated.internshipDomain);
      }

      res.status(200).json({ success: true, message: "Updated successfully", data: updated });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  // DELETE
  static internshipDelete = async (req, res) => {
    try {
      const deleted = await internshipModel.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Internship not found" });

      if (deleted.resume?.public_id) await cloudinary.uploader.destroy(deleted.resume.public_id, { resource_type: "auto" });

      res.status(200).json({ success: true, message: "Deleted successfully", data: deleted });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  // DELETE multiple internships
  static internshipBulkDelete = async (req, res) => {
    try {
      const { ids } = req.body; // array of internship IDs

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "No IDs provided" });
      }

      // Find all matching internships
      const internships = await internshipModel.find({ _id: { $in: ids } });

      if (internships.length === 0) {
        return res.status(404).json({ success: false, message: "No internships found" });
      }

      // Delete associated files from Cloudinary
      for (const internship of internships) {
        if (internship.resume?.public_id) {
          await cloudinary.uploader.destroy(internship.resume.public_id, { resource_type: "auto" });
        }
      }

      // Delete from database
      await internshipModel.deleteMany({ _id: { $in: ids } });

      res.status(200).json({
        success: true,
        message: `Deleted ${internships.length} internships successfully`,
        data: internships
      });
    } catch (error) {
      console.error("Bulk delete error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };


  // GET INTERNSHIPS BY STATUS
  static internshipByStatus = async (req, res) => {
    try {
      const { status } = req.params;
      if (!["Pending", "Selected", "Rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const internships = await internshipModel.find({ status }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, message: `Internships with status ${status} retrieved`, data: internships });
    } catch (error) {
      console.error("Status filter error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  // UPDATE STATUS
  static updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["Pending", "Selected", "Rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const updated = await internshipModel.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Internship not found" });

      if (status === "Selected") {
        await sendAcceptanceEmail(updated.email, updated.name, updated.internshipDomain);
      } else if (status === "Rejected") {
        await sendRejectionEmail(updated.email, updated.name, updated.internshipDomain);
      }

      res.status(200).json({ success: true, message: `Status updated to ${status}`, data: updated });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ success: false, message: "Server error during status update" });
    }
  };

  // ACCEPT INTERNSHIP
  static acceptInternship = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await internshipModel.findByIdAndUpdate(id, { status: "Selected" }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Internship not found" });

      await sendAcceptanceEmail(updated.email, updated.name, updated.internshipDomain);
      res.status(200).json({ success: true, message: "Internship accepted and email sent", data: updated });
    } catch (error) {
      console.error("Accept error:", error);
      res.status(500).json({ success: false, message: "Server error during acceptance" });
    }
  };

  // REJECT INTERNSHIP
  static rejectInternship = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await internshipModel.findByIdAndUpdate(id, { status: "Rejected" }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Internship not found" });

      await sendRejectionEmail(updated.email, updated.name, updated.internshipDomain);
      res.status(200).json({ success: true, message: "Internship rejected and email sent", data: updated });
    } catch (error) {
      console.error("Reject error:", error);
      res.status(500).json({ success: false, message: "Server error during rejection" });
    }
  };
}

module.exports = internshipController;
