const { Codes } = require("../models");

const createCode = async (req, res) => {
  try {
    const { code, results, codeType } = req.body;

    if (!code || !results || !codeType) {
      return res
        .status(403)
        .json({ success: false, message: "Missing required fields." });
    }

    const newCode = await Codes.create({
      code,
      results,
      codeType,
    });

    return res.status(201).json({
      success: true,
      message: "Code created successfully",
      data: newCode,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all codes
const getCode = async (req, res) => {
  try {
    const codes = await Codes.findAll();
    res.status(200).json({ success: true, data: codes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get code by ID
const getCodeById = async (req, res) => {
  try {
    const codeId = req.params.codeId;
    const code = await Codes.findByPk(codeId);
    if (!code) {
      return res
        .status(404)
        .json({ success: false, message: "Ooops!, Code not found" });
    }
    res.status(200).json({ success: true, data: code });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a code by ID
const updateCode = async (req, res) => {
  const codeId = req.params.codeId;
  const { code, results, codeType } = req.body;

  try {
    const codeRecord = await Codes.findByPk(codeId);
    if (!codeRecord) {
      return res.status(404).json({ success: false, message: "Code not found" });
    }

    // Update the record
    await codeRecord.update({ code, results, codeType });

    return res.status(200).json({
      success: true,
      message: "Code updated successfully",
      data: codeRecord,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const deleteCode = async (req, res) => {
  const codeId = req.params.codeId;
  try {
    const deletedCode = await Codes.destroy({
      where: {
        id: codeId,
      },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "deleted succcessfully",
        data: deletedCode,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCode,
  getCode,
  getCodeById,
  updateCode,
  deleteCode,
};
