const FAQ = require("../models/faq");

exports.createFaq = async (payload) => {
  const faq = new FAQ({
    userId: payload.userId,
    shopId: payload.shopId,
    category: payload.category,
    question: payload.question,
    answer: payload.answer,
  });
  return faq.save();
};

exports.getFaqHelper = async (params) => {
  const { skip, limit } = params;

  const faqs = await FAQ.find().skip(skip).limit(limit).exec();
  return faqs;
};
