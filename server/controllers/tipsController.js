const { Tips } = require("../models");
const createTips = async (req, res) => {
	const { league,date,time, odds, tipsType, prediction, match } = req.body;
	// league, match, prediction, odds, tipsType
	if (!league || !date || !time || !match || !prediction || !odds || !tipsType) {
		return res
			.status(400)
			.json({ success: false, message: "Please fill all the fields." });
	}
	try {
		await Tips.create({
			league,
			date,
			time,
			odds,
			tipsType,
			prediction,
			match,
		});

		res.status(201).json({ success: true, message: "Tip created successfully." });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const deleteTip = async (req, res) => {
	const tipId = req.params.tipId;
	try {
		await Tips.destroy({
			where: {
				id: tipId,
			},
		});

		res
			.status(201)
			.json({ success: true, message: "Tip deleted succcessfully." });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
const updateTip = async (req, res) => {
	const tipId = req.params.tipId;
	const { league,date,time, odds, tipsType, prediction, results, match } = req.body;
	try {
		const tip = await Tips.findByPk(tipId);

		if (!tip) {
			return res.status(404).json({ success: false, message: "Ooops!, No such tip" });
		}

		await Tips.update(
			{ league,date, time, odds, tipsType, prediction, results, match },
			{
				where: { id: tipId },
			}
		);

		res.status(201).json({ success: true, message: "Tip Updated successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
const getTips = async (req, res) => {
	try {
		const tips = await Tips.findAll();
		res.status(200).json({success: true, data: tips});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const getTipById = async (req, res) => {
	const tipId = req.params.tipId;
	try {
		const tip = await Tips.findOne({ where: { id: tipId } });

		if (!tip) {
			return res.status(404).json({ success: false, message: "Ooops!, No such tip" });
		}
		res.status(200).json({success: true, data: tip});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = {
	deleteTip,
	createTips,
	updateTip,
	getTipById,
	getTips
}
