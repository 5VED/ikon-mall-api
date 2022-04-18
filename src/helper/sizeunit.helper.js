const SizeUnit = require("../models/sizeunit.model");

exports.createSizeUnit = (payload) => {
  const faq = new SizeUnit({
    unit: payload.unit,
  });
  return faq.save();
};

exports.getAllSizeUnits = async (skip, limit) => {
  return SizeUnit.find({}).skip(parseInt(skip)).limit(parseInt(limit)).exec();
};

exports.deleteUnit = async (unitId) => {
  return SizeUnit.updateOne({ _id: unitId }, { $set: { isDeleted: true } });
};

exports.getSizeUnit = async (unitId) => {
  return SizeUnit.findById({ _id: unitId });
};

exports.modifySizeUnit = async (sizeId, payload) => {
  return SizeUnit.updateOne({ _id: sizeId }, { $set: { unit: payload } });
};
